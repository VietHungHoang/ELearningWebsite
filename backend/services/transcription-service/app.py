from fastapi import FastAPI, UploadFile, File
from transformers import pipeline
import tempfile
import os

app = FastAPI(title="Transcription Service", description="Audio transcription using PhoWhisper")

# Load the model pipeline
pipe = pipeline("automatic-speech-recognition", model="vinai/PhoWhisper-medium", return_timestamps="word")

# Test with test.wav if exists
if os.path.exists("test.wav"):
    result = pipe("test.wav")
    print("Test transcription:", result)

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # Save uploaded file to temp
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        temp_file.write(await file.read())
        temp_path = temp_file.name

    try:
        # Transcribe
        result = pipe(temp_path)
        transcription = result
        return {"transcription": transcription}
    finally:
        # Clean up temp file
        os.unlink(temp_path)

@app.get("/")
async def root():
    return {"message": "Transcription Service is running"}