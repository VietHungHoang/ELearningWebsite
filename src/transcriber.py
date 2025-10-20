import os
import re
import json
import sys
import google.generativeai as genai


# Common transcription errors mapping (rule-based corrections)
COMMON_TRANSCRIPTION_ERRORS = {
    # ReactJS-related errors
    "RedJest": "ReactJS",
    "RedJS": "ReactJS",
    "RackJest": "ReactJS",
    "red jest": "ReactJS",
    "red js": "ReactJS",
    "REG": "React",
    "Reg": "React",
    "reg": "React",
    "Ratchets": "React",
    "ratchets": "React",
    "Ratched": "React",
    "Rect": "React",
    "RedGithub": "React GitHub",
    # Common Vietnamese transcription errors
    "sot code": "source code",
    "commonand": "component",
    "Commonand": "Component",
    "chatt script": "JavaScript",
    "Chatt script": "JavaScript",
    "DOM": "DOM",
    "redux": "Redux",
    "Redux": "Redux",
}


class WhisperTranscriber:
    """Whisper transcriber with auto language detection and Vietnamese enhancement"""

    def __init__(self, ffmpeg_config_file="ffmpeg_config.json"):
        self.ffmpeg_exe = None
        self.model = None
        self.video_context = None  # Store video context for better enhancement
        self.load_ffmpeg_config(ffmpeg_config_file)

    def load_ffmpeg_config(self, config_file):
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
        try:
            print(f"[*] Auto-detecting language...")
            result = self.model.transcribe(audio_file, verbose=False, fp16=False)
            detected_lang = result.get("language")
            print(f"[+] Detected language: {detected_lang}")
            return detected_lang
        except Exception as e:
            print(f"[-] Language detection error: {e}")
            return None

    def transcribe(self, audio_file, language=None, verbose=False, initial_prompt=None, video_context=None):
        if not self.model:
            print("[-] Model not loaded")
            return None

        try:
            print(f"[*] Transcribing {os.path.basename(audio_file)}...")

            if not language:
                detected_lang = self.auto_detect_language(audio_file)
                language = detected_lang if detected_lang else None

            enhance_vietnamese = False
            if language == "vi":
                enhance_vietnamese = True
                if not initial_prompt:
                    initial_prompt = "Đây là tiếng Việt. Hãy phiên âm chính xác các từ tiếng Việt."
                print("[+] Auto-enabled Vietnamese enhancement")

            result = self.model.transcribe(
                audio_file,
                verbose=verbose,
                language=language,
                initial_prompt=initial_prompt,
                fp16=False
            )

            if enhance_vietnamese:
                api_key = os.getenv("GEMINI_API_KEY")
                # Store video context for enhancement
                self.video_context = video_context
                result['text'] = self.gemini_enhance(result['text'], api_key=api_key, language=language, context=video_context)
                print("[+] Vietnamese enhancement complete (Gemini Pro with context)")

            print(f"[+] Transcription complete")
            return result
        except Exception as e:
            print(f"[-] Transcription error: {e}")
            import traceback
            traceback.print_exc()
            return None

    def post_process_vietnamese(self, text):
        """Apply Vietnamese text corrections using regex-based AI method"""
        corrections = {
            r'\bthì\b': 'thì',
            r'\blà\b': 'là',
            r'\bcó\b': 'có',
            r'\bkhông\b': 'không',
            r'\bvà\b': 'và',
            r'\bnhưng\b': 'nhưng',
            r'\bhoặc\b': 'hoặc',
            r'\bvới\b': 'với',
            r'\btừ\b': 'từ',
            r'\bđến\b': 'đến',
            r'\btrong\b': 'trong',
            r'\bngoài\b': 'ngoài',
            r'\bđược\b': 'được',
            r'\bsẽ\b': 'sẽ',
            r'\bđã\b': 'đã',
            r'\bđang\b': 'đang',
            r'\bđi\b': 'đi',
            r'\bđây\b': 'đây',
            r'\bđó\b': 'đó',
            r'\bđại\b': 'đại',
            r'\bđiều\b': 'điều',
        }

        for pattern, replacement in corrections.items():
            text = re.sub(pattern, replacement, text, flags=re.IGNORECASE)

        text = re.sub(r'\s+([.,!?;:])', r'\1', text)
        text = re.sub(r'([.,!?;:])\s+', r'\1 ', text)
        text = re.sub(r'\s+', ' ', text)

        return text.strip()

    def apply_rule_based_corrections(self, text):
        """Apply rule-based corrections before Gemini enhancement"""
        print("[*] Applying rule-based corrections...")
        for error, correction in COMMON_TRANSCRIPTION_ERRORS.items():
            # Case-insensitive replacement with word boundary
            pattern = r'\b' + re.escape(error) + r'\b'
            text = re.sub(pattern, correction, text, flags=re.IGNORECASE)
        print("[+] Rule-based corrections applied")
        return text

    def gemini_enhance(self, text, api_key=None, language="vi", context=None):
        """Enhance text using Google Gemini Pro API with context awareness"""
        if not api_key:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                print("[-] Gemini API key not found. Skipping AI enhancement.")
                return text

        try:
            # Step 1: Apply rule-based corrections first
            text = self.apply_rule_based_corrections(text)
            
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-2.5-flash')

            # Step 2: Build context-aware prompt
            context_info = ""
            if context:
                if isinstance(context, dict):
                    title = context.get("title", "")
                    topic = context.get("topic", "")
                    keywords = context.get("keywords", [])
                    context_info = f"""
Video Context:
- Title: {title}
- Topic/Subject: {topic}
- Key terms: {', '.join(keywords)}
"""
            
            if language == "vi":
                prompt = f"""
Bạn là chuyên gia sửa chữa văn bản tiếng Việt từ transcription audio.
{context_info}

Nhiệm vụ:
1. Sửa lỗi chính tả và ngữ pháp tiếng Việt
2. Sửa lỗi nghe sai dựa trên ngữ cảnh video
3. Kiểm tra các từ chuyên ngành và kỹ thuật có đúng không
4. Làm cho văn bản tự nhiên, mạch lạc và dễ đọc
5. Giữ nguyên ý nghĩa, nội dung và cấu trúc gốc
6. KHÔNG thêm thông tin mới, KHÔNG diễn giải thêm
7. Ưu tiên giữ lại các thuật ngữ chuyên ngành đã được sửa

Ví dụ cải thiện:
- "mình luận bóng đá" → "bình luận bóng đá"
- "chuyên mục mình luận về lập trình" → "chuyên mục bình luận về lập trình"
- "sot code" → "source code"

Văn bản cần sửa (đã qua xử lý sơ bộ):
"{text}"

Chỉ trả về văn bản đã sửa hoàn chỉnh, không giải thích thêm.
"""
            else:
                prompt = f"""
You are an expert at correcting transcribed English text.
{context_info}

Tasks:
1. Fix spelling and grammar errors
2. Correct misheard words based on video context
3. Verify technical and specialized terms are correct
4. Make the text natural, coherent and readable
5. Keep original meaning, content and structure
6. DO NOT add new information or explanations
7. Prioritize keeping technical terms that have been corrected

Text to correct (pre-processed):
"{text}"

Return only the corrected text, no explanations.
"""

            response = model.generate_content(prompt)
            enhanced_text = response.text.strip()

            print(f"[+] Gemini Pro enhancement with context awareness applied")
            return enhanced_text

        except Exception as e:
            print(f"[-] Gemini API error: {e}")
            print("[*] Falling back to rule-based corrections...")
            return text

    def split_into_sentences(self, text):
        """Split text into sentences"""
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]

    def export_subtitles(self, result, output_dir, base_name):
        """Export subtitles as SRT and VTT files"""
        os.makedirs(output_dir, exist_ok=True)

        text = result.get('text', '').strip()
        original_segments = result.get('segments', [])

        duration = 0
        if original_segments:
            duration = original_segments[-1]['end']

        sentences = self.split_into_sentences(text)
        segments = []

        current_char = 0
        for segment_id, sentence in enumerate(sentences, 1):
            total_chars = len(text)
            sentence_chars = len(sentence)
            if total_chars > 0:
                start_ratio = current_char / total_chars
                end_ratio = (current_char + sentence_chars) / total_chars

                segments.append({
                    'id': segment_id,
                    'start': start_ratio * duration,
                    'end': end_ratio * duration,
                    'text': sentence.strip()
                })

            current_char += sentence_chars + 1

        srt_file = os.path.join(output_dir, f"{base_name}.srt")
        with open(srt_file, 'w', encoding='utf-8') as f:
            for seg in segments:
                f.write(f"{seg['id']}\n")
                f.write(f"{self._format_timestamp(seg['start'])} --> {self._format_timestamp(seg['end'])}\n")
                f.write(f"{seg['text']}\n\n")

        vtt_file = os.path.join(output_dir, f"{base_name}.vtt")
        with open(vtt_file, 'w', encoding='utf-8') as f:
            f.write("WEBVTT\n\n")
            for seg in segments:
                f.write(f"{self._format_timestamp(seg['start'])} --> {self._format_timestamp(seg['end'])}\n")
                f.write(f"{seg['text']}\n\n")

        print(f"[+] SRT saved: {srt_file}")
        print(f"[+] VTT saved: {vtt_file}")

        return {'srt': srt_file, 'vtt': vtt_file}

    def _format_timestamp(self, seconds):
        """Format seconds to HH:MM:SS,mmm"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

    # (Optional) Placeholder for future ML-based Vietnamese correction methods.
    # Keep the codebase clean for now; advanced correction can be added here.


def main():
    """Main function"""
    print("\n" + "="*70)
    print("WHISPER TRANSCRIPTION & SUBTITLE EXPORT")
    print("="*70)
    
    # Example usage
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
