#!/usr/bin/env python
# -*- coding: utf-8 -*-
import sys
import os

# Fix encoding for Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from src.transcriber import WhisperTranscriber


# Define video contexts for different audio files
VIDEO_CONTEXTS = {
    "ReactJS": {
        "title": "ReactJS là gì? Tại sao nên học ReactJS?",
        "topic": "ReactJS/JavaScript Programming",
        "keywords": ["React", "ReactJS", "JavaScript", "component", "hooks", "JSX", "state", "props", "Facebook", "UI", "library"]
    },
    "Recording3": {
        "title": "Default Context",
        "topic": "General",
        "keywords": []
    }
}


def get_context_for_file(audio_file):
    """Auto-detect context based on audio filename"""
    basename = os.path.splitext(os.path.basename(audio_file))[0].lower()
    
    if "reactjs" in basename or "react" in basename:
        return VIDEO_CONTEXTS["ReactJS"]
    
    return VIDEO_CONTEXTS["Recording3"]


def main():
    if len(sys.argv) < 2:
        print("Usage: python transcribe.py <audio_file> [model_name] [device]")
        print("  model_name: base, small, medium, large (default: base)")
        print("  device: cpu, cuda (default: cpu)")
        sys.exit(1)

    audio_file = sys.argv[1]
    model_name = sys.argv[2] if len(sys.argv) > 2 else "base"
    device = sys.argv[3] if len(sys.argv) > 3 else "cpu"

    if not os.path.exists(audio_file):
        print(f"[-] Audio file not found: {audio_file}")
        sys.exit(1)

    transcriber = WhisperTranscriber()
    transcriber.load_model(model_name, device)

    # Get context based on filename
    context = get_context_for_file(audio_file)
    print(f"[*] Using context: {context['title']}")

    result = transcriber.transcribe(audio_file, video_context=context)

    if result:
        base_name = os.path.splitext(os.path.basename(audio_file))[0]
        transcriber.export_subtitles(result, "output", base_name)
        print(f"[+] Done! Check output/ folder")
    else:
        print("[-] Transcription failed")
        sys.exit(1)


if __name__ == "__main__":
    main()
