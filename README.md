# Caffè Bellissimo

A polished, front-end experience for a premium Italian dining and delivery service. Caffè Bellissimo lets guests browse a curated menu, personalise dishes, manage a dining bag, place an order, follow delivery progress, and explore loyalty perks—all inside a responsive dark-mode dashboard.

## Live demo

[Explore Caffè Bellissimo](https://bellissimo-artisanal-dining.ai.studio/)

## Highlights

- Browse gourmet pizzas, burgers, pastas, sides, drinks, and desserts
- Search the menu and toggle between INR and USD pricing
- Customise dishes with crusts, add-ons, pairings, and cooking notes
- Manage quantities in a slide-out dining bag and complete a simulated checkout
- View a live delivery-tracking experience, courier details, and order hand-off PIN
- Reorder from order history and redeem Bellissimo Club rewards
- Manage saved delivery addresses and dining preferences
- Use built-in concierge/chat and voice-assistant interfaces
- Enjoy a responsive, luxury-inspired interface built with Tailwind CSS and Motion

> **Note:** This is a client-side demonstration app. Products, orders, delivery updates, payments, rewards, and assistant interactions use local mock data and are not connected to production services.

## Tech stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Motion](https://motion.dev/)
- [Lucide React](https://lucide.dev/)

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm

### Install and run

```bash
git clone https://github.com/harish2008-pc/crave-co.git
cd crave-co
npm install
npm run dev
```

Open the local URL shown by Vite (normally [http://localhost:3000](http://localhost:3000)).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server on port 3000. |
| `npm run build` | Creates a production build in `dist/`. |
| `npm run preview` | Previews the production build locally. |
| `npm run lint` | Runs TypeScript type checking without emitting files. |
| `npm run clean` | Removes generated build files. |

## Project structure

```text
src/
├── assets/          # Local imagery
├── components/      # Screens, dashboard elements, drawers, and modals
├── data/            # Menu, order, address, reward, and payment mock data
├── App.tsx          # App state, navigation, and interaction wiring
├── main.tsx         # React entry point
├── types.ts         # Shared TypeScript models
└── index.css        # Tailwind theme and global styling
```

## Configuration

The included [`.env.example`](.env.example) documents environment values that may be needed when integrating external services. No secret is required to run the current front-end demo.

```bash
cp .env.example .env
```

Never commit your `.env` file or real API keys.

## Development notes

- App state is intentionally held in React state for a self-contained demo.
- Menu items, active orders, reward inventory, saved addresses, packaging options, and payment cards are defined in `src/data/mockData.ts`.
- The app uses a dark luxury visual theme by default; the preferences interface exposes theme selection for future persistence integration.
