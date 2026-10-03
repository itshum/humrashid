// Stand-in photos for the Inspiration page: nature shots from Unsplash,
// linked by id until real travel photos replace them. An entry with one
// image is a single print; with several it is a stack. Every entry is
// either landscape (3:2) or portrait (4:5), and all of its images are
// cropped to that shape.

export type Orientation = "landscape" | "portrait";

// What an iPhone writes into a photo, which is what the detail page shows.
// These values are samples until the real photos (and their EXIF) arrive.
export interface Exif {
  camera: string;
  lens: string;
  focal: string;
  aperture: string;
  shutter: string;
  iso: number;
  date: string; // ISO date
}

export interface Frame {
  src: string;
  exif: Exif;
}

export interface Print {
  id: string;
  label: string;
  orientation: Orientation;
  // The first frame is the one on top of a stack.
  frames: Frame[];
}

const SIZE: Record<Orientation, { w: number; h: number }> = {
  landscape: { w: 720, h: 480 },
  portrait: { w: 560, h: 700 },
};

function photo(id: string, orientation: Orientation) {
  const { w, h } = SIZE[orientation];
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=70&auto=format`;
}

const LENSES = [
  { lens: "Main camera, 24 mm", focal: "24 mm", aperture: "ƒ/1.78" },
  { lens: "Ultra Wide, 13 mm", focal: "13 mm", aperture: "ƒ/2.2" },
  { lens: "Telephoto, 77 mm", focal: "77 mm", aperture: "ƒ/2.8" },
];
const SHUTTERS = ["1/60", "1/125", "1/250", "1/500", "1/1000", "1/2000"];
const ISOS = [32, 40, 50, 64, 80, 125, 200, 320];

// Sample EXIF, varied but stable from one load to the next.
let counter = 0;
function sampleExif(): Exif {
  const n = counter++;
  const lens = LENSES[(n * 5) % LENSES.length];
  const day = new Date(Date.UTC(2025, 8, 20) - n * 6 * 86400000);
  return {
    camera: "iPhone 15 Pro",
    lens: lens.lens,
    focal: lens.focal,
    aperture: lens.aperture,
    shutter: SHUTTERS[(n * 7) % SHUTTERS.length],
    iso: ISOS[(n * 3) % ISOS.length],
    date: day.toISOString().slice(0, 10),
  };
}

const make = (id: string, label: string, orientation: Orientation, ids: string[]): Print => ({
  id,
  label,
  orientation,
  frames: ids.map((i) => ({ src: photo(i, orientation), exif: sampleExif() })),
});

export const prints: Print[] = [
  make("woods", "Into the woods", "portrait", [
    "1448375240586-882707db888b",
    "1523712999610-f77fbcfc3843",
    "1518495973542-4542c06a5843",
    "1482192596544-9eb780fc7f66",
    "1510797215324-95aa89f43c33",
  ]),
  make("braies", "Braies lake", "landscape", ["1476514525535-07fb3b4ae5f1"]),
  make("kingfisher", "Kingfisher", "portrait", ["1444464666168-49d633b86797"]),
  make("poppies", "Poppies", "landscape", ["1465146344425-f00d5f5c8f07"]),
  make("highcountry", "High country", "portrait", [
    "1454496522488-7a8e488e8606",
    "1505765050516-f72dcac9c60e",
    "1519681393784-d120267933ba",
    "1464822759023-fed622ff2c3b",
    "1470071459604-3b5ec3a7fe05",
    "1506744038136-46273834b3fb",
  ]),
  make("tall", "Looking up", "portrait", ["1513836279014-a89f7a76ae86"]),
  make("hills", "Green hills", "landscape", ["1501854140801-50d01698950b"]),
  make("seasky", "Sea and sky", "landscape", [
    "1507525428034-b723cf961d3e",
    "1497290756760-23ac55edf36f",
    "1490730141103-6cac27aaab94",
    "1494548162494-384bba4ab999",
  ]),
  make("falls", "Waterfall", "portrait", ["1433086966358-54859d0ed716"]),
  make("valley", "Valley sunset", "landscape", ["1472214103451-9374bd1c798e"]),
  make("desert", "Desert road", "landscape", [
    "1500530855697-b586d89ba3ee",
    "1509316785289-025f5b846b35",
    "1470252649378-9c29740c9fa8",
  ]),
  make("oak", "The old oak", "portrait", ["1502082553048-f009c37129b9"]),
  make("lowtide", "Low tide", "landscape", ["1475924156734-496f6cac6ec1"]),
  make("path", "Forest path", "portrait", ["1441974231531-c6227db76b6e"]),
  make("turquoise", "Turquoise", "landscape", ["1501785888041-af3ef285b470"]),
  make("fog", "Morning fog", "portrait", ["1418065460487-3e41a6c84dc5"]),
];
