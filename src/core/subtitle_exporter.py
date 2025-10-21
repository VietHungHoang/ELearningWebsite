import os
import re


class SubtitleExporter:
    """Subtitle export utilities"""

    @staticmethod
    def split_into_sentences(text):
        """Split text into sentences"""
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]

    @staticmethod
    def _format_timestamp(seconds):
        """Format seconds to SRT/VTT timestamp"""
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        millis = int((seconds % 1) * 1000)
        return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

    @staticmethod
    def export_subtitles(result, output_dir, base_name):
        """Export subtitles as SRT and VTT files"""
        os.makedirs(output_dir, exist_ok=True)

        text = result.get('text', '').strip()
        original_segments = result.get('segments', [])

        duration = 0
        if original_segments:
            duration = original_segments[-1]['end']

        sentences = SubtitleExporter.split_into_sentences(text)
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

        # Export SRT
        srt_file = os.path.join(output_dir, f"{base_name}.srt")
        with open(srt_file, 'w', encoding='utf-8') as f:
            for seg in segments:
                f.write(f"{seg['id']}\n")
                f.write(f"{SubtitleExporter._format_timestamp(seg['start'])} --> {SubtitleExporter._format_timestamp(seg['end'])}\n")
                f.write(f"{seg['text']}\n\n")

        # Export VTT
        vtt_file = os.path.join(output_dir, f"{base_name}.vtt")
        with open(vtt_file, 'w', encoding='utf-8') as f:
            f.write("WEBVTT\n\n")
            for seg in segments:
                f.write(f"{SubtitleExporter._format_timestamp(seg['start'])} --> {SubtitleExporter._format_timestamp(seg['end'])}\n")
                f.write(f"{seg['text']}\n\n")

        print(f"[+] SRT saved: {srt_file}")
        print(f"[+] VTT saved: {vtt_file}")