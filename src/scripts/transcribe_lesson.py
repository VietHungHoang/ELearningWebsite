

import sys
import os
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from transcriber import WhisperTranscriber
from api.lesson_service import LessonService


def transcribe_lesson(lesson_id: int, audio_path: str):
    """Transcribe audio and generate subtitle file"""
    
    print(f"\n{'='*70}")
    print(f"TRANSCRIBING LESSON {lesson_id}")
    print(f"{'='*70}\n")
    
    # Validate
    if not os.path.exists(audio_path):
        print(f"[-] Audio file not found: {audio_path}")
        return False
    
    try:
        # Step 1: Fetch context
        print(f"[1/4] Fetching lesson context...")
        context = LessonService.get_context(lesson_id)
        print(f"      Title: {context.get('title', 'Unknown')}")
        print(f"      Subject: {context.get('subject', 'Unknown')}")
        
        # Step 2: Initialize transcriber
        print(f"\n[2/4] Loading Whisper model...")
        transcriber = WhisperTranscriber()
        transcriber.load_model("base")  # Use 'base' for faster testing on CPU
        
        # Step 3: Transcribe
        print(f"\n[3/4] Transcribing audio (this may take a few minutes)...")
        result = transcriber.transcribe(
            audio_path,
            language="vi",
            context=context
        )
        
        if not result:
            print(f"[-] Transcription failed")
            return False
        
        # Step 4: Export
        print(f"\n[4/4] Exporting subtitles...")
        base_name = f"lesson_{lesson_id}"
        files = transcriber.export_subtitles(result, "output", base_name)
        
        print(f"\n{'='*70}")
        print(f"[✓] SUCCESS!")
        print(f"    Subtitles saved:")
        print(f"      SRT: {files['srt']}")
        print(f"      VTT: {files['vtt']}")
        print(f"\n    Users can now download subtitles:")
        print(f"      GET /api/subtitles/{lesson_id}")
        print(f"{'='*70}\n")
        
        return True
        
    except Exception as e:
        print(f"\n[-] Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python src/scripts/transcribe_lesson.py <lesson_id> <audio_path>")
        print("Example: python src/scripts/transcribe_lesson.py 42 audio/video.wav")
        sys.exit(1)
    
    lesson_id = int(sys.argv[1])
    audio_path = sys.argv[2]
    
    success = transcribe_lesson(lesson_id, audio_path)
    sys.exit(0 if success else 1)
