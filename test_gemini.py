#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Quick test for Gemini Enhancement"""

import os
import google.generativeai as genai

# Set API key
api_key = "AIzaSyDUtwf8VVPTFHqStXhD7tNU_p1ToAbxeKU"
genai.configure(api_key=api_key)

print("[*] Listing available models...")
try:
    for model in genai.list_models():
        print(f"  - {model.name}")
except Exception as e:
    print(f"[-] Error: {e}")

# Test Vietnamese text
test_text = "Chào mừng bạn đến với F8 trong khóa RedJest đây là một dự án mã nguồn mở nên các bạn có thể dễ dàng tìm kiếm được sot code của RedJest trên github.com"

print(f"\n[INPUT]:\n{test_text}\n")

try:
    # Use Gemini 2.5 Flash (latest available, fastest)
    model = genai.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
Bạn là chuyên gia sửa chữa văn bản tiếng Việt từ transcription audio.

Nhiệm vụ:
1. Sửa lỗi chính tả và ngữ pháp tiếng Việt
2. Tìm từ thay thế hợp lý nếu nghe sai
3. Làm cho văn bản tự nhiên
4. Giữ nguyên ý nghĩa gốc

Văn bản cần sửa: "{test_text}"

Chỉ trả về văn bản đã sửa.
"""
    
    print("[*] Calling Gemini...")
    response = model.generate_content(prompt)
    enhanced_text = response.text.strip()
    
    print(f"[OUTPUT]:\n{enhanced_text}\n")
    print("[+] Gemini enhancement PASSED ✅")
    
except Exception as e:
    print(f"[-] Error: {e}")
    print("[-] Test FAILED ❌")
