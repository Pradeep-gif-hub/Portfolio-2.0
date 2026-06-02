import type { VercelRequest, VercelResponse } from '@vercel/node';

const {
  LASTFM_API_KEY = '',
  LASTFM_USERNAME = '',
} = process.env;

const LASTFM_API_ENDPOINT = 'https://ws.audioscrobbler.com/2.0/';

// Fetch OpenGraph image from Last.fm track page as fallback
const fetchOpenGraphImage = async (url: string): Promise<string | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    
    const html = await response.text();
    const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
    
    if (ogImageMatch && ogImageMatch[1]) {
      return ogImageMatch[1];
    }
  } catch (error) {
    console.error('Error fetching OpenGraph image:', error);
  }
  return null;
};

const getRecentTracks = async (apiKey: string, username: string) => {
  const params = new URLSearchParams({
    method: 'user.getrecenttracks',
    user: username,
    api_key: apiKey,
    limit: '1',
    format: 'json',
  });

  const response = await fetch(`${LASTFM_API_ENDPOINT}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch from Last.fm');
  }

  const data = await response.json();

  if (!data.recenttracks || !data.recenttracks.track) {
    return { isPlaying: false };
  }

  const track = Array.isArray(data.recenttracks.track) 
    ? data.recenttracks.track[0] 
    : data.recenttracks.track;

  // Check if the track is currently playing (has @attr.nowplaying)
  const isPlaying = track['@attr']?.nowplaying === 'true';

  // Enhanced image extraction logic - try all image sizes
  let albumImageUrl = '';
  
  console.log('[Last.fm] Full track object:', JSON.stringify(track, null, 2));
  
  if (track.image && Array.isArray(track.image)) {
    console.log('[Last.fm] Image array length:', track.image.length);
    console.log('[Last.fm] Image array details:');
    track.image.forEach((img: any, idx: number) => {
      console.log(`  [${idx}]:`, JSON.stringify(img, null, 2));
    });
    
    // Try to get the largest image (index 3), then fall back to smaller ones
    albumImageUrl = 
      track.image?.[3]?.['#text'] ||
      track.image?.[2]?.['#text'] ||
      track.image?.[1]?.['#text'] ||
      track.image?.[0]?.['#text'] ||
      '';
  } else if (track.image && typeof track.image === 'object') {
    console.log('[Last.fm] Image is object (not array):', track.image);
    albumImageUrl = track.image['#text'] || '';
  }

  // Debug logging
  console.log('[Last.fm] Track:', track.name, 'by', track.artist?.['#text'] || track.artist);
  console.log('[Last.fm] Extracted albumImageUrl:', albumImageUrl);
  console.log('[Last.fm] Album ImageUrl is empty?', !albumImageUrl);

  // Fallback: If no image URL from Last.fm, try to fetch from OpenGraph
  if (!albumImageUrl && track.url) {
    console.log('[Last.fm] Attempting OpenGraph fallback for:', track.url);
    const ogImage = await fetchOpenGraphImage(track.url);
    if (ogImage) {
      albumImageUrl = ogImage;
      console.log('[Last.fm] OpenGraph image found:', ogImage);
    } else {
      console.log('[Last.fm] OpenGraph fallback returned no image');
    }
  }

  // Additional fallback: Try to construct image from MB API or use Spotify album art
  if (!albumImageUrl && track.album) {
    const albumName = track.album?.['#text'] || track.album;
    const artistName = track.artist?.['#text'] || track.artist;
    // Construct Last.fm album search URL
    const searchUrl = `https://www.last.fm/search?q=${encodeURIComponent(albumName)}+${encodeURIComponent(artistName)}&type=album`;
    console.log('[Last.fm] Trying to fetch from album search page:', searchUrl);
    const ogImage = await fetchOpenGraphImage(searchUrl);
    if (ogImage) {
      albumImageUrl = ogImage;
      console.log('[Last.fm] Album search OpenGraph image found:', ogImage);
    }
  }

  // Final fallback: Generic placeholder
  if (!albumImageUrl) {
    albumImageUrl = `https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png`;
    console.log('[Last.fm] Using Last.fm placeholder image');
  }

  return {
    isPlaying: isPlaying,
    title: track.name || '',
    artist: track.artist?.['#text'] || track.artist || '',
    album: track.album?.['#text'] || track.album || '',
    albumImageUrl: albumImageUrl,
    songUrl: track.url || `https://www.last.fm/music/${encodeURIComponent(track.artist?.['#text'] || track.artist || '')}/_/${encodeURIComponent(track.name)}`,
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

  // Check if Last.fm credentials are configured
  if (!LASTFM_API_KEY || !LASTFM_USERNAME) {
    console.warn('[Last.fm] Missing credentials: API_KEY or USERNAME');
    return res.status(200).json({ isPlaying: false });
  }

  try {
    const nowPlaying = await getRecentTracks(LASTFM_API_KEY, LASTFM_USERNAME);
    
    // Cache for 30 seconds
    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate');
    
    return res.status(200).json(nowPlaying);
  } catch (error) {
    console.error('[Last.fm] API error:', error);
    return res.status(200).json({ isPlaying: false });
  }
}
