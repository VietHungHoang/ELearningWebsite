# Dockerfile for Whisper Transcription API
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (FFmpeg for audio, curl for healthcheck)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create directories for audio input, SRT output, and model cache
RUN mkdir -p /app/audio /app/output /app/models

# Set environment variables
ENV WHISPER_HOME=/app/models
ENV FLASK_APP=src/api/app.py
ENV FLASK_ENV=production

# Optional: Pre-download Whisper base model to reduce startup time
# Uncomment if you want to include model in image (increases image size ~1GB)
# RUN python -c "import whisper; whisper.load_model('base')"

# Expose Flask port
EXPOSE 5000

# Run Flask API
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]

