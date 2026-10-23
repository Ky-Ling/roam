// Remote placeholder photos (Unsplash) until real property imagery exists.
// Titles break by hand to keep the design's line shape across widths.
// focus: which side of the landscape photo stays visible in the portrait crop.
export const SLIDES = [
  {
    key: "story",
    location: "Whistler, BC",
    title: "Find a stay that\nfits your story",
    body: "From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip.",
    image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=2400&q=85&auto=format",
    focus: "left",
  },
  {
    key: "describe",
    location: "Lake Braies, IT",
    title: "Describe it in\none sentence",
    body: "Quiet, pet friendly, hot tub, under $300 a night. Tell roam what you want and get stays ranked for you.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=2400&q=85&auto=format",
    focus: "right",
  },
  {
    key: "answers",
    location: "Ubud, Bali",
    title: "Answers from\nthe source",
    body: "Ask about check-in, pets or cancellations and see the stay's own policy text, word for word.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=2400&q=85&auto=format",
    focus: "center",
  },
] as const

export type Slide = (typeof SLIDES)[number]
