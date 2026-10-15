<div align="center">

# 🎵 RESONANCE
### High-Fidelity Global Music Streaming Experience

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express-5.3-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>Resonance</b> is an ultra-modern, high-fidelity music streaming application crafted with a custom <b>"Sonic Luxe"</b> design architecture. Featuring high-res dynamic album artwork, seamless uninterrupted audio playback, synchronized live karaoke lyrics, and a multi-lingual regional catalog spanning <b>Urdu, Coke Studio, Bollywood, Punjabi, and Global Billboard</b> hits.
</p>

[Explore Features](#-core-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Documentation](#-api-endpoints) • [Design System](#-sonic-luxe-design-system)

</div>

---

## 📸 Overview & Experience

Resonance bridges raw emotive musical artistry with contemporary hyper-responsive web engineering. Built with a unified full-stack architecture, it delivers zero-latency track switching, localized metadata caching, and an ambient glassmorphic visual environment.

```
┌────────────────────────────────────────────────────────────────────────┐
│  RESONANCE AUDIO ECOSYSTEM                                             │
│                                                                        │
│  [ Home / Discover ] ──► [ Search & Explore ] ──► [ Artist Profile ]   │
│           │                       │                        │           │
│           ▼                       ▼                        ▼           │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │           PERSISTENT GLOBAL AUDIO CONTEXT & ENGINE               │  │
│  │  • HTML5 Audio Pipeline  • Uninterrupted Audio Flow              │  │
│  │  • Shuffle / Repeat All  • Synchronized Rolling Lyrics Engine    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│           ▲                                                ▲           │
│           │                                                │           │
│  [ Fullscreen Modal Player ] ◄──────────────► [ Library & Playlists ]  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Core Features

### 🌍 1. Multi-Regional & Global Music Catalog
- **🇵🇰 Urdu & Pakistani Indie / Coke Studio**: Curated lossless streams from Atif Aslam, Kaifi Khalil, Young Stunners, Ali Zafar, Hasan Raheem, Abdul Hannan, Nusrat Fateh Ali Khan.
- **🇮🇳 Bollywood & Punjabi**: High-energy catalog featuring Arijit Singh, AP Dhillon, Sidhu Moose Wala, Pritam, Shreya Ghoshal, Diljit Dosanjh, AR Rahman.
- **🌐 Global Billboard Hits**: Trending chart-toppers from The Weeknd, Taylor Swift, Billie Eilish, Bruno Mars, Eminem, Dua Lipa.
- **⚡ Dynamic Live Universal Search**: Real-time integration with global iTunes streaming APIs providing 600x600 HD artwork and instant 256kbps audio streams.

### 🎧 2. Uninterrupted Global Audio Engine
- **Screen-Independent Playback**: Audio continues playing smoothly as you navigate between Home, Search, Library, and Artist profiles.
- **Dynamic Live Equalizer**: Animated real-time 4-bar equalizer indicators responding dynamically to playback state.
- **State Controls**:
  - Full scrubbing audio timeline with sub-second precision.
  - Multi-mode looping (`Repeat Off`, `Repeat All`, `Repeat One`).
  - True pseudo-random shuffle queue handling.
  - Volume attenuation slider with instant mute toggle.

### 🎤 3. Synchronized Live Karaoke Lyrics
- Dynamic time-synced lyrics rolling engine that highlights lines in rhythm with track timestamps.
- Atmospheric dynamic glow bloom reflecting album colors behind the lyrics view.
- Fullscreen immersive Now-Playing view with quick access toggle.

### 📚 4. Personalized Library & Playlists
- **Liked Songs Auto-Collection**: Instantly like tracks across any view with local persistence (`localStorage`).
- **Custom Playlists**: Create bespoke playlists with instant track additions, custom titles, and dynamic track counters.
- **Instant Artist Navigation**: Click any artist name anywhere in the app to immediately inspect their full discography and top tracks.

### 🧑‍🎤 5. Rich Artist Discography
- Artist hero headers with monthly listener stats and global rankings.
- Instant top 10 streaming tracks with one-click play.
- Studio album discography grid with release years and track counts.

---

## 🎨 "Sonic Luxe" Design System

Engineered strictly around the bespoke **Sonic Luxe** aesthetic:

| Token | Value | Visual Purpose |
| :--- | :--- | :--- |
| **Canvas Base** | `#131313` | Deep obsidian backdrop reducing eye strain |
| **Card Surface** | `#1c1b1b` / `#201f1f` | Elevated frosted containers with subtle transparency |
| **Primary Energy** | `#ddb7ff` & `#a855f7` | Radiant neon amethyst for active highlights & scrubbers |
| **Secondary Wave** | `#4cd7f6` & `#06b6d4` | Electric cyan for badges, buttons, and pulse accents |
| **Typography** | `Plus Jakarta Sans` | Modern geometric sans-serif for crystal clarity |
| **Border Accents** | `rgba(221, 183, 255, 0.15)` | Subtle luminescent border rings around cards and pills |

---

## 🛠 Tech Stack

### Frontend
- **React 19** (`^19.2.8`) - Cutting-edge concurrent UI rendering.
- **Vite 8** (`^8.3.0`) - Ultra-fast ES-module bundler with sub-second HMR.
- **Tailwind CSS v4** (`^4.3.3`) - Zero-runtime CSS engine with glassmorphism utilities.
- **Lucide Icons & Material Symbols** - Crisp high-density vector iconography.

### Backend & Audio Engine
- **Node.js & Express 5** (`^5.3.0`) - High-throughput REST API server.
- **HTML5 Audio Pipeline** - Native browser streaming layer with preloading.
- **Cross-Origin Resource Sharing (CORS)** - Secured cross-domain streaming proxies.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/Abdulrehmanmohy/-resonance-music-app.git
cd -resonance-music-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run in Development Mode
Starts the Vite development server with Hot Module Replacement:
```bash
npm run dev
```

### 4. Production Build & Single-Port Server
Compiles the optimized React frontend and launches the unified Express server on port `5000`:
```bash
npm run build
npm start
```
> The application will immediately be live at **http://localhost:5000**!

---

## 📡 API Endpoints

The unified Express server provides high-performance endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/trending?region=all` | Fetch trending catalog for Urdu, Bollywood, or English |
| `GET` | `/api/search?q=:query` | Live search for tracks, artists, and albums |
| `GET` | `/api/artist/:name` | Fetch artist bio, stats, top tracks, and albums |
| `GET` | `/api/lyrics?title=&artist=` | Fetch synchronized live karaoke lyrics timestamps |
| `GET` | `/api/playlists` | Retrieve all custom playlists |
| `POST` | `/api/playlists` | Create a new custom playlist |
| `POST` | `/api/playlists/:id/tracks` | Add a track to an existing playlist |

---

## 📁 Project Structure

```
resonance-music-app/
├── dist/                     # Optimized production bundle
├── public/                   # Static assets & icons
├── server/
│   ├── server.js             # Express 5 REST API & static file server
│   └── playlists.json        # Persistent playlist datastore
├── src/
│   ├── components/
│   │   ├── ArtistScreen.jsx  # Artist profile & discography
│   │   ├── Header.jsx        # Top navigation & user controls
│   │   ├── HomeScreen.jsx    # Hero spotlight & regional sections
│   │   ├── LibraryScreen.jsx # Liked songs & playlist manager
│   │   ├── MiniPlayer.jsx    # Persistent bottom playback bar
│   │   ├── PlayerModal.jsx   # Fullscreen player with live lyrics
│   │   ├── SearchScreen.jsx  # Universal search & genre cards
│   │   └── Sidebar.jsx       # Navigation drawer
│   ├── context/
│   │   ├── PlayerContext.jsx # Core HTML5 audio state machine
│   │   └── usePlayer.js      # Custom consumer hook
│   ├── App.jsx               # Screen router & modal controller
│   ├── index.css             # Tailwind v4 directives & font imports
│   └── main.jsx              # React 19 root bootstrap
├── index.html                # Entry HTML shell
├── package.json              # Scripts & dependencies
├── vite.config.js            # Vite bundler configuration
└── README.md                 # Project documentation
```

---

## 🔒 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute with attribution.

---

<div align="center">
  <sub>Engineered with precision by <b>Abdulrehman Mohy</b>. Built with React 19, Vite, and Tailwind CSS.</sub>
</div>
