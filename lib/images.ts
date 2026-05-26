export type GalleryItem = {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  /** Shown after the image vanishes. */
  revealQuote: string;
  revealAuthor: string;
};

export const galleryItems: GalleryItem[] = [
  {
    id: "mountains",
    title: "Mountain Solitude",
    subtitle: "Patagonia, Argentina",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    revealQuote:
      "The mountains are calling and I must go — but first, you had to tap them away.",
    revealAuthor: "after John Muir",
  },
  {
    id: "ocean",
    title: "Endless Blue",
    subtitle: "Pacific coastline",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    revealQuote:
      "The cure for anything is salt water — sweat, tears, or the sea.",
    revealAuthor: "Isak Dinesen",
  },
  {
    id: "forest",
    title: "Deep Woods",
    subtitle: "Pacific Northwest",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    revealQuote: "Into the forest I go, to lose my mind and find my soul.",
    revealAuthor: "after John Muir",
  },
  {
    id: "city",
    title: "Neon Pulse",
    subtitle: "Tokyo at midnight",
    src: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80",
    revealQuote:
      "The city was a brilliant blur — and then, with a final click, it was gone.",
    revealAuthor: "vanish gallery",
  },
  {
    id: "desert",
    title: "Golden Dunes",
    subtitle: "Sahara, Morocco",
    src: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1200&q=80",
    revealQuote:
      "What makes the desert beautiful is that somewhere it hides a well.",
    revealAuthor: "Antoine de Saint-Exupéry",
  },
  {
    id: "aurora",
    title: "Northern Lights",
    subtitle: "Tromsø, Norway",
    src: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=80",
    revealQuote:
      "The sky put on a show, and then quietly drew the curtain closed.",
    revealAuthor: "vanish gallery",
  },
];

export const VANISH_THRESHOLD = 10;
