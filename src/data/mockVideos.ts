import type { VideoItem, CommentItem } from '../types/media';

// Realistic sample subtitle tracks (WebVTT base64 data URIs for instant zero-dependency CC support)
const sampleEnglishVTT = `WEBVTT

00:00:01.000 --> 00:00:05.000
[VM Player Engine Initialized - High Definition Audio/Video Track]

00:00:06.000 --> 00:00:10.500
Experience studio-grade streaming playback with sub-second timeline seeking.

00:00:11.000 --> 00:00:16.000
Hold anywhere on screen or press Space to boost to 2.0x playback speed.

00:00:17.000 --> 00:00:22.000
Use J and L keys or double-click to seek backward and forward by 10 seconds.

00:00:23.000 --> 00:00:28.000
Adaptive bitrate ladder dynamically switches between 1080p, 720p, and 480p streams.
`;

const sampleVTTDataUri = `data:text/vtt;charset=utf-8,${encodeURIComponent(sampleEnglishVTT)}`;

// Helper to generate crisp SVG data URL thumbnails with unique broadcast themes
function createStudioThumbnail(title: string, subtitle: string, tag: string, accentColor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1D2332" stroke-width="1" stroke-opacity="0.6"/>
      </pattern>
    </defs>
    <rect width="640" height="360" fill="#0E121A"/>
    <rect width="640" height="360" fill="url(#grid)"/>
    <circle cx="560" cy="80" r="140" fill="${accentColor}" fill-opacity="0.12"/>
    <rect x="36" y="36" width="70" height="24" rx="4" fill="${accentColor}"/>
    <text x="71" y="52" fill="#FFFFFF" font-family="'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" text-anchor="middle" letter-spacing="1">${tag}</text>
    
    <text x="36" y="245" fill="#FFFFFF" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700">${title}</text>
    <text x="36" y="275" fill="#94A3B8" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="400">${subtitle}</text>
    
    <circle cx="560" cy="300" r="28" fill="#161B26" stroke="#232A3B" stroke-width="2"/>
    <polygon points="555,290 571,300 555,310" fill="${accentColor}"/>
    
    <!-- Codec / Spec Info -->
    <rect x="36" y="308" width="56" height="18" rx="2" fill="#1D2332"/>
    <text x="64" y="321" fill="#FFFFFF" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" text-anchor="middle">4K UHD</text>
    <rect x="100" y="308" width="60" height="18" rx="2" fill="#1D2332"/>
    <text x="130" y="321" fill="#94A3B8" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="500" text-anchor="middle">60 FPS</text>
    <rect x="168" y="308" width="68" height="18" rx="2" fill="#1D2332"/>
    <text x="202" y="321" fill="#94A3B8" font-family="'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="500" text-anchor="middle">AAC 320k</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'sintel-open-film',
    title: 'Sintel: The Open Cinema Odyssey (Official 4K Remaster)',
    description: 'Produced by Ton Roosendaal and the Blender Foundation, Sintel is an emotionally charged fantasy quest animated entirely with open-source 3D tools. This remaster is encoded in high-bitrate AV1/H.264 at full 60 frames per second with uncompressed dual-channel audio mastered for studio reference monitors.',
    sources: [
      {
        quality: '1080p',
        label: '1080p 60fps (High Bitrate)',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        fps: 60,
        bitrate: '8.4 Mbps',
      },
      {
        quality: '720p',
        label: '720p 60fps',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        fps: 60,
        bitrate: '4.2 Mbps',
      },
      {
        quality: '480p',
        label: '480p 30fps',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        fps: 30,
        bitrate: '1.8 Mbps',
      },
      {
        quality: '360p',
        label: '360p Data Saver',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        fps: 30,
        bitrate: '850 kbps',
      },
    ],
    thumbnail: createStudioThumbnail('Sintel: The Open Cinema Odyssey', 'Blender Foundation Animation Showcase', 'FEATURE FILM', '#E50914'),
    duration: 888,
    formattedDuration: '14:48',
    views: 421890,
    formattedViews: '421K views',
    uploadedAt: 'Nov 12, 2026',
    channel: {
      name: 'Blender Cinema Studios',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      subscribers: '1.48M subscribers',
      verified: true,
    },
    category: 'Cinema',
    tags: ['Animation', '4K', 'CGI', 'Blender', 'Cinema'],
    subtitles: [
      {
        id: 'en',
        label: 'English (Master CC)',
        srclang: 'en',
        src: sampleVTTDataUri,
        default: true,
      },
    ],
    likes: 38240,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'big-buck-bunny-uhd',
    title: 'Big Buck Bunny: Precision Physics & Fur Rendering Engine',
    description: 'A benchmark standard for video codec validation and high-motion rendering. Features rapid camera dollies, detailed particle interaction, and multi-threaded geometry acceleration. Perfect for evaluating video player buffering, seek responsiveness, and dropped-frame metrics.',
    sources: [
      {
        quality: '1080p',
        label: '1080p 60fps',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        fps: 60,
        bitrate: '9.1 Mbps',
      },
      {
        quality: '720p',
        label: '720p',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        fps: 60,
        bitrate: '4.8 Mbps',
      },
      {
        quality: '480p',
        label: '480p',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        fps: 30,
        bitrate: '2.1 Mbps',
      },
    ],
    thumbnail: createStudioThumbnail('Big Buck Bunny: Engine Benchmark', 'High-Motion Codec & Physics Stress Test', 'BENCHMARK', '#2563EB'),
    duration: 596,
    formattedDuration: '09:56',
    views: 1250420,
    formattedViews: '1.2M views',
    uploadedAt: 'Oct 28, 2026',
    channel: {
      name: 'Open Source Rendering Institute',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      subscribers: '890K subscribers',
      verified: true,
    },
    category: 'Animation',
    tags: ['Benchmark', 'Fur Dynamics', 'Vulkan', 'H.264'],
    subtitles: [
      {
        id: 'en',
        label: 'English CC',
        srclang: 'en',
        src: sampleVTTDataUri,
        default: true,
      },
    ],
    likes: 84120,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'tears-of-steel-scifi',
    title: 'Tears of Steel: VFX Tracking & Photoreal Compositing',
    description: 'Set in a dystopian Amsterdam, Tears of Steel demonstrates cutting-edge visual effects, motion-capture integration, planar tracking, and live-action mechanical compositing. Engineered to showcase wide dynamic color gamuts and dark gradient reproduction.',
    sources: [
      {
        quality: '1080p',
        label: '1080p Master',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        fps: 60,
        bitrate: '11.2 Mbps',
      },
      {
        quality: '720p',
        label: '720p',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        fps: 60,
        bitrate: '5.5 Mbps',
      },
      {
        quality: '480p',
        label: '480p',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        fps: 30,
        bitrate: '2.4 Mbps',
      },
    ],
    thumbnail: createStudioThumbnail('Tears of Steel: Sci-Fi Compositing', 'VFX Pipeline & Camera Motion Capture', 'SCI-FI VFX', '#10B981'),
    duration: 734,
    formattedDuration: '12:14',
    views: 639100,
    formattedViews: '639K views',
    uploadedAt: 'Sep 19, 2026',
    channel: {
      name: 'VFX Foundry Lab',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      subscribers: '512K subscribers',
      verified: true,
    },
    category: 'Sci-Fi',
    tags: ['Sci-Fi', 'VFX', 'Compositing', 'Dystopian', 'Action'],
    subtitles: [
      {
        id: 'en',
        label: 'English Audio Description',
        srclang: 'en',
        src: sampleVTTDataUri,
        default: true,
      },
    ],
    likes: 51200,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'elephants-dream-surreal',
    title: 'Elephants Dream: Mechanized Architecture & Soundscapes',
    description: 'The worlds first open movie production exploring industrial surrealism inside a colossal, infinitely recursive mechanical machine. Features rich spatial stereo acoustics and complex metallic ambient reverberation.',
    sources: [
      {
        quality: '1080p',
        label: '1080p HD',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        fps: 60,
        bitrate: '7.8 Mbps',
      },
      {
        quality: '720p',
        label: '720p',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        fps: 60,
        bitrate: '3.9 Mbps',
      },
      {
        quality: '480p',
        label: '480p',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        fps: 30,
        bitrate: '1.6 Mbps',
      },
    ],
    thumbnail: createStudioThumbnail('Elephants Dream: Surreal Architecture', 'Spatial Audio & Procedural Machinery', 'CLASSIC', '#F59E0B'),
    duration: 653,
    formattedDuration: '10:53',
    views: 310500,
    formattedViews: '310K views',
    uploadedAt: 'Aug 14, 2026',
    channel: {
      name: 'Orange Open Media',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      subscribers: '320K subscribers',
      verified: true,
    },
    category: 'Architecture',
    tags: ['Mechanics', 'Procedural', 'Architecture', 'Audio Design'],
    subtitles: [
      {
        id: 'en',
        label: 'English Subtitles',
        srclang: 'en',
        src: sampleVTTDataUri,
        default: true,
      },
    ],
    likes: 27900,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'for-bigger-blazes-nature',
    title: 'Kinetic High Speed Cinema: Volcanic Ignition in 4K',
    description: 'High-speed Phantom Flex 4K capture at 1000fps showing thermal expansion, liquid basalt, and rapid crystallisation. Mastered in wide gamut Rec.709 with high dynamic contrast for reference monitors.',
    sources: [
      {
        quality: '1080p',
        label: '1080p High Frame Rate',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        fps: 60,
        bitrate: '10.5 Mbps',
      },
      {
        quality: '720p',
        label: '720p',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        fps: 60,
        bitrate: '5.1 Mbps',
      },
    ],
    thumbnail: createStudioThumbnail('Kinetic High Speed: Thermal Ignition', 'Phantom 4K 1000 FPS Macro Photography', 'NATURE', '#EF4444'),
    duration: 15,
    formattedDuration: '00:15',
    views: 894000,
    formattedViews: '894K views',
    uploadedAt: 'Nov 01, 2026',
    channel: {
      name: 'Apex Cinema Research',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
      subscribers: '1.92M subscribers',
      verified: true,
    },
    category: 'Nature',
    tags: ['Nature', '4K High Speed', 'Thermodynamics', 'Cinema'],
    subtitles: [
      {
        id: 'en',
        label: 'English CC',
        srclang: 'en',
        src: sampleVTTDataUri,
        default: true,
      },
    ],
    likes: 74900,
    isLiked: false,
    isSaved: false,
  },
  {
    id: 'we-are-going-on-bullrun',
    title: 'High Velocity Aerodynamics: High-Speed Tracking in Monaco',
    description: 'Track-side telephoto capture of aerodynamic vortex generation, active downforce surfaces, and carbon-ceramic brake thermal signatures during high-g cornering.',
    sources: [
      {
        quality: '1080p',
        label: '1080p 60fps Track Master',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        fps: 60,
        bitrate: '9.8 Mbps',
      },
      {
        quality: '720p',
        label: '720p',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
        fps: 60,
        bitrate: '4.6 Mbps',
      },
    ],
    thumbnail: createStudioThumbnail('High Velocity Aerodynamics', 'Aerospace Telemetry & Thermal Signatures', 'MOTORSPORT', '#6366F1'),
    duration: 47,
    formattedDuration: '00:47',
    views: 512700,
    formattedViews: '512K views',
    uploadedAt: 'Oct 15, 2026',
    channel: {
      name: 'AeroVelocity Media',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      subscribers: '640K subscribers',
      verified: true,
    },
    category: 'Motorsport',
    tags: ['Motorsport', 'Aerodynamics', 'Telemetry', 'High Speed'],
    subtitles: [
      {
        id: 'en',
        label: 'English Commentary',
        srclang: 'en',
        src: sampleVTTDataUri,
        default: true,
      },
    ],
    likes: 42100,
    isLiked: false,
    isSaved: false,
  },
];

