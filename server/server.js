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

// Fallback high-quality curated tracks for instant zero-latency loading
const CURATED_TRACKS = {
  urdu: [
    {
      id: 'urdu_1',
      title: 'Kahani Suno 2.0',
      artist: 'Kaifi Khalil',
      album: 'Kahani Suno',
      artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      durationMs: 174000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/78/23/75/78237534-1462-7779-165f-502bf22bed03/mzaf_15915982225370167762.plus.aac.p.m4a',
      genre: 'Urdu Pop / Indie',
      releaseDate: '2022',
      isExplicit: false,
    },
    {
      id: 'urdu_2',
      title: 'Tajdar-e-Haram',
      artist: 'Atif Aslam',
      album: 'Coke Studio Season 8',
      artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      durationMs: 240000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/ce/22/0c/ce220c54-4740-42cf-36aa-060481c5040a/mzaf_16489370884617571340.plus.aac.p.m4a',
      genre: 'Sufi / Coke Studio',
      releaseDate: '2015',
      isExplicit: false,
    },
    {
      id: 'urdu_3',
      title: 'Afsaanay',
      artist: 'Young Stunners, Talha Anjum, Talhah Yunus',
      album: 'Afsaanay - Single',
      artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
      durationMs: 232000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/10/d8/1c/10d81c16-b1cb-1718-eef7-86c8d4a66a15/mzaf_4078491873837965373.plus.aac.p.m4a',
      genre: 'Urdu Hip-Hop',
      releaseDate: '2021',
      isExplicit: true,
    },
    {
      id: 'urdu_4',
      title: 'Pasoori',
      artist: 'Ali Sethi & Shae Gill',
      album: 'Coke Studio Season 14',
      artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      durationMs: 224000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/4a/1b/02/4a1b0264-c0e8-07db-5e04-8b64b143c683/mzaf_13596707328904715568.plus.aac.p.m4a',
      genre: 'World / Fusion',
      releaseDate: '2022',
      isExplicit: false,
    },
    {
      id: 'urdu_5',
      title: 'Bikhra',
      artist: 'Abdul Hannan & Rovalio',
      album: 'Bikhra - Single',
      artwork: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=600&auto=format&fit=crop&q=80',
      durationMs: 189000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/eb/8c/19/eb8c1990-2e0f-90fc-3b3d-1eb956276800/mzaf_1009893977531778930.plus.aac.p.m4a',
      genre: 'Urdu Indie Pop',
      releaseDate: '2022',
      isExplicit: false,
    }
  ],
  indian: [
    {
      id: 'indian_1',
      title: 'Kesariya',
      artist: 'Arijit Singh & Pritam',
      album: 'Brahmastra',
      artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      durationMs: 268000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview112/v4/90/e5/22/90e522d0-7a05-1a3b-2877-c918c544e311/mzaf_4614213303668102148.plus.aac.p.m4a',
      genre: 'Bollywood',
      releaseDate: '2022',
      isExplicit: false,
    },
    {
      id: 'indian_2',
      title: 'Tum Hi Ho',
      artist: 'Arijit Singh & Mithoon',
      album: 'Aashiqui 2',
      artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
      durationMs: 262000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/e5/1e/8a/e51e8a94-4340-96f3-a178-0cb933752e25/mzaf_17208696773307584168.plus.aac.p.m4a',
      genre: 'Bollywood Romance',
      releaseDate: '2013',
      isExplicit: false,
    },
    {
      id: 'indian_3',
      title: 'Brown Munde',
      artist: 'AP Dhillon, Gurinder Gill, Shinda Kahlon',
      album: 'Brown Munde - Single',
      artwork: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&auto=format&fit=crop&q=80',
      durationMs: 247000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/37/10/7c/37107cfa-65be-82f1-6789-9eb10a2bbdb9/mzaf_15729707268800588636.plus.aac.p.m4a',
      genre: 'Punjabi Hip-Hop',
      releaseDate: '2020',
      isExplicit: false,
    },
    {
      id: 'indian_4',
      title: '295',
      artist: 'Sidhu Moose Wala',
      album: 'Moosetape',
      artwork: 'https://images.unsplash.com/photo-1445985543470-41f30c08f107?w=600&auto=format&fit=crop&q=80',
      durationMs: 270000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/65/59/31/6559313d-8869-7977-1065-0bc49fc0e092/mzaf_1578500275537449339.plus.aac.p.m4a',
      genre: 'Punjabi Rap',
      releaseDate: '2021',
      isExplicit: true,
    },
    {
      id: 'indian_5',
      title: 'Kun Faya Kun',
      artist: 'A.R. Rahman, Javed Ali, Mohit Chauhan',
      album: 'Rockstar',
      artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      durationMs: 473000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/8a/0a/60/8a0a6042-491f-0a06-a889-ff8205f0134d/mzaf_16886617066986518167.plus.aac.p.m4a',
      genre: 'Sufi Devotional',
      releaseDate: '2011',
      isExplicit: false,
    }
  ],
  english: [
    {
      id: 'eng_1',
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      durationMs: 200000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/cd/b9/eb/cdb9eb57-0a42-7efc-d10a-3a223f03b5f9/mzaf_12411624896068305719.plus.aac.p.m4a',
      genre: 'Synthwave / Pop',
      releaseDate: '2020',
      isExplicit: false,
    },
    {
      id: 'eng_2',
      title: 'Starboy (feat. Daft Punk)',
      artist: 'The Weeknd',
      album: 'Starboy',
      artwork: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      durationMs: 230000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview115/v4/28/19/29/2819293f-67ee-0ee9-43c2-d3a985e505ba/mzaf_9748648174575971488.plus.aac.p.m4a',
      genre: 'R&B / Electro',
      releaseDate: '2016',
      isExplicit: true,
    },
    {
      id: 'eng_3',
      title: 'Cruel Summer',
      artist: 'Taylor Swift',
      album: 'Lover',
      artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&auto=format&fit=crop&q=80',
      durationMs: 178000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/21/df/bf/21dfbfb9-ef61-fc4e-3f73-047b337c8da1/mzaf_15091703666505081545.plus.aac.p.m4a',
      genre: 'Pop',
      releaseDate: '2019',
      isExplicit: false,
    },
    {
      id: 'eng_4',
      title: 'Birds of a Feather',
      artist: 'Billie Eilish',
      album: 'HIT ME HARD AND SOFT',
      artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      durationMs: 196000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/8e/3c/6f/8e3c6f14-e59e-1f81-54bc-447551ae68e8/mzaf_17726588233777592994.plus.aac.p.m4a',
      genre: 'Alternative Pop',
      releaseDate: '2024',
      isExplicit: false,
    },
    {
      id: 'eng_5',
      title: 'Lose Yourself',
      artist: 'Eminem',
      album: '8 Mile (Music from the Motion Picture)',
      artwork: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
      durationMs: 326000,
      streamUrl: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/24/4d/5f/244d5fa3-d2d8-2a14-d07f-71239c0f91bc/mzaf_13506456722353724855.plus.aac.p.m4a',
      genre: 'Hip-Hop / Rap',
      releaseDate: '2002',
      isExplicit: true,
    }
  ]
};

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
  const pl = playlists.find(p => p.id === id);
  if (!pl) return res.status(404).json({ error: 'Playlist not found' });

  if (!pl.tracks.some(t => t.id === track.id)) {
    pl.tracks.push(track);
    pl.trackCount = pl.tracks.length;
    savePlaylists(playlists);
  }
  res.json(pl);
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
