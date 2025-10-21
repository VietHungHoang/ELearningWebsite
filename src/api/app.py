"""
Flask REST API for serving subtitles
"""

from flask import Flask, jsonify, send_file
import os
from pathlib import Path

def create_app():
    """Create and configure Flask app"""
    app = Flask(__name__)
    
    # Output directory where subtitles are stored
    OUTPUT_DIR = Path(__file__).parent.parent.parent / "output"
    
    @app.route("/api/health", methods=["GET"])
    def health():
        """Health check"""
        return jsonify({"status": "ok"}), 200
    
    @app.route("/api/subtitles/<int:lesson_id>", methods=["GET"])
    def get_subtitles(lesson_id):
        """
        Get subtitles for a lesson
        Admin must have run: python scripts/transcribe_lesson.py lesson_id audio.wav
        This generates: output/lesson_{lesson_id}.srt
        """
        try:
            srt_file = OUTPUT_DIR / f"lesson_{lesson_id}.srt"
            
            if not srt_file.exists():
                return jsonify({
                    "status": "error",
                    "message": f"Subtitles not found for lesson {lesson_id}. Admin must process video first."
                }), 404
            
            # Read and return file content
            with open(srt_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            return jsonify({
                "status": "success",
                "lesson_id": lesson_id,
                "format": "srt",
                "content": content
            }), 200
            
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    
    @app.route("/api/subtitles/<int:lesson_id>/download", methods=["GET"])
    def download_subtitles(lesson_id):
        """Download subtitles as file"""
        try:
            srt_file = OUTPUT_DIR / f"lesson_{lesson_id}.srt"
            
            if not srt_file.exists():
                return jsonify({
                    "status": "error",
                    "message": f"Subtitles not found for lesson {lesson_id}"
                }), 404
            
            return send_file(
                srt_file,
                mimetype='text/plain',
                as_attachment=True,
                download_name=f"lesson_{lesson_id}.srt"
            )
            
        except Exception as e:
            return jsonify({
                "status": "error",
                "message": str(e)
            }), 500
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
