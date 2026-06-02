const BASE = 'https://cnvmp3.com';
const PAGE_URL = `${BASE}/v54`;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function extractYouTubeId(input) {
  if (!input) return null;
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) {
    return input.trim();
  }

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match) return match[1];
  }

  return null;
}

async function initSession() {
  await fetch(PAGE_URL, {
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.5',
      'cache-control': 'max-age=0',
      'upgrade-insecure-requests': '1',
      'Referer': PAGE_URL,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
  });
}

async function checkDatabase(youtubeId, quality = 4, format = 1) {
  const apiUrl = `${BASE}/check_database.php`;
  const resp = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.5',
      'content-type': 'application/json',
      'Referer': PAGE_URL,
      'Origin': BASE,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({
      youtube_id: youtubeId,
      quality: quality,
      formatValue: format,
    }),
  });

  return resp.json();
}

async function convertVideo(youtubeId, quality = 4, format = 1) {
  const convertUrl = `${BASE}/convert.php`;
  const resp = await fetch(convertUrl, {
    method: 'POST',
    headers: {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.5',
      'content-type': 'application/json',
      'Referer': PAGE_URL,
      'Origin': BASE,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({
      youtube_id: youtubeId,
      quality: quality,
      formatValue: format,
    }),
  });

  return resp.json();
}

function extractDownloadUrl(data) {
  if (!data) return null;

  if (data.download_url) return data.download_url;
  if (data.file) return data.file;
  if (data.link) return data.link;
  if (data.url) return data.url;

  if (data.data) {
    if (data.data.server_path) return data.data.server_path;
    if (data.data.download_url) return data.data.download_url;
    if (data.data.file) return data.data.file;
    if (data.data.link) return data.data.link;
    if (data.data.url) return data.data.url;
  }

  return null;
}

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (url.pathname === '/' || url.pathname === '/api/convert') {
    const input = url.searchParams.get('url') || url.searchParams.get('youtube_id') || url.searchParams.get('id');

    if (!input) {
      return new Response(JSON.stringify({
        status: true,
        creator: 'Nimesh Piyumal',
        response: 'YouTube to MP3 API',
      }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }

    try {
      const quality = parseInt(url.searchParams.get('quality')) || 4;
      const format = parseInt(url.searchParams.get('format')) || 1;

      const youtubeId = extractYouTubeId(input);
      if (!youtubeId) {
        return new Response(JSON.stringify({
          status: false,
          creator: 'Nimesh Piyumal',
          error: 'Invalid YouTube URL or video ID',
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }

      await initSession();

      const dbResult = await checkDatabase(youtubeId, quality, format);
      let downloadUrl = extractDownloadUrl(dbResult);
      let title = dbResult?.data?.title || null;

      if (!downloadUrl) {
        const convertResult = await convertVideo(youtubeId, quality, format);
        downloadUrl = extractDownloadUrl(convertResult);
        title = convertResult?.data?.title || convertResult?.title || title;

        if (!downloadUrl && convertResult?.success === false) {
          return new Response(JSON.stringify({
            status: false,
            creator: 'Nimesh Piyumal',
            error: 'Conversion failed',
          }), {
            status: 502,
            headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          });
        }
      }

      if (!downloadUrl) {
        return new Response(JSON.stringify({
          status: false,
          creator: 'Nimesh Piyumal',
          error: 'Could not retrieve download URL',
        }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        });
      }

      return new Response(JSON.stringify({
        status: true,
        creator: 'Nimesh Piyumal',
        result: {
          id: youtubeId,
          title: title,
          quality: quality,
          format: format === 1 ? 'mp3' : 'mp4',
          dl_link: downloadUrl
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });

    } catch (err) {
      return new Response(JSON.stringify({
        status: false,
        creator: 'Nimesh Piyumal',
        error: err.message,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      });
    }
  }

  return new Response(JSON.stringify({
    status: false,
    creator: 'Nimesh Piyumal',
    error: 'Not found',
  }), {
    status: 404,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
};
