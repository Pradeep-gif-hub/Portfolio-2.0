import type { VercelRequest, VercelResponse } from '@vercel/node';

const {
  SPOTIFY_CLIENT_ID = '',
  SPOTIFY_CLIENT_SECRET = '',
  SPOTIFY_REFRESH_TOKEN = '',
} = process.env;

const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const getAccessToken = async (): Promise<string> => {
  const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  const data = await response.json();
  return data.access_token;
};

const getNowPlaying = async (accessToken: string) => {
  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 204 || response.status >= 400) {
    return { isPlaying: false };
  }

  const data = await response.json();

  if (!data.is_playing) {
    return { isPlaying: false };
  }

  const track = data.item;
  return {
    isPlaying: true,
    title: track.name,
    artist: track.artists.map((artist: any) => artist.name).join(', '),
    album: track.album.name,
    albumImageUrl: track.album.images[0]?.url,
    songUrl: track.external_urls.spotify,
  };
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if Spotify credentials are configured
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return res.status(200).json({ isPlaying: false });
  }

  try {
    const accessToken = await getAccessToken();
    const nowPlaying = await getNowPlaying(accessToken);
    
    // Cache for 30 seconds
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    
    return res.status(200).json(nowPlaying);
  } catch (error) {
    console.error('Spotify API error:', error);
    return res.status(200).json({ isPlaying: false });
  }
}
