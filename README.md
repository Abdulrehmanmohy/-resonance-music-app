# 🎵 Resonance - High-Fidelity Global Music Streaming Application

**Resonance** is a modern full-stack music streaming platform designed strictly adhering to the Google Stitch **"Sonic Luxe"** design system. It brings together **Urdu, Indian, English, and worldwide songs** with real audio streaming, interactive waveforms, synchronized live karaoke lyrics, playlists, and dark-mode glassmorphic aesthetics.

---

## ✨ Features

- **Global & Regional Catalog Integration**:
  - 🇵🇰 **Urdu & Coke Studio**: Atif Aslam, Kaifi Khalil, Young Stunners, Ali Zafar, Hasan Raheem, Abdul Hannan, Nusrat Fateh Ali Khan.
  - 🇮🇳 **Bollywood & Punjabi**: Arijit Singh, AP Dhillon, Sidhu Moosewala, Pritam, Shreya Ghoshal, Diljit Dosanjh, AR Rahman.
  - 🌍 **Global Billboard & English**: The Weeknd, Taylor Swift, Billie Eilish, Eminem, Bruno Mars, Dua Lipa.
  - 🔍 **Instant Universal Search**: Real-time search across any song, artist, album, or genre worldwide with high-res album covers (600x600) and streaming audio.

- **Immersive 5-Screen UI Architecture (From Stitch)**:
  1. 🏠 **Music Home & Now Playing**: Hero spotlight, category pills, curated regional feeds, persistent mini player.
  2. 🎵 **Now Playing & Live Lyrics**: Full-screen modal player, dynamic artwork bloom, real audio scrubber, volume slider, and real-time synchronized karaoke-style lyrics.
  3. 🔍 **Search & Explore Hub**: Live search bar with clear button, genre exploration cards (Bollywood, Urdu Indie, Synthwave, Lo-Fi, Punjabi, EDM).
  4. 📚 **Your Library & Playlists**: Liked songs auto-collection, custom user playlists, modal to create playlists.
  5. 🎤 **Artist Profile & Discography**: Hero backdrop, monthly listeners counter, popular releases table with streaming, album discography, and bio.

- **Persistent HTML5 Audio Engine (`PlayerContext`)**:
  - Continuous uninterrupted playback while switching screens.
  - Play, Pause, Previous, Next, Seek Scrubber.
  - Volume slider with mute toggle.
  - Repeat modes (`All`, `One`, `Off`) and Shuffle toggle.
  - Animated live 4-bar equalizer indicators that pulse when audio is active.
  - Like / Favorite toggle persisted in `localStorage`.

---

## 🎨 Design System: Sonic Luxe
- **Canvas Base**: `#131313` (Atmospheric Dark Mode)
- **Primary Energy**: `#ddb7ff` & `#a855f7` (Radiant Neon Purple)
- **Secondary Frequency**: `#4cd7f6` & `#06b6d4` (Electric Cyan)
- **Typography**: Plus Jakarta Sans
- **Visuals**: Luminescent Glassmorphism, blurred ambient light orbs, pill-shaped controls (`rounded-full`).

---

## 🚀 Running the App

### 1. Production / Single Server Mode
Runs both the backend API and serves the production frontend build:
```bash
cd resonance-music-app
npm run build
npm start
```
The app will be live at: **http://localhost:5000**

### 2. Development Mode
```bash
# Terminal 1: Start Backend API (Port 5000)
npm run server

# Terminal 2: Start Vite Dev Server with HMR (Port 5173)
npm run dev
```
Open **http://localhost:5173**
