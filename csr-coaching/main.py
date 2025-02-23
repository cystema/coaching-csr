import os
import uvicorn
from fastapi import FastAPI, Response, Request
from fastapi.responses import JSONResponse
from twilio.twiml.voice_response import VoiceResponse, Start
from twilio.rest import Client
import json
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone
import uuid  # Import the uuid module

app = FastAPI()

# Initialize Firebase
cred_file_path = os.path.join(os.path.dirname(__file__), 'csr-coaching-firebase-adminsdk-fbsvc-b4c1248b02.json')
cred = credentials.Certificate(cred_file_path)
firebase_admin.initialize_app(cred)
db = firestore.client()


@app.get("/")
async def health():
    """Quick health check endpoint for deployment monitoring."""
    return Response(status_code=200, media_type="application/json")


# Use environment variables for Twilio credentials
TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


@app.route("/voice", methods=["GET", "POST"])
async def handle_voice(request: Request):
    """
    Handles incoming calls and prompts the caller to enter
    a 10-digit number for conferencing.
    """
    resp = VoiceResponse()
    gather = resp.gather(num_digits=10,
                         action="/dial",
                         method="POST",
                         timeout=20)
    gather.say(
        "Please enter the 10-digit number of the person you want to conference with."
    )

    # If no input, repeat the message
    resp.redirect("/voice")
    return Response(str(resp), media_type="application/xml")


@app.post("/dial")
async def handle_dial(request: Request):
    try:
        form = await request.form()
        digits = form.get('Digits', '')
        call_sid = form.get('CallSid', '')
        from_number = form.get('From', '')  # Original caller's number

        #HACK
        ORIG_CALLER_PHONE = from_number
        resp = VoiceResponse()

        if not digits or len(digits) != 10:
            resp.say(
                "Invalid input. Please ensure you entered a 10-digit number.")
            resp.redirect("/voice")
            return Response(str(resp), media_type="application/xml")

        conference_name = f"conf_{call_sid}"
        combined_call_id = str(uuid.uuid4())  # Generate a unique ID

        # 1. Store the original caller in Firestore
        doc_ref = db.collection('transcriptions').document(
            combined_call_id)  # Use the unique ID
        doc_ref.set(
            {
                'original_caller': from_number,
                'started_at': datetime.now(timezone.utc).isoformat(),
                'status': 'ongoing',
                'initial_call_sid': call_sid  # Store the first call SID
            },
            merge=True)

        # 2. Place the original caller into the conference
        dial = resp.dial()
        dial.conference(
            conference_name,
            start_conference_on_enter=True,
            record=True,
            record_timeout=10,
            status_callback=
            f"/call_ended/{combined_call_id}",  # Pass the unique ID
            status_callback_event="completed",
            transcribe=True,
            transcribe_callback=f"/transcription_callback/{combined_call_id}"
        )  # Pass the unique ID

        # 3. Initiate an outbound call to the second participant
        outbound_call = client.calls.create(
            to=f"+1{digits}",
            from_=TWILIO_PHONE_NUMBER,
            url=
            f"https://{request.base_url.hostname}/join_conference/{conference_name}/{combined_call_id}"
        )  # Pass the combined ID

        #Update with second call SID:
        doc_ref.update({'second_call_sid': outbound_call.sid})

        return Response(str(resp), media_type="application/xml")

    except Exception as e:
        print(f"Error in /dial: {str(e)}")
        resp = VoiceResponse()
        resp.say("An error occurred. Please try again.")
        resp.redirect("/voice")
        return Response(str(resp), media_type="application/xml")


@app.post("/join_conference/{conference_name}/{combined_call_id}")
async def join_conference(conference_name: str, combined_call_id: str,
                          request: Request):
    """
    Joins the second participant to the conference.
    """
    resp = VoiceResponse()
    resp.say("Joining the conference...")

    # For real-time transcription, add a <Start> element with <Transcription>.
    start = Start()
    start.transcription(
        status_callback_url=
        f"https://{request.base_url.hostname}/transcription_callback/{combined_call_id}",
        inbound_track_label='agent',
        outbound_track_label='customer')
    resp.append(start)

    dial = resp.dial()
    dial.conference(conference_name,
                    start_conference_on_enter=True,
                    record=True,
                    record_timeout=10,
                    status_callback=f"/call_ended/{combined_call_id}",
                    status_callback_event="completed")

    return Response(str(resp), media_type="application/xml")


