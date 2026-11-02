# Cinematic Royal Wedding Invitation Clone

A high-performance clone of the **Nisarg Weds Khushi** royal wedding web experience built with **Next.js (App Router)**, **React 18**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🚀 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Build for Production
```bash
npm run build
npm run start
```

---

## 📂 Project Architecture

```
├── app/
│   ├── layout.tsx             # Fonts (Cormorant & Inter), Metadata, OpenGraph
│   ├── page.tsx               # Main entry orchestrator
│   └── globals.css            # Custom royal theme styles & keyframes
├── components/
│   ├── Preloader.tsx          # Dual-meter progress loader (Visuals % & Music %)
│   ├── CanvasScroller.tsx     # 60fps canvas scrollytelling cover renderer
│   ├── SceneOverlays.tsx      # 3D typography, blur transitions & maps buttons
│   ├── CinematicJourney.tsx   # Gesture, wheel, auto-tour & navigation dots
│   ├── AudioPlayer.tsx        # Equalizer visualizer & volume fade controller
│   └── CelebrationsScreen.tsx # Countdown timer, event cards & .ics exports
├── lib/
│   ├── frame-loader.ts        # Dynamic scene batch loader & LRU frame cache
│   └── audio-manager.ts       # Web Audio API music player with fade transitions
├── types/
│   └── wedding.ts             # All editable data (names, events, timeline)
└── public/assets/
    ├── audio/                 # Royal soundtrack (audio.m4a)
    ├── logo/                  # Monograms and emblems
    └── frames/                # 759 high-definition JPEG cinematic frames
```

---

## 🎨 How to Customize

### 1. Wedding Details, Dates & Venues
Open [`types/wedding.ts`](types/wedding.ts):
- Update `CELEBRATION_EVENTS` to customize event titles (Haldi, Mehndi, Sangeet, Wedding, Reception), dates, times, addresses, and Google Maps links.
- Update `SCENES` or `TIMELINE_VIEWS` to customize scene progression.

### 2. Couple Names & Insignias
- Replace the insignia images in `public/assets/logo/`:
  - `nk-locked-logo.png` (Main master monogram)
  - `nk-short.png` (Horizontal header insignia)

### 3. Background Music
- Replace `public/assets/audio/audio.m4a` with your own audio file.

### 4. Countdown Target Date
Open [`components/CelebrationsScreen.tsx`](components/CelebrationsScreen.tsx) and change `TARGET_WEDDING_DATE`:
```typescript
const TARGET_WEDDING_DATE = new Date("2026-11-21T09:30:00+05:30").getTime();
```
