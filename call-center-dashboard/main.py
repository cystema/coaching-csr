from fastapi.responses import JSONResponse

@app.get("/live-calls")
async def get_live_calls():
    """Get all currently active calls."""
    try:
        doc_ref = db.collection('transcriptions')
        docs = doc_ref.where('status', '==', 'ongoing').stream()
        calls = []
        for doc in docs:
            data = doc.to_dict()
            calls.append({
                'call_id': doc.id,
                'original_caller': data.get('original_caller'),
                'started_at': data.get('started_at'),
                'transcript': data.get('transcript', '')
            })
        return JSONResponse(content=calls)
    except Exception as e:
        print(f"Error getting live calls: {e}")  # Log the error
        return JSONResponse(content={"error": "Failed to retrieve live calls"}, status_code=500)

@app.get("/live-transcriptions/{combined_call_id}")
async def get_live_transcription(combined_call_id: str):
    """Get live transcription for a specific call."""
    try:
        doc_ref = db.collection('transcriptions').document(combined_call_id)
        doc = doc_ref.get()
        if not doc.exists:
            return JSONResponse(content={"error": "Call not found"}, status_code=404)

        data = doc.to_dict()
        return JSONResponse(content={
            'call_id': combined_call_id,
            'transcript': data.get('transcript', ''),
            'status': data.get('status'),
            'last_updated': data.get('last_updated')
        })
    except Exception as e:
        print(f"Error getting live transcription: {e}")
        return JSONResponse(content={"error": "Failed to retrieve live transcription"}, status_code=500)

@app.get("/agent-suggestions/{combined_call_id}")
async def get_agent_suggestions(combined_call_id: str):
    """Get real-time agent suggestions based on the call transcript."""
    try:
        doc_ref = db.collection('transcriptions').document(combined_call_id)
        try:
            doc = doc_ref.get()
            if not doc.exists:
                return JSONResponse(content={"error": "Call not found"}, status_code=404)

            data = doc.to_dict()
            transcript = data.get('transcript', '')

        except Exception as firestore_error:
            print(f"Firestore error: {firestore_error}")
            return JSONResponse(content={"error": "Failed to retrieve transcript from Firestore"}, status_code=500)

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
            return JSONResponse(content={
                "call_id": combined_call_id,
                "suggestions": suggestions,
                "transcript_length": len(transcript)
            })
        except Exception as gemini_error:
            print(f"Gemini AI error: {gemini_error}")
            return JSONResponse(content={"error": f"Failed to generate suggestions: {str(gemini_error)}"}, status_code=500)

    except Exception as overall_error:
        print(f"Overall error in get_agent_suggestions: {overall_error}")
        return JSONResponse(content={"error": "An unexpected error occurred"}, status_code=500)

