# 🎵 YouTube to MP3 API — Cloudflare Worker

A free, lightweight API to convert YouTube videos to MP3 and get direct download links. Built to run perfectly on **Cloudflare Workers** at the edge.

> Built by [Nimesh Piyumal](https://ceylonnet.com)

---

## 🚀 One-Click Deploy
 
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/nimesh-piyumal/ytmp3-api)
 
> Click the button above to instantly deploy your own instance to Cloudflare Workers — no local setup needed!

---

## ✨ Features

- 🆓 **Free to run** — Deployable on Cloudflare Workers free tier (100,000 requests/day).
- ⚡ **Edge execution** — Runs on Cloudflare's global network for ultra-low latency.
- 🎯 **Smart URL Parsing** — Supports all YouTube URL formats (watch, shorts, embed, youtu.be, or bare video ID).
- 🌍 **CORS enabled** — Ready to be integrated into any web browser frontend application.
- 📦 **Lightweight** — Minimal code footprint with pure ES modules.
- 🔄 **Auto Conversion** — Automatically triggers conversion if the video isn't already cached.

---

## 🚀 Quick Start

### Deploy Your Own

1. **Clone this repo**
   ```bash
   git clone https://github.com/nimesh-piyumal/ytmp3-api.git
   cd ytmp3-api
   ```

2. **Install Dependencies & Wrangler CLI**
   ```bash
   npm install
   npm install -g wrangler
   wrangler login
   ```

3. **Test Locally**
   ```bash
   npm run dev
   ```

4. **Deploy to Cloudflare Workers**
   ```bash
   npm run deploy
   ```

5. **Done!** Your API is live at `https://ytmp3-api.<your-subdomain>.workers.dev`

---

## 📡 API Endpoints

### `GET /`
Returns API health status.

**Response**
```json
{
  "status": true,
  "creator": "Nimesh Piyumal",
  "response": "YouTube to MP3 API"
}
```

---

### `GET /api/convert`
Converts a YouTube video to MP3 and returns the direct download link.

**Request Parameters**
- `url` (required): YouTube URL or video ID.
- `quality` (optional): Audio quality (default: `4`).
- `format` (optional): `1` = MP3, `2` = MP4 (default: `1`).

**Request Example**
```text
GET /api/convert?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

**Supported URL Formats**
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://youtube.com/shorts/VIDEO_ID`
- `https://youtube.com/embed/VIDEO_ID`
- Bare video ID: `dQw4w9WgXcQ`

**Response**
```json
{
  "status": true,
  "creator": "Nimesh Piyumal",
  "result": {
    "id": "dQw4w9WgXcQ",
    "title": "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    "quality": 4,
    "format": "mp3",
    "dl_link": "https://apio11dlp.cnvmp3.online/downloads/download.php?file=/Rick Astley - Never Gonna Give You Up (Official Music Video) 4.mp3"
  }
}
```

---

## 🔌 Usage Examples

### Fetch API (JavaScript / Node.js)
```javascript
const url = "https://ytmp3-api.<your-subdomain>.workers.dev/api/convert?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const response = await fetch(url);
const data = await response.json();

if (data.status) {
  console.log("Title:", data.title);
  console.log("Download:", data.response);
} else {
  console.error("Error:", data.error);
}
```

### Python
```python
import requests

api_url = "https://ytmp3-api.<your-subdomain>.workers.dev/api/convert"
youtube_url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

response = requests.get(api_url, params={"url": youtube_url})
data = response.json()

if data.get("status"):
    print("Title:", data["title"])
    print("Download:", data["response"])
else:
    print("Error:", data.get("error"))
```

### cURL
```bash
curl "https://ytmp3-api.<your-subdomain>.workers.dev/api/convert?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

---

## 📄 License

MIT — free to use, modify, and deploy.

---

<p align="center">Made with ❤️ by <a href="https://ceylonnet.com">Nimesh Piyumal</a></p>
