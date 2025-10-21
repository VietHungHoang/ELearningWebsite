"""
Simple API layer - Serve pre-generated subtitle files
Admin processes videos offline → outputs to /output/
Users download subtitles via API

Flask app is in app.py to avoid circular imports
"""

# Lazy import to avoid dependency when not running Flask server
def get_app():
    """Get Flask app instance"""
    from .app import create_app
    return create_app()
