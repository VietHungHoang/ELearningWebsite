# Whisper Transcriber với Gemini AI Enhancement

Hệ thống transcription audio/video sang text tiếng Việt với AI enhancement sử dụng OpenAI Whisper + Google Gemini Pro API.

## 🎯 Tính năng

- ✅ Transcription audio/video tự động với Whisper
- ✅ Sửa lỗi transcription tự động (rule-based + AI)
- ✅ Hỗ trợ tiếng Việt và đa ngôn ngữ
- ✅ Context-aware enhancement (biết nội dung để sửa chính xác hơn)
- ✅ Export SRT/VTT subtitle
- ✅ Sửa lỗi từ điển: RedJest → ReactJS, sot code → source code, etc.

## 📋 Yêu cầu hệ thống

- **Python**: 3.10+
- **FFmpeg**: Để xử lý audio/video
- **GPU (tùy chọn)**: CUDA/ROCm để tăng tốc độ

## 🚀 Hướng dẫn cài đặt

### Bước 1: Clone repo

```bash
git clone <your-repo-url>
cd open-whisper
```

### Bước 2: Cài đặt FFmpeg

```powershell
# Cách 1: Dùng Chocolatey (nếu có)
choco install ffmpeg

# Cách 2: Download thủ công từ
# https://ffmpeg.org/download.html
# Extract vào thư mục, thêm vào PATH, hoặc đặt trong project
```

### Bước 3: Tạo Python Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate
```

### Bước 4: Cài đặt Dependencies

```bash
pip install -r requirements.txt
```

### Bước 5: Download Whisper Model

Model Whisper sẽ tự động download lần đầu khi chạy. Hoặc download thủ công:

```bash
# Download model 'base' (nhanh, phù hợp)
python -c "import whisper; whisper.load_model('base')"

# Các model có sẵn: tiny, base, small, medium, large
# tiny: nhanh nhất, độ chính xác thấp
# base: cân bằng (khuyến khích)
# small/medium: chậm hơn, độ chính xác cao
# large: chậm nhất, độ chính xác cao nhất
```

**Model cache location:**

- Mặc định model sẽ được lưu tại: `C:\Users\<YourUsername>\.cache\whisper\`
- Nếu muốn lưu trong project folder, set environment variable:

```powershell
$env:WHISPER_HOME="C:\Users\Admin\Desktop\open-whisper\models"

# Để lưu vĩnh viễn:
[System.Environment]::SetEnvironmentVariable("WHISPER_HOME","C:\Users\Admin\Desktop\open-whisper\models","User")
```

### Bước 6: Cấu hình Gemini API (tùy chọn nhưng khuyến khích)

1. Tạo tài khoản Google Cloud: https://cloud.google.com/
2. Tạo API key: https://aistudio.google.com/apikey
3. Set environment variable:

**Windows (PowerShell)**

```powershell
$env:GEMINI_API_KEY="your-api-key-here"

# Để lưu vĩnh viễn, dùng:
[System.Environment]::SetEnvironmentVariable("GEMINI_API_KEY","your-api-key-here","User")
```

### Bước 7: Cấu hình FFmpeg (nếu cần)

Nếu FFmpeg không ở trong PATH, tạo file `ffmpeg_config.json` trong root:

```json
{
  "ffmpeg_dir": "C:\\ffmpeg\\bin",
  "ffprobe_dir": "C:\\ffmpeg\\bin"
}
```

## 💻 Cách sử dụng

### Cách 1: Dùng CLI Script

```bash
# Transcribe file audio/video
python scripts/transcribe.py "path/to/audio.mp3"

# Với context tùy chỉnh
python scripts/transcribe.py "path/to/audio.mp3" --context "ReactJS"
```

### Cách 2: Dùng trong Python Code

```python
from src.transcriber import WhisperTranscriber

# Khởi tạo
transcriber = WhisperTranscriber()

# Transcribe với enhancement
result = transcriber.transcribe(
    audio_path="audio.mp3",
    language="vi",
    context={"title": "ReactJS Tutorial", "topic": "JavaScript"}
)

