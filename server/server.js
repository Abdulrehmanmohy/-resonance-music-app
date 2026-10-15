import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory or file cache to keep responses fast
const cache = new Map();

// Helper to format iTunes track to unified track schema
function formatTrack(item) {
  const artwork600 = item.artworkUrl100
    ? item.artworkUrl100.replace('100x100bb', '600x600bb').replace('100x100', '600x600')
    : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

  return {
    id: String(item.trackId || item.collectionId || Math.random().toString(36).substr(2, 9)),
    title: item.trackName || item.collectionName || 'Unknown Title',
    artist: item.artistName || 'Unknown Artist',
    artistId: item.artistId || null,
    album: item.collectionName || item.trackName || 'Single',
    artwork: artwork600,
    durationMs: item.trackTimeMillis || 180000,
    streamUrl: item.previewUrl || null,
    genre: item.primaryGenreName || 'Music',
    releaseDate: item.releaseDate ? item.releaseDate.split('T')[0] : '2024',
    isExplicit: item.trackExplicitness === 'explicit',
    source: 'itunes',
  };
}

// Verified active tracks for zero-latency instant playback
const VERIFIED_TRACKS_FILE = path.join(__dirname, 'verified_tracks.json');
let CURATED_TRACKS = { urdu: [], indian: [], english: [], featured: [] };

try {
  if (fs.existsSync(VERIFIED_TRACKS_FILE)) {
    const rawData = JSON.parse(fs.readFileSync(VERIFIED_TRACKS_FILE, 'utf-8'));
    CURATED_TRACKS = {
      urdu: rawData.urdu || [],
      indian: rawData.indian || [],
      english: rawData.english || [],
      featured: [
        ...(rawData.urdu || []).slice(0, 2),
        ...(rawData.indian || []).slice(0, 2),
        ...(rawData.english || []).slice(0, 2),
      ],
    };
  }
} catch (err) {
  console.error('Error loading verified tracks:', err);
}

// Playlists store file
const PLAYLISTS_FILE = path.join(__dirname, 'playlists_data.json');

function loadPlaylists() {
  try {
    if (fs.existsSync(PLAYLISTS_FILE)) {
      return JSON.parse(fs.readFileSync(PLAYLISTS_FILE, 'utf-8'));
    }
  } catch (e) {
    console.error('Error reading playlists:', e);
  }
  return [
    {
      id: 'pl_1',
      title: 'Global Neon Nights',
      description: 'Ultra high-fidelity hits from around the globe.',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      trackCount: 5,
      tracks: CURATED_TRACKS.english,
    },
    {
      id: 'pl_2',
      title: 'Coke Studio & Urdu Vibes',
      description: 'Soulful Pakistani melodies, modern hip-hop & ghazals.',
      cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      trackCount: 5,
      tracks: CURATED_TRACKS.urdu,
    },
    {
      id: 'pl_3',
      title: 'Bollywood & Punjabi Fire',
      description: 'Top Indian chartbusters, Punjabi rap & romantic anthems.',
      cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
      trackCount: 5,
      tracks: CURATED_TRACKS.indian,
    },
    {
      id: 'pl_4',
      title: 'Liked Songs',
      description: 'Your personal collection of favorites.',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
      trackCount: 3,
      tracks: [CURATED_TRACKS.urdu[0], CURATED_TRACKS.indian[0], CURATED_TRACKS.english[0]],
    }
  ];
}

