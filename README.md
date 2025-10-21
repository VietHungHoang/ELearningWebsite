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
python src/scripts/transcribe_simple.py "path/to/audio.mp3"

# Với context tùy chỉnh
python src/scripts/transcribe_simple.py "path/to/audio.mp3" --context "ReactJS"
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

### Cách 3: Dùng CLI Module

```bash
# Dùng module chính
python -m src.cli "audio/file.mp3" --language vi --context "ReactJS"

# Batch processing
python src/scripts/batch_transcribe.py --input audio --output output --language vi
```

### Cách 4: Chạy bằng Docker

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
├── src/                          # ⭐ Main package
│   ├── __init__.py              # Package init
│   ├── cli.py                   # CLI interface
│   ├── app.py                   # Main app entry
│   ├── core/                    # Core business logic
│   │   ├── __init__.py
│   │   ├── whisper_engine.py    # Whisper transcription
│   │   ├── gemini_enhancer.py   # AI text enhancement
│   │   └── audio_processor.py   # Audio processing
│   ├── api/                     # API layer ⭐ NEW!
│   │   ├── __init__.py          # Flask app & endpoints
│   │   ├── lesson_service.py    # Call Lesson Service API
│   │   ├── subtitle_service.py  # Database operations
│   │   └── subtitle_cache.py    # Caching layer
│   ├── jobs/                    # Background jobs ⭐ NEW!
│   │   ├── __init__.py
│   │   └── transcription_job.py # Pre-generate subtitles
│   ├── utils/                   # Utilities & helpers
│   │   ├── __init__.py
│   │   └── config.py            # Config & file utils
│   └── scripts/                 # CLI entry points
│       ├── __init__.py
│       ├── transcribe_simple.py # Simple wrapper
│       └── batch_transcribe.py  # Batch processing
├── tests/                        # Unit tests
│   ├── __init__.py
│   └── test_gemini.py           # Gemini API tests
├── audio/                        # Input audio files
├── output/                       # Output transcriptions
├── models/                       # Model cache
├── Dockerfile                   # Docker config
├── docker-compose.yml           # Docker compose
├── requirements.txt              # Dependencies
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

├── audio/ # Input audio/video files
├── output/ # Transcription results
├── Dockerfile # Docker configuration
├── docker-compose.yml # Docker compose
├── requirements.txt # Python dependencies
├── .gitignore # Git ignore rules
└── README.md # This file

````

## 🔧 Troubleshooting

### Lỗi: "FFmpeg not found"

```bash
# Kiểm tra FFmpeg đã install chưa
ffmpeg -version

# Nếu chưa, cài đặt theo hướng dẫn ở trên
````

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

## 🐳 Docker Deployment

### Build Image

```bash
docker build -t whisper-transcription-api:latest .
```

### Run with Docker Compose

#### Production Setup

```bash
# 1. Create .env file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 2. Start services (production mode)
docker-compose up -d

# 3. API will be available at http://localhost:5000
```

#### Development Setup

```bash
# Start with development environment (hot-reload enabled)
FLASK_ENV=development FLASK_DEBUG=True docker-compose up -d
```

#### With Optional Lesson Service

```bash
# Start Whisper API + Lesson Service
docker-compose --profile lesson-service up -d
```

### Manual Docker Run

```bash
docker run -d \
  -p 5000:5000 \
  -e GEMINI_API_KEY=your_key \
  -e FLASK_ENV=production \
  -v $(pwd)/audio:/app/audio \
  -v $(pwd)/output:/app/output \
  -v $(pwd)/models:/app/models \
  --name whisper-api \
  whisper-transcription-api:latest
```

### API Endpoints

```bash
# Health check
curl http://localhost:5000/api/health

# Get subtitles for lesson 42
curl http://localhost:5000/api/subtitles/42

# Download SRT file
curl -O http://localhost:5000/api/subtitles/42/download
```

### Admin Script (inside or outside Docker)

```bash
# Inside Docker container
docker exec whisper-api python src/scripts/transcribe_lesson.py 42 /app/audio/lesson.mp3

# Outside container (local)
python src/scripts/transcribe_lesson.py 42 audio/lesson.mp3
```

### Docker Compose Services

| Service        | Port | Purpose                                | Profile        |
| -------------- | ---- | -------------------------------------- | -------------- |
| whisper-api    | 5000 | REST API for serving subtitles         | default        |
| lesson-service | 8000 | (Optional) External lesson context API | lesson-service |

### Volumes

| Volume     | Mount         | Purpose                             |
| ---------- | ------------- | ----------------------------------- |
| `./audio`  | `/app/audio`  | Input audio files                   |
| `./output` | `/app/output` | Generated SRT/VTT files             |
| `./models` | `/app/models` | Cached Whisper models               |
| `./src`    | `/app/src`    | Source code (for hot-reload in dev) |

### Environment Variables

See `.env.example` for all available options:

- `GEMINI_API_KEY` - Google Gemini API key (required)
- `LESSON_SERVICE_URL` - External lesson service URL
- `FLASK_ENV` - Flask environment (production/development)
- `FLASK_DEBUG` - Debug mode (True/False)

### Docker Commands

```bash
# View logs
docker-compose logs -f whisper-api

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Rebuild image
docker-compose up -d --build

# Remove all volumes (careful!)
docker-compose down -v

# Shell into container
docker exec -it whisper-api bash
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
