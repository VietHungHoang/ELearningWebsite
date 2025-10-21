"""
Audio processing with Whisper transcription
Handles: model loading, language detection, transcription
"""

import os
import json


class AudioProcessor:
    """Handle Whisper transcription with language detection"""
    
    def __init__(self, ffmpeg_config_file="ffmpeg_config.json"):
        self.ffmpeg_exe = None
        self.model = None
        self.load_ffmpeg_config(ffmpeg_config_file)
    
    def load_ffmpeg_config(self, config_file):
        """Load FFmpeg configuration"""
        try:
            if os.path.exists(config_file):
                with open(config_file, "r") as f:
                    config = json.load(f)
                    ffmpeg_dir = config.get("ffmpeg_dir")
                    os.environ['PATH'] = ffmpeg_dir + os.pathsep + os.environ.get('PATH', '')
                    self.ffmpeg_exe = config.get("ffmpeg_path")
                    print(f"[+] FFmpeg loaded: {self.ffmpeg_exe}")
        except Exception as e:
            print(f"[-] FFmpeg config error: {e}")
    
    def load_model(self, model_name="base", device="cpu"):
        """Load Whisper model"""
        try:
            import whisper
            print(f"[*] Loading Whisper model '{model_name}'...")
            self.model = whisper.load_model(model_name, device=device)
            print(f"[+] Model loaded")
            return self.model
        except Exception as e:
            print(f"[-] Failed to load model: {e}")
            return None
    
    def auto_detect_language(self, audio_file):
        """Auto-detect language from audio"""
        try:
            print(f"[*] Auto-detecting language...")
            result = self.model.transcribe(audio_file, verbose=False, fp16=False)
            detected_lang = result.get("language")
            print(f"[+] Detected language: {detected_lang}")
            return detected_lang
        except Exception as e:
            print(f"[-] Language detection error: {e}")
            return None
    
    def transcribe(self, audio_file, language=None, verbose=False, initial_prompt=None):
        """
        Transcribe audio file
        
        Args:
            audio_file: Path to audio file
            language: Language code (auto-detect if None)
            verbose: Show Whisper verbose output
            initial_prompt: Initial prompt for Whisper
            
        Returns:
            Transcription result with 'text' and 'segments'
        """
        if not self.model:
            print("[-] Model not loaded")
            return None
        
        try:
            print(f"[*] Transcribing {os.path.basename(audio_file)}...")
            
            if not language:
                detected_lang = self.auto_detect_language(audio_file)
                language = detected_lang if detected_lang else None
            
            # Auto-enable Vietnamese prompt if Vietnamese detected
            if language == "vi" and not initial_prompt:
                initial_prompt = "Đây là tiếng Việt. Hãy phiên âm chính xác các từ tiếng Việt."
                print("[+] Auto-enabled Vietnamese enhancement")
            
            result = self.model.transcribe(
                audio_file,
                verbose=verbose,
                language=language,
                initial_prompt=initial_prompt,
                fp16=False
            )
            
            print(f"[+] Transcription complete")
            return result
            
        except Exception as e:
            print(f"[-] Transcription error: {e}")
            import traceback
            traceback.print_exc()
            return None