@app.post("/call_ended/{combined_call_id}")
async def handle_call_ended(combined_call_id: str, request: Request):
    """
    Triggered when the call completes.
    Generates coaching feedback using Gemini AI and initiates feedback call.
    """
    form_data = await request.form()
    recording_sid = form_data.get('RecordingSid')
    call_sid = form_data.get('CallSid')
    to_number = form_data.get('To')  # The number that was called

    if recording_sid and call_sid:

        doc_ref = db.collection('transcriptions').document(
            combined_call_id)  # Use the unique ID

        # Safely get the doc, or empty if none
        doc_snapshot = doc_ref.get()
        doc_data = doc_snapshot.to_dict() or {}

        transcript = doc_data.get('transcript', '')

        # Generate coaching feedback (Gemini)
        import google.generativeai as genai
        genai.configure(api_key=os.getenv('GOOGLE_AI_API_KEY'))
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""
        Analyze this customer service call transcript and provide coaching feedback (write only the negatives) (analyze only the agent's performance):
        {transcript}

        Please evaluate:
        1. Communication clarity
        2. Problem-solving effectiveness
        3. Customer engagement
        4. Areas for improvement
        """

        try:
            response = model.generate_content(prompt)
            feedback = response.text

            # Store final data (merge=True to preserve existing fields)
            doc_ref.set(
                {
                    'recording_sid': recording_sid,
                    'status': 'ended',
                    'ended_at': datetime.now(timezone.utc).isoformat(),
                    'coaching_feedback': feedback,
                    'call_sid': call_sid  #update with final call SID
                },
                merge=True)

            # Create coaching prompt
            coaching_prompt = f"""You are a professional call center coach. Your role is to provide constructive feedback to help improve customer service skills. Here is the transcript and AI analysis of a recent call:

Transcript:
{transcript}

AI Analysis:
{feedback}

Focus on being supportive while discussing areas for improvement."""

            first_message = (
                "Hello, I'm your coaching assistant. I've reviewed your recent call "
                "and would like to discuss some feedback to help enhance your "
                "customer service skills.")

            original_caller = doc_ref.get().to_dict().get(
                'original_caller', '')

            if original_caller:
                import requests
                requests.post(
                    'https://elevenlabs-twilio-stream-shvbham.replit.app/outbound-call',
                    json={
                        "prompt": coaching_prompt,
                        "first_message": first_message,
                        "number": original_caller
                    })

                return {
                    "status":
                    "Call ended, feedback generated and coaching call initiated",
                    "feedback": feedback
                }

            return {
                "status":
                "Call ended, feedback generated but no target number found",
                "feedback": feedback
            }
        except Exception as e:
            feedback = f"Error generating feedback: {str(e)}"
            return {"status": "Error generating feedback", "error": str(e)}

    return {"status": "No recording SID or call SID found"}


@app.post("/transcription_callback/{combined_call_id}")
async def handle_transcription(combined_call_id: str, request: Request):
    form_data = await request.form()
    transcription_event = form_data.get('TranscriptionEvent')
    transcription_sid = form_data.get('TranscriptionSid')
    call_sid = form_data.get('CallSid', '')
    track_raw = form_data.get('Track',
                              '')  # e.g. "inbound_track" or "outbound_track"

    doc_ref = db.collection('transcriptions').document(
        combined_call_id)  # Use the combined unique ID

    if transcription_event == 'transcription-started':
        doc_ref.set(
            {
                'status': 'started',
                'transcription_sid': transcription_sid,
                'timestamp': datetime.now(timezone.utc).isoformat(),
            },
            merge=True)

    elif transcription_event == 'transcription-content':
        transcription_data_str = form_data.get('TranscriptionData', '{}')
        transcription_data = json.loads(transcription_data_str)

        # 1. Map track_raw -> final label
        if track_raw == 'inbound_track':
            track_label = 'customer'
        elif track_raw == 'outbound_track':
            track_label = 'agent'
        else:
            track_label = ''  # fallback if Twilio doesn't send the field

        # 2. Build the line with the label
        new_chunk = transcription_data.get('transcript', '')
        if new_chunk:
            if track_label:
                new_line = f"[{track_label}] {new_chunk}"
            else:
                new_line = new_chunk
        else:
            new_line = ""

        # 3. Append to existing transcript
        doc_snapshot = doc_ref.get()
        doc_data = doc_snapshot.to_dict() or {}
        existing_transcript = doc_data.get('transcript', '')

        appended_transcript = existing_transcript
        if new_line:
            # Use a newline for readability
            appended_transcript = (existing_transcript + "\n" +
                                   new_line).strip()

        doc_ref.set(
            {
                'status': 'in_progress',
                'transcript': appended_transcript,
                'confidence': transcription_data.get('confidence', 0),
                'last_updated': datetime.now(timezone.utc).isoformat()
            },
            merge=True)

    elif transcription_event == 'transcription-stopped':
        doc_ref.set(
            {
                'status': 'completed',
                'completed_at': datetime.now(timezone.utc).isoformat()
            },
            merge=True)

    return {"status": "success", "event": transcription_event}


@app.get("/live-calls")
async def get_live_calls():
    """Get all currently active calls."""
    try:
        doc_ref = db.collection('transcriptions')
        docs = doc_ref.where('status', 'not-in', ['completed', 'ended'])
        calls = []
        for doc in docs:
            data = doc.to_dict()
            calls.append({
                'call_id': doc.id,
                'original_caller': data.get('original_caller'),
                'started_at': data.get('started_at'),
                'transcript': data.get('transcript', '')
            })

        # If no calls are found, return an empty JSON array instead of letting the stream error
        if not calls:
            return JSONResponse(content=[])  # Explicitly return an empty array

        return JSONResponse(
            content=calls)  # Return the array (empty or with calls)

    except Exception as e:
        print(f"Error getting live calls: {e}")  # Log the error
        return JSONResponse(content={"error": "Failed to retrieve live calls"},
                            status_code=500)  # Return error


@app.get("/live-transcriptions/{combined_call_id}")
async def get_live_transcription(combined_call_id: str):
    """Get live transcription for a specific call."""
    try:
        doc_ref = db.collection('transcriptions').document(combined_call_id)
        doc = doc_ref.get()
        if not doc.exists:
            return JSONResponse(content={"error": "Call not found"},
                                status_code=404)

        data = doc.to_dict()
        return JSONResponse(
            content={
                'call_id': combined_call_id,
                'transcript': data.get('transcript', ''),
                'status': data.get('status'),
                'last_updated': data.get('last_updated')
            })
    except Exception as e:
        print(f"Error getting live transcription: {e}")
        return JSONResponse(
            content={"error": "Failed to retrieve live transcription"},
            status_code=500)


@app.get("/agent-suggestions/{combined_call_id}")
async def get_agent_suggestions(combined_call_id: str):
    """Get real-time agent suggestions based on the call transcript."""
    try:
        doc_ref = db.collection('transcriptions').document(combined_call_id)
        try:
            doc = doc_ref.get()
            if not doc.exists:
                return JSONResponse(content={"error": "Call not found"},
                                    status_code=404)

            data = doc.to_dict()
            transcript = data.get('transcript', '')

        except Exception as firestore_error:
            print(f"Firestore error: {firestore_error}")
            return JSONResponse(content={
                "error":
                "Failed to retrieve transcript from Firestore"
            },
                                status_code=500)

        if not transcript:
            return JSONResponse(content={
                "suggestions": [],
                "message": "No transcript available yet"
            })

        # Use Gemini AI to generate suggestions
        import google.generativeai as genai
        genai.configure(api_key=os.getenv('GOOGLE_AI_API_KEY'))
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""
        Based on this customer service call transcript, provide 3 immediate suggestions for the agent:
        {transcript}

        Format as bullet points and be concise.
        Focus on what the agent should do next.
        """

        try:
            response = model.generate_content(prompt)
            suggestions = [s.strip() for s in response.text.split('\n')]
            return JSONResponse(
                content={
                    "call_id": combined_call_id,
                    "suggestions": suggestions,
                    "transcript_length": len(transcript)
                })
        except Exception as gemini_error:
            print(f"Gemini AI error: {gemini_error}")
            return JSONResponse(content={
                "error":
                f"Failed to generate suggestions: {str(gemini_error)}"
            },
                                status_code=500)

    except Exception as overall_error:
        print(f"Overall error in get_agent_suggestions: {overall_error}")
        return JSONResponse(content={"error": "An unexpected error occurred"},
                            status_code=500)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    uvicorn.run(app, host="0.0.0.0", port=port)
