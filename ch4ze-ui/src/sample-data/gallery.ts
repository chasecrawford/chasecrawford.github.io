export interface GalleryFrame {
  src: string;
  label: string;
  id: string;
  hue: string;
}

export const GALLERY_FRAMES: GalleryFrame[] = [
  {
    id: '01',
    label: "XMAS '25",
    src: 'https://chasecrawford.dev/images/xmas-25.jpg',
    hue: '315deg',
  },
  {
    id: '02',
    label: "HALLOWEEN '25",
    src: 'https://chasecrawford.dev/images/halloween-25.jpg',
    hue: '107deg',
  },
  {
    id: '03',
    label: "NOX '25",
    src: 'https://chasecrawford.dev/images/nox-25.jpg',
    hue: '287deg',
  },
  {
    id: '04',
    label: "LILO '25",
    src: 'https://chasecrawford.dev/images/lilo-25.jpg',
    hue: '15deg',
  },
];
