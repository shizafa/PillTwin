// Hand-defined per DESIGN.md: "Final scatter positions are hand-defined ...
// not random on each load, so the layout looks designed and stays consistent."
// enter: where the card starts, off to one side, before sliding toward center.
// finalScatter: where it settles once the ring breaks apart.
export const DESKTOP_CARDS = [
  { id: 1, image: "/images/1.jpg", enter: { x: -620, y: -40 }, finalScatter: { x: -460, y: -220, scale: 0.85, rotate: -8 } },
  { id: 2, image: "/images/2.jpg", enter: { x: 640, y: 20 }, finalScatter: { x: 480, y: -200, scale: 1, rotate: 10 } },
  { id: 3, image: "/images/3.jpg", enter: { x: -560, y: 120 }, finalScatter: { x: -560, y: -40, scale: 0.9, rotate: 6 } },
  { id: 4, image: "/images/4.jpg", enter: { x: 580, y: -120 }, finalScatter: { x: 540, y: 30, scale: 0.8, rotate: -12 } },
  { id: 5, image: "/images/5.jpg", enter: { x: -500, y: -200 }, finalScatter: { x: -380, y: 180, scale: 1, rotate: 14 } },
  { id: 6, image: "/images/6.jpg", enter: { x: 520, y: 180 }, finalScatter: { x: 400, y: 220, scale: 0.85, rotate: -6 } },
  { id: 7, image: "/images/7.jpg", enter: { x: -660, y: 60 }, finalScatter: { x: -180, y: -280, scale: 0.75, rotate: 4 } },
  { id: 8, image: "/images/8.jpg", enter: { x: 660, y: -40 }, finalScatter: { x: 160, y: -300, scale: 0.8, rotate: -10 } },
  { id: 9, image: "/images/9.jpg", enter: { x: -480, y: 220 }, finalScatter: { x: -120, y: 300, scale: 0.9, rotate: -14 } },
  { id: 10, image: "/images/10.jpg", enter: { x: 500, y: -220 }, finalScatter: { x: 140, y: 290, scale: 0.95, rotate: 8 } },
  { id: 11, image: "/images/11.jpg", enter: { x: -600, y: -140 }, finalScatter: { x: -620, y: 160, scale: 0.7, rotate: 10 } },
  { id: 12, image: "/images/12.jpg", enter: { x: 600, y: 120 }, finalScatter: { x: 620, y: -150, scale: 0.75, rotate: -8 } },
  { id: 13, image: "/images/13.jpg", enter: { x: -440, y: -80 }, finalScatter: { x: -300, y: -40, scale: 0.65, rotate: 6 } },
];

export const MOBILE_CARDS = DESKTOP_CARDS.slice(0, 8);
