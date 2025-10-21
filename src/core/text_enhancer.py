"""
Text enhancement with Gemini API
Handles: context-aware prompt building, API calls, error handling
"""

import os
import google.generativeai as genai


class TextEnhancer:
    """Enhance transcribed text using Gemini API"""
    
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
    
    def enhance(self, text, language="vi", context=None):
        """
        Enhance text using Gemini with context awareness
        
        Args:
            text: Raw transcribed text
            language: Language code (vi, en)
            context: Dict with {title, topic, keywords}
            
        Returns:
            Enhanced text
        """
        if not self.api_key:
            print("[-] Gemini API key not found. Skipping enhancement.")
            return text
        
        try:
            genai.configure(api_key=self.api_key)
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            # Build context info
            context_info = self._build_context_info(context)
            
            # Build prompt based on language
            if language == "vi":
                prompt = self._build_vietnamese_prompt(text, context_info)
            else:
                prompt = self._build_english_prompt(text, context_info)
            
            # Call Gemini
            response = model.generate_content(prompt)
            enhanced_text = response.text.strip()
            
            print(f"[+] Gemini enhancement applied")
            return enhanced_text
            
        except Exception as e:
            print(f"[-] Gemini error: {e}")
            return text
    
    @staticmethod
    def _build_context_info(context):
        """Build context string from context dict"""
        if not context or not isinstance(context, dict):
            return ""
        
        title = context.get("title", "")
        topic = context.get("topic", "")
        keywords = context.get("keywords", [])
        
        if not any([title, topic, keywords]):
            return ""
        
        context_info = "\nVideo Context:\n"
        if title:
            context_info += f"- Title: {title}\n"
        if topic:
            context_info += f"- Topic/Subject: {topic}\n"
        if keywords:
            context_info += f"- Key terms: {', '.join(keywords)}\n"
        
        return context_info
    
    @staticmethod
    def _build_vietnamese_prompt(text, context_info):
        """Build Vietnamese enhancement prompt"""
        return f"""
Bạn là chuyên gia sửa chữa văn bản tiếng Việt từ transcription audio.
{context_info}

Nhiệm vụ:
1. Sửa lỗi chính tả và ngữ pháp tiếng Việt
2. Sửa lỗi nghe sai dựa trên ngữ cảnh video
3. Kiểm tra các từ chuyên ngành và kỹ thuật có đúng không
4. Làm cho văn bản tự nhiên, mạch lạc và dễ đọc
5. Giữ nguyên ý nghĩa, nội dung và cấu trúc gốc
6. KHÔNG thêm thông tin mới, KHÔNG diễn giải thêm
7. Ưu tiên giữ lại các thuật ngữ chuyên ngành

Văn bản cần sửa:
"{text}"

Chỉ trả về văn bản đã sửa hoàn chỉnh, không giải thích thêm.
"""
    
    @staticmethod
    def _build_english_prompt(text, context_info):
        """Build English enhancement prompt"""
        return f"""
You are an expert at correcting transcribed English text.
{context_info}

Tasks:
1. Fix spelling and grammar errors
2. Correct misheard words based on video context
3. Verify technical and specialized terms are correct
4. Make the text natural, coherent and readable
5. Keep original meaning, content and structure
6. DO NOT add new information or explanations
7. Preserve all technical terms

Text to correct:
"{text}"

Return only the corrected text, no explanations.
"""
