export interface SceneConfig {
  id: string;
  name: string;
  folder: string;
  startFrame: number;
  endFrame: number;
  frameCount: number;
  timelineStart: number;
  timelineEnd: number;
  cameraMovement: string;
  description: string;
}

export interface TimelineView {
  index: number;
  progress: number;
  name: string;
  sceneId: string;
}

export interface CelebrationEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  isoDateStart: string;
  isoDateEnd: string;
  time: string;
  venue: string;
  mapUrl: string;
  note?: string;
  themeAccent: string;
  badge: string;
}

export const SCENES: SceneConfig[] = [
  {
    id: "aerial",
    name: "Aerial Mahal Approach",
    folder: "/assets/frames/aerial/",
    startFrame: 1,
    endFrame: 180,
    frameCount: 180,
    timelineStart: 0,
    timelineEnd: 0.12,
    cameraMovement: "Descends towards grand palace entrance",
    description: "Bird's-eye view descending over gardens, pathways, and architecture toward the central gate"
  },
  {
    id: "gate",
    name: "The Royal Gate",
    folder: "/assets/frames/gate/",
    startFrame: 1,
    endFrame: 240,
    frameCount: 240,
    timelineStart: 0.12,
    timelineEnd: 0.23,
    cameraMovement: "Grand gate approaches, opens, and camera enters",
    description: "Carved wooden doors open gently, revealing palace interior light as camera glides through"
  },
  {
    id: "haldi-to-sangeet",
    name: "Haldi to Sangeet Darbar",
    folder: "/assets/frames/haldi-to-sangeet/",
    startFrame: 1,
    endFrame: 240,
    frameCount: 240,
    timelineStart: 0.23,
    timelineEnd: 0.38,
    cameraMovement: "Forward → Gradual Right Turn → Curtains Part → Sangeet Revealed",
    description: "Camera passes joyful Haldi courtyard, turns right under the arch, burgundy curtains part into Sangeet Darbar"
  },
  {
    id: "sangeet-to-wedding",
    name: "Sangeet to Wedding Mandap",
    folder: "/assets/frames/sangeet-to-wedding/",
    startFrame: 1,
    endFrame: 240,
    frameCount: 240,
    timelineStart: 0.38,
    timelineEnd: 0.52,
    cameraMovement: "Forward → Gradual Left Turn → Towards the Palace Hallway",
    description: "Gliding forward from Sangeet hall, turning smoothly left through archway towards the grand wedding corridor"
  },
  {
    id: "wedding-hallway",
    name: "The Royal Wedding Hallway",
    folder: "/assets/frames/Wedding%20hallway/",
    startFrame: 1,
    endFrame: 138,
    frameCount: 138,
    timelineStart: 0.52,
    timelineEnd: 0.64,
    cameraMovement: "Gliding through candlelit palace corridor to Sacred Mandap",
    description: "Camera glides gracefully down the royal wedding hallway lined with royal chandeliers and golden arches"
  },
  {
    id: "wedding-to-reception",
    name: "Wedding to Reception Gala",
    folder: "/assets/frames/wedding-to-reception/",
    startFrame: 1,
    endFrame: 240,
    frameCount: 240,
    timelineStart: 0.64,
    timelineEnd: 0.8,
    cameraMovement: "Forward → Gradual Right Turn → Sunset to Dusk to Grand Reception",
    description: "Past the sacred mandap, turning right as daylight warms into sunset, dusk, and the illuminated Reception"
  },
  {
    id: "finale",
    name: "The Celestial Finale",
    folder: "/assets/frames/finale/",
    startFrame: 1,
    endFrame: 240,
    frameCount: 240,
    timelineStart: 0.8,
    timelineEnd: 1,
    cameraMovement: "Forward through atmospheric particles to locked emblem",
    description: "Quiet palace atmosphere, floating rose petals resolving into the master locked NK insignia"
  }
];

