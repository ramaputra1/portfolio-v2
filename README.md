# Rama Putra — Portfolio v2

Personal portfolio website built with Next.js 16, showcasing projects, skills, and contact information.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion, Lenis (smooth scroll) |
| Icons | Lucide React |
| 3D / Globe | react-globe.gl, Three.js |
| GitHub Stats | react-github-calendar |

## Project Structure

```
src/
├── app/              # Next.js App Router (layout, page, global styles)
├── components/
│   ├── navbar/       # Top navigation bar
│   ├── hero/         # Landing hero section
│   ├── about/        # About & skills section
│   ├── projects/     # Projects showcase
│   ├── github/       # GitHub activity calendar & globe
│   ├── contact/      # Contact form / info
│   └── ui/           # Shared UI primitives (Button, etc.)
├── data/             # Static data (skills, projects, etc.)
└── lib/              # Utility helpers (cn, etc.)
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Deployment

Deployed on [Netlify](https://www.netlify.com). Any push to the `main` branch triggers an automatic deployment.
