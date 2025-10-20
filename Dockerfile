# Multi-stage build để giảm size image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install FFmpeg (cần thiết cho audio processing)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Create directories for input/output
RUN mkdir -p /app/audio /app/output /app/models

# Set environment for Whisper model cache
ENV WHISPER_HOME=/app/models
ENV GEMINI_API_KEY=${GEMINI_API_KEY}

# Pre-download base model (optional, comment out để skip)
# RUN python -c "import whisper; whisper.load_model('base')"

# Default command
CMD ["python", "scripts/transcribe.py"]
