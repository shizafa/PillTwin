# PillTwin Landing Page: Design Spec

Paste this into the existing project and build the landing page from it. It describes layout and behavior only. Use the project's existing stack, components and colors where they exist.

## Audience and principles

- Main users are non-technical people in Pakistan, mostly on mobile data and mid-range phones.
- The page has one job: get the user to type a medicine name or scan the box.
- Minimal. Large type, lots of white space, one primary action, no jargon.
- Mobile first. Every desktop behavior below has a simpler mobile version.

## Page structure (top to bottom)

1. Navbar
2. Hero with looping video and search bar
3. Scroll stage: text reveal with orbiting medicine images
4. How it works (3 steps)
5. Footer

---

## 1. Navbar

- Very minimal, transparent over the hero, sticky.
- Left: PillTwin logo. Right: 2 or 3 links at most (How it works, About) and a language toggle (English / Urdu).
- On mobile: logo and a single menu icon.
- No border or shadow at the top of the page. Add a soft blur background only after the user scrolls.

## 2. Hero

- Full-width section with a **white background**.
- Background video: a **tablet (medicine tablet/pill) moving in a seamless loop**. Slow, calm motion.
  - The video background must be pure white (or exported with transparency) so no box edge shows.
  - Keep the file small: under 2-3 MB, MP4 + WebM, muted, loop, playsinline, with a static `poster` image.
  - On slow connections or `prefers-reduced-motion`, show the poster image only.
- Optional: the video shows the product idea, such as a medicine box being scanned and cheaper alternatives appearing.
- **Search bar** sits near the bottom center of the hero, over the video:
  - Large pill-shaped input, high contrast, at least 56px tall for easy tapping.
  - Placeholder: "Search your medicine name".
  - Camera icon button inside the right end of the bar. Tapping it opens the camera or image picker to scan the medicine box.
  - Search icon or Enter submits.
  - Subtle shadow so it reads clearly above the video.
- Small helper line under the bar (optional): "Type the name or scan the box".

## 3. Scroll stage (text reveal + orbiting medicine images)

Reference: the Skydive-style screenshots (ring of cards around centered text, then scattered cards, then word-by-word text reveal).

This is one pinned section. The section stays fixed on screen while scrolling drives the animation, then it releases.

**Content**
- Center text (2-3 lines), for example: "Find the same medicine for less. Scan any box and see cheaper alternatives with the same salt."
- Images: 12-16 cards of **different medicine tablets, strips, bottles and boxes**. Rounded corners (about 12px), soft shadow, slightly different sizes. Use real-looking product images with transparent or soft backgrounds.

**Scroll phases (all driven by scroll progress, scrubbed, not time-based)**

| Phase | Scroll progress | Behavior |
|---|---|---|
| A. Enter | 0-20% | Cards enter from the left and right edges at random positions and slide toward the center. Text is almost invisible (very low opacity, grey). |
| B. Text reveal | 10-60% | Text becomes visible **word by word** (or line by line) from faint grey to full color as the user scrolls, like the "They del|iver from day one" frame where half the sentence is bright and the rest is dim. |
| C. Orbit | 20-70% | Cards form a ring around the text and **rotate in circles** around it while scrolling. Ring is roughly an ellipse around the text block. The ring rotates a little more as the user scrolls further. |
| D. Scatter | 70-100% | The ring breaks apart. Cards move out to **different fixed positions** across the section (some overlapping slightly, different sizes, some smaller and dimmer for depth) and stop there. Text is fully visible. |
| E. Release | after 100% | Section unpins and the page continues scrolling. |

**Details**
- Each card has its own start position, end position and slight rotation so the motion feels organic, not mechanical.
- Cards in the ring should stay upright (counter-rotate against the ring rotation) so images never appear upside down.
- Final scatter positions are hand-defined (an array of x, y, scale, rotation per card), not random on each load, so the layout looks designed and stays consistent.
- Keep text readable at all times. Cards never cover the text in the ring or final phases.

**Mobile version**
- Use 6-8 cards instead of 12-16.
- Smaller ring, slower rotation, shorter scroll distance for the pin.
- Skip the full scatter. Cards settle in a simple arrangement above and below the text.

**Reduced motion**
- With `prefers-reduced-motion`, skip pinning and orbiting. Show the text fully visible with the cards in their final scattered positions.

## 4. How it works (3 sections)

Exactly three steps, in order. Each step has an image or simple illustration on one side and short text on the other. Alternate sides on desktop, stack on mobile.

1. **Search or scan.** Type the medicine name or scan the box with your camera.
2. **See alternatives.** We show other medicines with the same salt, with prices side by side.
3. **Check and decide.** See whether the medicine is registered and confirm with your pharmacist or doctor.

Each step: a short heading (max 5 words) and one or two plain sentences. No technical terms.

## 5. Footer

- Simple, calm, light background.
- Logo and one-line description.
- Links: How it works, About, Contact.
- Language toggle (English / Urdu).
- Safety note: "PillTwin is for information only. Always confirm with a pharmacist or doctor before changing any medicine."
- Copyright line.

---

## Visual style

- **Background:** white for the hero and light sections. The inspo screenshots use a dark background for the scroll stage; keep it white to match the hero unless you decide to go dark for that section.
- **Type:** one clean sans-serif family, large and legible. Hero and section headings 40-64px on desktop, 28-36px on mobile. Body at least 16px.
- **Color:** mostly neutral (white, soft grey, near-black text) with **one accent color** used for the search bar focus state, buttons and key highlights.
- **Corners and shadow:** rounded corners on the search bar, cards and buttons. Soft, low-contrast shadows.
- **Spacing:** generous. Large vertical gaps between sections.

## Motion rules

- Use scroll-linked animation for the scroll stage. Suggested tools: **GSAP ScrollTrigger** (best precise control, pinning and scrubbing) or **Framer Motion** `useScroll` / `useTransform` if the project is React/Next.js.
- Animate only `transform` and `opacity` so it stays smooth on cheap phones.
- Lazy-load card images, use WebP/AVIF, and size them to the displayed size.
- Easing: gentle and slow, no bouncing.

## Accessibility and performance

- Search input and camera button have labels and visible focus states.
- Touch targets at least 44px.
- Text contrast meets WCAG AA, including the faint-to-full text reveal at its end state.
- Urdu support: use a proper Urdu font and design the layout to flip to right-to-left without breaking.
- Camera permission: show a clear message if the user denies it, and offer an upload-photo fallback.

## Build checklist

- [ ] Navbar (transparent, sticky, mobile menu)
- [ ] Hero video with poster and reduced-motion fallback
- [ ] Search bar with camera button
- [ ] Scroll stage: pin, word reveal, orbit, scatter, release
- [ ] Mobile version of the scroll stage
- [ ] Three how-it-works steps
- [ ] Footer with safety note
- [ ] Urdu toggle and RTL check
- [ ] Performance pass (video size, image formats, lazy loading)