export const TIMELINE_VIEWS: TimelineView[] = [
  { index: 0, progress: 0, name: "Aerial Mahal Approach", sceneId: "aerial" },
  { index: 1, progress: 0.12, name: "The Royal Gate", sceneId: "gate" },
  { index: 2, progress: 0.23, name: "The Palace Entrance & Haldi", sceneId: "haldi" },
  { index: 3, progress: 0.38, name: "Sangeet Darbar", sceneId: "sangeet" },
  { index: 4, progress: 0.52, name: "The Royal Hallway & Wedding", sceneId: "wedding" },
  { index: 5, progress: 0.64, name: "Sacred Mandap & Feast", sceneId: "mandap" },
  { index: 6, progress: 0.8, name: "Grand Reception Gala", sceneId: "reception" },
  { index: 7, progress: 1.0, name: "The Celestial Finale", sceneId: "finale" }
];

export const CELEBRATION_EVENTS: CelebrationEvent[] = [
  {
    id: "haldi",
    title: "HALDI CARNIVAL",
    subtitle: "Where colours meet music and joy fills the air",
    date: "Sunday, 18 October 2026",
    isoDateStart: "20261018T040000Z",
    isoDateEnd: "20261018T063000Z",
    time: "9:30 AM onwards",
    venue: "The Primo by Maan & Salwa, Ambli Road, Nr. Kalibari Temple, Rajpat, Ahmedabad",
    mapUrl: "https://maps.app.goo.gl/rtibd9T4wfgAoWbs6",
    note: "Followed by Lunch",
    themeAccent: "border-haldi-coral/50 text-haldi-coral",
    badge: "Carnival of Colours"
  },
  {
    id: "mehndi",
    title: "MEHNDI",
    subtitle: "Intricate Henna & Melodies",
    date: "Sunday, 18 October 2026",
    isoDateStart: "20261018T063000Z",
    isoDateEnd: "20261018T093000Z",
    time: "12:00 PM — 03:00 PM",
    venue: "The Primo by Maan & Salwa, Ambli Road, Nr. Kalibari Temple, Rajpat, Ahmedabad",
    mapUrl: "https://maps.app.goo.gl/rtibd9T4wfgAoWbs6",
    themeAccent: "border-emerald-500/50 text-emerald-400",
    badge: "Mehndi Mehfil"
  },
  {
    id: "sangeet",
    title: "SANGEET",
    subtitle: "Where colours meet music and joy fills the air",
    date: "Sunday, 18 October 2026",
    isoDateStart: "20261018T130000Z",
    isoDateEnd: "20261018T183000Z",
    time: "6:30 PM onwards",
    venue: "The Primo by Maan & Salwa, Ambli Road, Nr. Kalibari Temple, Rajpat, Ahmedabad",
    mapUrl: "https://maps.app.goo.gl/rtibd9T4wfgAoWbs6",
    note: "Followed by Dinner",
    themeAccent: "border-sangeet-powderBlue/50 text-sangeet-powderBlue",
    badge: "Night of Stars"
  },
  {
    id: "wedding",
    title: "THE SACRED WEDDING",
    subtitle: "Ganesh Sthapan, Vivah Sanskar & Sacred Pheras",
    date: "Tuesday, 20 October 2026",
    isoDateStart: "20261020T033000Z",
    isoDateEnd: "20261020T093000Z",
    time: "9:00 AM Grah Shanti • 12:40 PM Hast Melap",
    venue: "Shri Swaminarayan Gurukul, Behind Ambica Pipes, N.H. 8, Vaghasi, Dis. Anand",
    mapUrl: "https://maps.app.goo.gl/TWerfBVXVJGyiVGR6",
    note: "Followed by Wedding Lunch (12:45 PM)",
    themeAccent: "border-gold/60 text-gold",
    badge: "The Sacred Vows"
  },
  {
    id: "reception",
    title: "THE RECEPTION GALA",
    subtitle: "A new beginning, a beautiful union and many reasons to celebrate",
    date: "Wednesday, 21 October 2026",
    isoDateStart: "20261021T130000Z",
    isoDateEnd: "20261021T183000Z",
    time: "6:30 PM onwards",
    venue: "The Gravity Greens Party Lawn, Behind Vinay Kamlesh Gurukul, Rancharda, Ahmedabad",
    mapUrl: "https://maps.app.goo.gl/ktUswsu33Fu1Scyv8",
    note: "Followed by Dinner",
    themeAccent: "border-reception-lilac/60 text-reception-lilac",
    badge: "Grand Finale"
  }
];