export const INITIAL_COMMENTS: Record<string, CommentItem[]> = {
  'sintel-open-film': [
    {
      id: 'c1',
      author: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces',
      content: 'The 10-second seek keys (J and L) and double-tap gestures on VM Player make analyzing specific keyframes and lighting transitions so responsive! Masterpiece animation.',
      timestamp: '2 days ago',
      likes: 142,
      isLiked: false,
    },
    {
      id: 'c2',
      author: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      content: 'Holding down to activate 2.0x playback speed and releasing it right when the dragon battle starts is a brilliant UI feature. The audio pitch stays perfectly crystal clear.',
      timestamp: '4 days ago',
      likes: 89,
      isLiked: false,
    },
    {
      id: 'c3',
      author: 'David Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      content: 'Clean high contrast dark mode without any eye-straining glow gradients. Studio quality playback right in the browser.',
      timestamp: '1 week ago',
      likes: 34,
      isLiked: false,
    },
  ],
  'big-buck-bunny-uhd': [
    {
      id: 'c4',
      author: 'TechDissect Lab',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
      content: 'Buffer health stats in Stats for Nerds confirms zero dropped frames on 1080p60 stream. Excellent hardware decoder pipeline.',
      timestamp: '3 days ago',
      likes: 65,
      isLiked: false,
    },
  ],
};
