# Coin Laundry @ Walnut: website demo

Demo website for Coin Laundry @ Walnut (Lavandería), 9751 Walnut St, Ste 130, Dallas, TX 75243.

- Single static page: `index.html` + `images/`
- English / Spanish toggle (`?lang=es`), light / dark mode
- Facts from public listings and owner photos. Weekend hours and prices still to confirm.

## Run locally

```
python -m http.server 5510
```

Then open http://localhost:5510

## Stack
- **Next.js** (static export) + **TypeScript** + **Tailwind CSS v4**
- **Magic UI** (Marquee, MagicCard, BorderBeam), **Motion**, **GSAP**, **Lenis** smooth scroll, **Phosphor** icons
- Strings live in `src/content/strings.json` (English plus each translation); the page is `src/app/page.tsx`

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
```
Pushing to `main` builds and deploys to GitHub Pages (`.github/workflows/pages.yml`).
