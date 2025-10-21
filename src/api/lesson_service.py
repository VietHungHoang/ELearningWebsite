"""
Lesson Service - Call external Lesson Service API to get context
"""

import os
import requests
from typing import Dict, Any, Optional


class LessonService:
    """Integrate with external Lesson Service"""
    
    # Configuration - update with your actual service URL
    LESSON_SERVICE_URL = os.getenv(
        "LESSON_SERVICE_URL",
        "http://localhost:8000/api"
    )
    
    # Default empty context template - flexible for any subject
    DEFAULT_CONTEXT = {
        "lesson_id": None,
        "title": "Unknown Lesson",
        "subject": "Unknown Subject",
        "keywords": [],
        "description": "",
        "content": {}  # Store any additional subject-specific data
    }
    
    @staticmethod
    def get_context(lesson_id: int) -> Dict[str, Any]:
        """
        Get lesson context from Lesson Service API
        
        Accepts ANY structure from API, extracts what's needed
        Extra fields stored in 'content' for subject-specific data
        
        Returns:
        {
            "lesson_id": 42,
            "title": "Python Lambda Functions",
            "subject": "Python Programming",
            "keywords": ["lambda", "function", "anonymous", "map", "filter"],
            "description": "Learn how to use lambda functions...",
            "content": { ... any extra fields ... }
        }
        """
        try:
            url = f"{LessonService.LESSON_SERVICE_URL}/lessons/{lesson_id}"
            
            print(f"[*] Fetching lesson context from {url}")
            
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            api_data = response.json()
            
            if not api_data:
                print(f"[-] Empty response from Lesson Service")
                return LessonService._create_context(lesson_id, {})
            
            print(f"[+] Got lesson context: {api_data.get('title', 'Unknown')}")
            
            return LessonService._create_context(lesson_id, api_data)
            
        except requests.exceptions.RequestException as e:
            print(f"[-] Error fetching lesson context: {e}")
            return LessonService._create_context(lesson_id, {})
        except Exception as e:
            print(f"[-] Unexpected error in get_context: {e}")
            return LessonService._create_context(lesson_id, {})
    
    @staticmethod
    def _create_context(lesson_id: int, api_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Build context from API response
        
        Flexible - extracts known fields, stores extra in 'content'
        """
        context = LessonService.DEFAULT_CONTEXT.copy()
        context["lesson_id"] = lesson_id
        
        # Extract standard fields (if present)
        if api_data:
            context["title"] = api_data.get("title", context["title"])
            context["subject"] = api_data.get("subject", context["subject"])
            context["description"] = api_data.get("description", context["description"])
            
            # keywords can be list or string
            keywords = api_data.get("keywords", [])
            if isinstance(keywords, str):
                context["keywords"] = [k.strip() for k in keywords.split(",")]
            elif isinstance(keywords, list):
                context["keywords"] = keywords
            
            # Store any extra fields for subject-specific handling
            known_fields = {"title", "subject", "keywords", "description"}
            for key, value in api_data.items():
                if key not in known_fields:
                    context["content"][key] = value
        
        return context
    
    @staticmethod
    def get_video_url(lesson_id: int) -> Optional[str]:
        """Get video URL for a lesson"""
        try:
            url = f"{LessonService.LESSON_SERVICE_URL}/lessons/{lesson_id}/video"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            video_url = data.get("video_url")
            
            if not video_url:
                print(f"[-] No video URL returned for lesson {lesson_id}")
                return None
            
            print(f"[+] Got video URL: {video_url}")
            return video_url
            
        except requests.exceptions.RequestException as e:
            print(f"[-] Error fetching video URL: {e}")
            return None
        except Exception as e:
            print(f"[-] Unexpected error getting video URL: {e}")
            return None