print(result["text"])
```

### Cách 3: Chạy bằng Docker

**Yêu cầu:** Docker & Docker Compose đã cài sẵn

**Bước 1: Build image**

```bash
docker-compose build
```

**Bước 2: Set Gemini API key (tùy chọn)**

```powershell
# Tạo file .env
echo "GEMINI_API_KEY=your-api-key-here" > .env
```

**Bước 3: Chạy transcription**

```bash
# Chạy với file audio mặc định
docker-compose up

# Hoặc chạy với file cụ thể
docker-compose run whisper-transcriber python scripts/transcribe.py "audio/your-file.mp3"

# Hoặc chạy interactive
docker-compose run -it whisper-transcriber bash
```

**Cấu trúc folders cho Docker:**

```
open-whisper/
├── audio/                      # Đặt file audio vào đây
│   └── input.mp3
├── output/                     # Kết quả sẽ được lưu ở đây
│   ├── input.srt
│   └── input.vtt
├── models/                     # Model cache (tự động tạo)
└── docker-compose.yml
```

**Lợi ích của Docker:**

- ✅ Không cần cài FFmpeg, Python, dependencies trên máy
- ✅ Environment nhất quán (Windows/Mac/Linux)
- ✅ Dễ share & deploy
- ✅ Model cache được lưu persistent trong `models/` folder

### Output

Các file kết quả sẽ được lưu trong thư mục `output/`:

- `.txt` - Text thô
- `.srt` - Subtitle định dạng SRT
- `.vtt` - Subtitle định dạng VTT

## 📁 Cấu trúc Project

```
open-whisper/
├── src/
│   └── transcriber.py          # Main transcriber class
├── scripts/
│   └── transcribe.py           # CLI interface
├── audio/                      # Thư mục chứa audio/video input
├── output/                     # Kết quả transcription
├── tests/                      # Unit tests
├── requirements.txt            # Dependencies
├── ffmpeg_config.json         # FFmpeg configuration
└── README.md                  # This file
```

## 🔧 Troubleshooting

### Lỗi: "FFmpeg not found"

```bash
# Kiểm tra FFmpeg đã install chưa
ffmpeg -version

# Nếu chưa, cài đặt theo hướng dẫn ở trên
```

### Lỗi: "CUDA not available"

Bình thường, Whisper sẽ dùng CPU. Nếu muốn GPU:

```bash
# Cài torch với CUDA support
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
```

### Lỗi: "Gemini API key not found"

```bash
# Kiểm tra environment variable
python -c "import os; print(os.getenv('GEMINI_API_KEY'))"

# Nếu rỗng, set lại theo hướng dẫn Bước 6
```

### Âm thanh không phát hiện được

- Kiểm tra format audio có hỗ trợ không (MP3, WAV, M4A, etc.)
- Kiểm tra FFmpeg cài đặt đúng
- Thử convert sang MP3: `ffmpeg -i input.wav output.mp3`

## 📊 Performance Tips

### Tăng tốc độ

1. Dùng model nhỏ hơn (tiny, base thay vì large)
2. Bật GPU nếu có
3. Giảm độ dài audio (split thành chunks)

### Cải thiện độ chính xác

1. Dùng model lớn hơn (medium, large)
2. Cung cấp context chính xác
3. Audio phải rõ ràng, không quá ồn

## 📝 Ví dụ từ điển sửa lỗi

```python
# Các lỗi sẽ tự động được sửa:
"RedJest" → "ReactJS"
"sot code" → "source code"
"REG" → "React"
"click vào cái" → "nhấn vào"  # (AI tự sửa)
```

## 🤝 Contribute

Pull requests welcome! Hãy fork, commit changes, và submit PR.

## 📄 License

MIT License - xem file LICENSE

## ⚠️ Important Notes

- **Whisper Model**: Lần đầu chạy sẽ download ~140MB (base model)
- **Gemini API**: Free tier có giới hạn request/day
- **Audio Length**: Tùy theo model, processing time sẽ khác nhau
- **Vietnamese Support**: Model Whisper medium+ hỗ trợ tốt tiếng Việt

## 📞 Support

Có issue? Tạo GitHub issue hoặc liên hệ direct!

---

**Happy transcribing! 🎉**
