# Pokemon Team Builder & Pokedex

## Overview

This project is a **Pokemon Team Builder and Pokedex Application** built using **Next.js 14+**, **TypeScript**, **Tailwind CSS**, and **Zustand**. The app allows users to explore Pokémon, build custom teams, and analyze Pokémon statistics.

## Features

### 1. **Pokemon Explorer (Pokedex)**

- Display a grid of Pokémon with infinite scroll or pagination
- Server-side rendering for initial data load
- Client-side data fetching for subsequent requests
- Advanced filtering system (by type, generation, stats)

### 2. **Search Functionality**

- Debounced search input
- Dynamic search results with loading states
- Filtering by type, abilities, and stats
- Proper error handling for API requests

### 3. **Pokemon Detail View**

- Dynamic routing for individual Pokémon pages
- Displays:
  - Base stats with visual representation
  - Evolution chain
  - Moves and abilities
  - Type effectiveness
- Loading and error states management

### 4. **Team Builder**

- Create and save Pokémon teams
- Team analysis (type coverage, weaknesses)
- Team saving (local storage or database)
- Drag-and-drop interface for team management

### 5. **Compare Feature**

- Side-by-side comparison of Pokémon
- Stat comparison charts
- Type effectiveness analysis
- Move pool analysis

## Tech Stack

- **Next.js 14+ (App Router)** - Framework for React applications
- **TypeScript** - Strongly typed JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - State management
- **TanStack Query (React Query) / SWR** - API management
- **NextAuth.js** *(Optional)* - Authentication for user-specific teams

## API Integration

This project uses the [**PokeAPI**](https://pokeapi.co/), which is:

- Free to use
- No authentication required
- Provides extensive Pokémon data

## Installation & Setup

### 1. **Clone the repository**

```bash
git clone https://github.com/YOUR_GITHUB_USERNAME/pokemon.git
cd project
```

### 2. **Install dependencies**

```bash
yarn install  # or npm install
```

### 3. **Run the development server**

```bash
yarn dev  # or npm run dev
```

The app will be available at `http://localhost:3000`.

### 4. **Build for production**

```bash
yarn build && yarn start
```

##you can also see the live demo here:https://ubiquitous-melba-dfc01d.netlify.app/
## Project Structure

```
📦 pokemon-team-builder
├── 📂 src
│   ├── 📂 components    # Reusable UI components
│   ├── 📂 pages         # App Router-based pages
│   ├── 📂 hooks         # Custom hooks
│   ├── 📂 stores        # Zustand state management
│   ├── 📂 utils         # Utility functions
│   ├── 📂 styles        # Global styles
├── 📄 next.config.js    # Next.js configuration
├── 📄 tailwind.config.js # Tailwind CSS configuration
├── 📄 tsconfig.json     # TypeScript configuration
├── 📄 package.json      # Dependencies & scripts
└── 📄 README.md         # Documentation
```

## Deployment

To deploy the application:

```bash
yarn build
```

Then deploy using **Vercel**, **Netlify**, or **Docker**.

## Development Decisions

- Used **SSR for initial data load** to improve performance.
- **Zustand** for efficient state management.
- **React Query** for caching and API management.
- **Tailwind CSS** for fast UI development.
- **NextAuth.js** (if implemented) for user authentication.

## Challenges & Solutions

- **Optimizing API requests:** Used caching and pagination.
- **Handling large datasets:** Implemented infinite scroll.
- **Ensuring type safety:** Used strict TypeScript types.

## Future Improvements

- Enhance UI animations.
- Add user authentication for saving teams.
- Implement offline support.

## License

This project is open-source under the **MIT License**.

---

*Built with ❤️ using Next.js, TypeScript, and PokeAPI.*

