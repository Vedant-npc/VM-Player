# VM Player

A studio-grade video player and video streaming web platform built with React 19, TypeScript, and modern browser media APIs. VM Player delivers sub-second seeking, dynamic volume HUD animations, press-and-hold 2X speed boost, adaptive multi-resolution streaming, and zero-upload local media playback.

![VM Player Banner](public/favicon.svg)

---

## Key Features

- **Precision 10-Second Seeking**:
  - Dedicated `-10s` and `+10s` buttons on the control toolbar.
  - Keyboard mappings: `J` or `ArrowLeft` (-10s), `L` or `ArrowRight` (+10s).
  - Double-click / double-tap on the left 35% of the video viewport seeks backward 10s with directional chevron ripple animation; right 35% seeks forward 10s.

- **Play & Pause Mechanics**:
  - `Space` or `K` key shortcut, bottom control button, and center video click.
  - Central transient indicator scales and fades smoothly upon state changes.

- **Dynamic Volume HUD & Animation**:
  - 4-state responsive speaker icon: Muted (0%), Low (1-33%), Mid (34-66%), and High (67-100%).
  - Smooth acoustic volume slider.
  - Real-time on-screen HUD overlay flashes during keyboard volume adjustments (`ArrowUp` / `ArrowDown`), showing numerical percentage and level bars.

- **Hold for 2X Speed Boost**:
  - Pointer-down or touch-hold on the video viewport for >250ms accelerates playback to `2.0x`.
  - Visual indicator banner displays `>> 2.0X SPEED ACTIVE [HOLDING]`.
  - Releasing pointer or touch smoothly restores the prior base playback rate (e.g. 1.0x).

- **Multi-Resolution Adaptive Ladder**:
  - Quality switcher supporting `1080p60`, `720p`, `480p`, `360p`, and `Auto`.
  - Seamlessly maintains current playback timestamp and state across resolution switches.
  - Dual-layer timeline tracking loaded buffer chunks vs played chunks.

- **Theater Mode, PiP & Fullscreen**:
  - Theater Mode (`T` key) expands the player to widescreen above metadata.
  - Fullscreen (`F` key) via HTML5 Fullscreen API.
  - Picture-in-Picture (`I` key) floating window.

- **Stats for Nerds (Telemetry)**:
  - Real-time technical stream monitor: viewport dimensions, stream resolution, frame drops, buffer health, bitrate, and audio decoders.

- **Stream Ingestion & Local File Playback**:
  - Network Ingestion: stream any direct HTTP/HTTPS `.mp4` or `.webm` link.
  - Local File Ingest: drag and drop any local `.mp4`, `.webm`, or `.mkv` file directly from your disk for instant, hardware-decoded playback with zero network upload.

- **Complete Streaming Platform Experience**:
  - Categorized home feed (Cinema, Animation, Sci-Fi, Nature, Motorsport, Architecture, Custom).
  - Real-time search by title, creator, or topic tags.
  - Watch page with channel subscribe actions, like counters, save to Watch Later, and live comments discussion.
  - Media Library tracking Watch History (with resume timestamps), Watch Later, and Liked Videos.
  - Toast notification engine providing immediate feedback for user actions.

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Space` / `K` | Toggle Play / Pause |
| `J` / `ArrowLeft` | Seek backward 10 seconds |
| `L` / `ArrowRight` | Seek forward 10 seconds |
| `Long Press Screen` | Hold for 2.0X Speed Boost |
| `ArrowUp` | Volume Up (+5%) |
| `ArrowDown` | Volume Down (-5%) |
| `M` | Toggle Mute |
| `F` | Toggle Fullscreen |
| `T` | Toggle Theater Mode |
| `C` | Toggle Closed Captions / Subtitles |
| `I` | Toggle Picture-in-Picture |
| `?` | Open Keyboard Shortcuts Sheet |

---

## Design System

VM Player adheres to a high-contrast, broadcast-grade aesthetic:
- **No generic purple-to-blue gradients or gradient hero text**.
- **No emojis in headings**.
- **Plus Jakarta Sans** typography with system humanist fallback stack.
- Solid studio surfaces (`#090C10`, `#0E121A`, `#161B26`) with crisp 1px borders (`#232A3B`); **no fragile glassmorphism or colored left borders**.
- Custom-crafted SVG icons tailored specifically for media playback.
- Strictly **no horizontal scrolling** with responsive mobile drawer support.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm / yarn

### Installation
```bash
git clone https://github.com/Vedant-npc/VM-Player.git
cd VM-Player
npm install
```

### Running Locally
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## License & Attribution

Creative Commons Attribution: Sample video assets (Sintel, Big Buck Bunny, Tears of Steel, Elephants Dream) are provided by the Blender Foundation under Creative Commons license.

© 2026 VM Player. All rights reserved.
