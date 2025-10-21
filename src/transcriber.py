import os
import sys
from core.whisper_processor import AudioProcessor
from core.text_enhancer import TextEnhancer
from core.subtitle_exporter import SubtitleExporter


class WhisperTranscriber:
    """Main transcriber orchestrator"""
    
    def __init__(self):
        self.audio_processor = AudioProcessor()
        self.text_enhancer = TextEnhancer()
        self.subtitle_exporter = SubtitleExporter()
    
    def load_model(self, model_name="base", device="cpu"):
        """Load Whisper model"""
        return self.audio_processor.load_model(model_name, device)
    
    def transcribe(self, audio_file, language=None, verbose=False, initial_prompt=None, context=None):
        """
        Transcribe audio and enhance if needed
        
        Args:
            audio_file: Path to audio file
            language: Language code
            verbose: Verbose output
            initial_prompt: Whisper initial prompt
            context: Context dict for enhancement
            
        Returns:
            Enhanced transcription result
        """
        # Step 1: Transcribe with Whisper
        result = self.audio_processor.transcribe(
            audio_file,
            language=language,
            verbose=verbose,
            initial_prompt=initial_prompt
        )
        
        if not result:
            return None
        
        # Step 2: Enhance with Gemini if Vietnamese
        detected_lang = result.get("language", language)
        if detected_lang == "vi":
            result['text'] = self.text_enhancer.enhance(
                result['text'],
                language="vi",
                context=context
            )
            print("[+] Vietnamese enhancement complete")
        
        return result
    
    def export_subtitles(self, result, output_dir, base_name):
        """Export subtitles as SRT and VTT"""
        return self.subtitle_exporter.export_subtitles(result, output_dir, base_name)


def main():
    """Main function - example usage"""
    print("\n" + "="*70)
    print("WHISPER TRANSCRIPTION & SUBTITLE EXPORT")
    print("="*70)
    
    transcriber = WhisperTranscriber()
    
    if not transcriber.load_model("base"):
        sys.exit(1)
    
    audio_file = "Recording.m4a"
    if not os.path.exists(audio_file):
        print(f"[-] Audio file not found: {audio_file}")
        sys.exit(1)
    
    result = transcriber.transcribe(audio_file)
    if not result:
        sys.exit(1)
    
    base_name = os.path.splitext(os.path.basename(audio_file))[0]
    output_dir = "output"
    
    files = transcriber.export_subtitles(result, output_dir, base_name)
    
    print(f"\n[+] Subtitles exported:")
    for fmt, filepath in files.items():
        print(f"    - {fmt.upper()}: {filepath}")
    
    print("\n[+] Done!")


if __name__ == "__main__":
    main()
