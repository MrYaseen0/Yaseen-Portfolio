# Yaseen Ahmad — Portfolio Website

> Full-Stack Developer | Software Engineering Student | Building production-grade SaaS applications with Next.js, TypeScript & React

## Overview

A **full-stack MERN portfolio website** built with React frontend + Express/MongoDB backend. Features a pink/cream/white/blue color theme, smooth animations, sub-page routing, a right-side navigation drawer, floating bubble animations, AI chatbot, hire request system, and admin dashboard.

**Live Frontend:** `http://localhost:5173`  
**API Server:** `http://localhost:5000`  
**Admin Dashboard:** `http://localhost:5173/admin`  
**Author:** Yaseen Ahmad ([@MrYaseen0](https://github.com/MrYaseen0))

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | Express.js 5 + Node.js |
| Database | MongoDB (Atlas + Compass) |
| ODM | Mongoose 9 |
| Routing | React Router DOM v7 |
| Animations | Framer Motion + CSS Keyframes |
| Icons | Lucide React + Custom SVG social icons |
| Fonts | Inter + Space Grotesk (Google Fonts) |
| Styling | Inline styles + CSS-in-JS |
| Concurrent | Concurrently (dev + production) |

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Cream | `#FFF9F5` | Page backgrounds |
| White | `#FFFFFF` | Cards, sections |
| Pink | `#E84393` | Primary accent, CTAs |
| Pink Light | `#FD79A8` | Gradients, hover states |
| Blue | `#6CB4EE` | Secondary accent |
| Blue Light | `#A8D8EA` | Gradients |
| Text Dark | `#1A1A2E` | Headings |
| Text Body | `#4A4A68` | Body text |
| Text Muted | `#9CA3AF` | Labels, captions |
| Border | `#F0E6DE` | Card borders |
| Border Pink | `#F8C8DC` | Hover borders |

---

## Project Structure

```
portfolio/
├── public/
│   └── assets/
│       ├── main-logo.png          # Main logo
│       ├── stamp-logo.png         # Stamp/favicon
│       ├── developer-pic.png      # Profile photo
│       └── logo-animated.gif      # Animated logo (navbar + favicon)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx             # Fixed header with dropdown + hamburger
│   │   ├── Drawer.jsx             # Right-side slide-out navigation drawer
│   │   ├── BubbleAnimation.jsx    # Floating social icon bubbles (4 drift patterns)
│   │   ├── Hero.jsx               # Landing hero section with bubbles
│   │   ├── About.jsx              # About section (home) with bubbles
│   │   ├── Services.jsx           # Services cards → links to sub-pages
│   │   ├── Projects.jsx           # Project grid → links to detail pages
│   │   ├── Skills.jsx             # Tech stack with animated bars + bubbles
│   │   ├── Contact.jsx            # Contact form + social links
│   │   ├── Footer.jsx             # Footer with links
│   │   └── SocialIcons.jsx        # Custom SVG icons (GitHub, LinkedIn, Instagram, Facebook, TikTok)
│   ├── pages/
│   │   ├── AboutUs.jsx            # Full about page with bubbles + timeline + social links
│   │   ├── ProjectDetail.jsx      # Individual project detail page with bubbles
│   │   ├── WebDevelopment.jsx     # Service sub-page
│   │   ├── MobileDevelopment.jsx  # Service sub-page
│   │   ├── BackendEngineering.jsx # Service sub-page
│   │   ├── DatabaseDesign.jsx     # Service sub-page
│   │   ├── UIDesign.jsx           # Service sub-page
│   │   └── SaaSArchitecture.jsx   # Service sub-page
│   ├── App.jsx                    # Router + layout
│   ├── App.css
│   ├── index.css                  # Global styles + CSS variables
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

---

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Home | Hero, About, Services, Projects, Skills, Contact |
| `/about` | About Us | Full profile with bubble animations, timeline, social links |
| `/projects/:slug` | Project Detail | Full project info, features, GitHub link |
| `/services/web-development` | Web Dev | Capabilities + tech stack |
| `/services/mobile-development` | Mobile Dev | Capabilities + tech stack |
| `/services/backend-engineering` | Backend | Capabilities + tech stack |
| `/services/database-design` | Database | Capabilities + tech stack |
| `/services/ui-design` | UI/UX | Capabilities + tech stack |
| `/services/saas-architecture` | SaaS | Capabilities + tech stack |

---

## Features

### Navigation
- **Fixed Navbar** — Blurs on scroll, animated logo, Services dropdown, hamburger button
- **Right-Side Drawer** — Slide-out from RIGHT with backdrop blur, nav links, services, social icons
- **Mobile** — Hamburger menu opens right-side drawer

### Animations (Framer Motion + CSS Keyframes)
- Scroll-triggered fade-in/slide on all sections
- Staggered card entrance animations
- Animated progress bars (skills)
- Floating badge bounce on hero
- **Bubble Animations** — 4 different drift patterns with random social icons (GitHub, LinkedIn, Instagram, Facebook, Mail, Phone, MapPin, Globe, Code2, Heart)
  - Hero section: 22 bubbles
  - About section: 16 bubbles
  - Skills section: 14 bubbles
  - About Us page: 20 bubbles
  - Project Detail pages: 12 bubbles
- Dashed ring rotation around profile image
- Hover lift + glow effects on all interactive elements

### Pages
- **Home** — Hero with profile pic, stats, services grid, project cards, skills bars, contact form, bubbles
- **About Us** — Full profile, highlights, bio, timeline, social links with bubble animation background
- **Project Detail** — Gradient banner, meta info (stars/forks/language), features list, other projects, bubbles
- **Service Pages** — Hero, capabilities checklist, animated tech stack bars

### Social Links Integrated
- GitHub: `github.com/MrYaseen0`
- LinkedIn: `linkedin.com/in/yaseen-ahmad-489967280`
- Instagram: `@yaseenahmadexe`
- Facebook: `facebook.com/share/1HN9vegPhd/`
- TikTok: `@mryaseen.exe`

---

## Getting Started

### Full Stack (Recommended)

```bash
cd "C:\Yaseen Portfolio\portfolio"
npm install

# Start both frontend + backend
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

### Frontend Only

```bash
npm run dev:client
```

### Backend Only

```bash
npm run dev:server
```

### MongoDB Setup

1. **Local (MongoDB Compass):**  
   Edit `server/.env` → `MONGODB_URI=mongodb://localhost:27017/portfolio`

2. **Cloud (MongoDB Atlas):**  
   Edit `server/.env` → `MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`

### Production Build

```bash
npm run build
npm run start
```

---

## Backend API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact` | Get all messages (admin) |
| PATCH | `/api/contact/:id/read` | Mark message as read |
| DELETE | `/api/contact/:id` | Delete message |
| POST | `/api/hire` | Submit hire request |
| GET | `/api/hire` | Get all hire requests (admin) |
| PATCH | `/api/hire/:id/status` | Update request status |
| DELETE | `/api/hire/:id` | Delete hire request |
| POST | `/api/stats/visit` | Record page visit |
| GET | `/api/stats` | Get portfolio stats |
| GET | `/api/admin/dashboard` | Combined dashboard data |
| GET | `/api/health` | Health check |

---

## Admin Dashboard

Access at `http://localhost:5173/admin`:
- **Overview** — View all contact messages with read/unread status
- **Hire Requests** — See project requests with service, budget, timeline, status
- **Visitors** — Recent visitor IPs, pages visited, timestamps
- **Stats** — Total visitors, messages, hires, unread counts

---

## Assets

| File | Location | Usage |
|------|----------|-------|
| `logo of website.gif` | `C:\Yaseen Portfolio\logo of web\` | Animated logo → `public/assets/logo-animated.gif` |
| `Main Logo.png` | `C:\Yaseen Portfolio\logo of web\` | Static logo → `public/assets/main-logo.png` |
| `Background logo.png` | `C:\Yaseen Portfolio\logo of web\stamp logo\` | Stamp → `public/assets/stamp-logo.png` |
| `yaseenahmad developer.png` | `C:\Yaseen Portfolio\pics\developer pic\` | Profile pic → `public/assets/developer-pic.png` |

---

## Design Principles

1. **Premium Feel** — Soft shadows, rounded corners, subtle gradients
2. **Consistency** — Same pink/cream/white/blue color palette across all pages
3. **Motion** — Every element has entrance/hover animations + floating bubbles
4. **Responsive** — Mobile-first grid layouts
5. **Accessible** — Proper contrast, semantic HTML, focus states
6. **Performance** — Lazy animations, optimized builds
7. **Full-Stack** — MERN stack with real database, not just a static site

---

## WhatsApp Integration

A floating WhatsApp contact button appears on all pages after 2 seconds:
- **Button:** Green circle with WhatsApp logo, positioned bottom-right
- **Chat popup:** Clicking opens a mini chat window with a greeting message
- **Direct link:** Opens `https://wa.me/923189370042` with pre-filled message
- **Component:** `src/components/WhatsAppButton.jsx`

---

## YI ChatBot

A cute, animated AI assistant named **YI** that guides visitors without any API:
- **Design:** Pink theme, custom SVG mascot with bouncing antenna, blush cheeks, heart
- **Animations:** Pulse ring on FAB, floating hearts, typing indicator, message slide-in
- **Intelligence:** Local keyword-matching — handles greetings, about Yaseen, services, projects, contact, skills, pricing, socials, jokes, availability, and more
- **Quick Replies:** Pre-built buttons for common questions
- **Responsive:** Full-screen on mobile, compact window on desktop
- **Component:** `src/components/ChatBot.jsx`

---

## Hire Me Modal

A 3-step project request form accessible from the "Hire Me" navbar button:
- **Step 1:** Name, email, phone, company
- **Step 2:** Service selection, budget range, timeline
- **Step 3:** Project description + submit
- Saves to MongoDB via `/api/hire`
- Component: `src/components/HireModal.jsx`