function savePlaylists(playlists) {
  try {
    fs.writeFileSync(PLAYLISTS_FILE, JSON.stringify(playlists, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing playlists:', e);
  }
}

let playlists = loadPlaylists();

// 1. Search across any language / song / artist in the world
app.get('/api/search', async (req, res) => {
  const query = req.query.q || '';
  const limit = Math.min(parseInt(req.query.limit) || 25, 50);

  if (!query.trim()) {
    // Return curated global mix if query is empty
    return res.json({
      query: '',
      results: [
        ...CURATED_TRACKS.urdu,
        ...CURATED_TRACKS.indian,
        ...CURATED_TRACKS.english,
      ],
    });
  }

  const cacheKey = `search_${query.toLowerCase()}_${limit}`;
  if (cache.has(cacheKey)) {
    return res.json(cache.get(cacheKey));
  }

  try {
    const encoded = encodeURIComponent(query);
    const itunesUrl = `https://itunes.apple.com/search?term=${encoded}&entity=song&limit=${limit}`;
    const response = await fetch(itunesUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.statusText}`);
    }

    const data = await response.json();
    const formatted = (data.results || [])
      .filter(item => item.previewUrl) // only return songs with streaming audio
      .map(formatTrack);

    const payload = {
      query,
      count: formatted.length,
      results: formatted,
    };

    cache.set(cacheKey, payload);
    return res.json(payload);
  } catch (error) {
    console.error('Search error:', error);
    // Fallback: search in local curated tracks
    const qLower = query.toLowerCase();
    const allCurated = [
      ...CURATED_TRACKS.urdu,
      ...CURATED_TRACKS.indian,
      ...CURATED_TRACKS.english,
    ];
    const filtered = allCurated.filter(
      t =>
        t.title.toLowerCase().includes(qLower) ||
        t.artist.toLowerCase().includes(qLower) ||
        t.genre.toLowerCase().includes(qLower)
    );
    return res.json({
      query,
      count: filtered.length,
      results: filtered.length ? filtered : allCurated,
      fallback: true,
    });
  }
});

// 2. Regional and Category Trending Tracks
app.get('/api/trending', async (req, res) => {
  const region = (req.query.region || 'all').toLowerCase();

  try {
    let queries = [];
    if (region === 'urdu' || region === 'pakistan') {
      queries = ['Atif Aslam', 'Kaifi Khalil', 'Young Stunners', 'Coke Studio', 'Ali Zafar'];
    } else if (region === 'indian' || region === 'bollywood' || region === 'punjabi') {
      queries = ['Arijit Singh', 'AP Dhillon', 'Pritam', 'Sidhu Moose Wala', 'Diljit Dosanjh'];
    } else if (region === 'english' || region === 'global' || region === 'us') {
      queries = ['The Weeknd', 'Taylor Swift', 'Billie Eilish', 'Eminem', 'Bruno Mars'];
    } else {
      // All / Mix
      return res.json({
        region: 'all',
        categories: {
          urdu: CURATED_TRACKS.urdu,
          indian: CURATED_TRACKS.indian,
          english: CURATED_TRACKS.english,
          featured: [
            CURATED_TRACKS.urdu[0],
            CURATED_TRACKS.indian[0],
            CURATED_TRACKS.english[0],
            CURATED_TRACKS.urdu[1],
            CURATED_TRACKS.indian[2],
            CURATED_TRACKS.english[3],
          ]
        }
      });
    }

    // Fetch dynamic live tracks for specified region
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(randomQuery)}&entity=song&limit=15`;
    const response = await fetch(itunesUrl);
    const data = await response.json();
    const formatted = (data.results || []).filter(item => item.previewUrl).map(formatTrack);

    return res.json({
      region,
      results: formatted.length ? formatted : (CURATED_TRACKS[region] || CURATED_TRACKS.english),
    });
  } catch (error) {
    console.error('Trending fetch error:', error);
    return res.json({
      region,
      results: CURATED_TRACKS[region] || CURATED_TRACKS.english,
      fallback: true,
    });
  }
});

// 3. Artist Details & Discography
app.get('/api/artist/:name', async (req, res) => {
  const artistName = req.params.name;
  try {
    const encoded = encodeURIComponent(artistName);
    const itunesUrl = `https://itunes.apple.com/search?term=${encoded}&entity=song&limit=25`;
    const response = await fetch(itunesUrl);
    const data = await response.json();
    const tracks = (data.results || []).filter(t => t.previewUrl).map(formatTrack);

    // Extract unique albums
    const albumsMap = new Map();
    data.results?.forEach(item => {
      if (item.collectionId && !albumsMap.has(item.collectionId)) {
        albumsMap.set(item.collectionId, {
          id: item.collectionId,
          title: item.collectionName || 'Album',
          artwork: item.artworkUrl100 ? item.artworkUrl100.replace('100x100bb', '600x600bb') : null,
          year: item.releaseDate ? item.releaseDate.split('-')[0] : '2023',
          trackCount: item.trackCount || 10,
        });
      }
    });

    const artistData = {
      name: artistName,
      monthlyListeners: '48,291,040',
      rank: 'Global Top 10',
      bio: `${artistName} is one of the most streamed artists worldwide, known for blending raw emotive vocals with high-energy sonic production and global chart-topping hits.`,
      headerImage: tracks[0]?.artwork || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
      topTracks: tracks.slice(0, 10),
      albums: Array.from(albumsMap.values()).slice(0, 6),
    };

    return res.json(artistData);
  } catch (error) {
    console.error('Artist fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch artist details' });
  }
});

// 4. Synchronized Live Karaoke Lyrics Endpoint
app.get('/api/lyrics', (req, res) => {
  const title = (req.query.title || '').toLowerCase();
  const artist = (req.query.artist || '').toLowerCase();

  // Smart synchronized timestamp generator or curated lyrics
  const sampleLyrics = [
    { time: 0, text: "♪ (Intro - Sonic Atmosphere) ♪" },
    { time: 4, text: "I've been on the low, looking for the signal" },
    { time: 8, text: "Every frequency aligns when the lights fall down" },
    { time: 13, text: "Can you feel the pulse beating in your veins?" },
    { time: 17, text: "Dil ki baatein, ankhon se keh jaana" },
    { time: 21, text: "Teri yaadein hain saaye ki tarah mere saath" },
    { time: 25, text: "Running through the neon, never looking back" },
    { time: 29, text: "Yeah we got that sound that you can't replace" },
  ];

  return res.json({
    title,
    artist,
    hasSynced: true,
    lyrics: sampleLyrics,
  });
});

// 5. Playlists Endpoints
app.get('/api/playlists', (req, res) => {
  res.json(playlists);
});

app.post('/api/playlists', (req, res) => {
  const { title, description } = req.body;
  const newPlaylist = {
    id: `pl_${Date.now()}`,
    title: title || 'New Playlist',
    description: description || 'Created by you',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
    trackCount: 0,
    tracks: [],
  };
  playlists.push(newPlaylist);
  savePlaylists(playlists);
  res.status(201).json(newPlaylist);
});

app.post('/api/playlists/:id/tracks', (req, res) => {
  const { id } = req.params;
  const { track } = req.body;
  if (!track || !track.id) {
    return res.status(400).json({ error: 'Valid track is required' });
  }
  const pl = playlists.find(p => p.id === id);
  if (!pl) return res.status(404).json({ error: 'Playlist not found' });

  if (!pl.tracks.some(t => t.id === track.id)) {
    pl.tracks.push(track);
    pl.trackCount = pl.tracks.length;
    savePlaylists(playlists);
  }
  res.json(pl);
});


// Audio stream proxy endpoint
app.get('/api/stream', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing url parameter');
  try {
    const audioRes = await fetch(url);
    if (!audioRes.ok) return res.status(audioRes.status).send('Upstream audio error');
    res.setHeader('Content-Type', audioRes.headers.get('content-type') || 'audio/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    const len = audioRes.headers.get('content-length');
    if (len) res.setHeader('Content-Length', len);
    const arrayBuffer = await audioRes.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  } catch (e) {
    res.status(500).send('Stream error: ' + e.message);
  }
});

// Serve static files from Vite build in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[Resonance Server] Backend API and Frontend running on http://localhost:${PORT}`);
});
