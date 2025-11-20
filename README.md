# Trippy - Trip Places Suggestion

A modern Next.js 16 application for discovering amazing places for your next trip based on location, budget, and interests.

## Features

- 🗺️ Google Maps integration with interactive markers
- 🎨 Beautiful dark/light mode with custom blue theme
- 📍 Location search with Google Places autocomplete
- 📱 Current location detection
- 💰 Budget-based filtering
- 🏷️ 10 place categories to choose from
- 🔗 Shareable search results (URL state management)
- ⚡ Built with Next.js 16 + Tailwind v4
- 🎯 Modern, clean UI with shadcn/ui components

## Tech Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4**
- **TypeScript** (strict mode)
- **TanStack Query** (server state)
- **nuqs** (URL state management)
- **Google Maps API**
- **shadcn/ui** (UI components)
- **Bun** (package manager)

## Getting Started

### Prerequisites

1. Node.js 18+ or Bun installed
2. Google Maps API key with the following APIs enabled:
   - Maps JavaScript API
   - Places API
   - Geocoding API

Get your API key from [Google Cloud Console](https://console.cloud.google.com/apis/library).

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   bun install
   ```

3. Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. Run the development server:

   ```bash
   bun run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
bun run build
bun run start
```

## Usage

1. **Search for a Location**: Enter a destination or use your current location
2. **Set Your Budget**: Specify your budget to filter places by price range
3. **Select Categories**: Choose from 10 categories (hotels, restaurants, parks, etc.)
4. **Explore Results**: View places on a map and in a list with detailed information
5. **Share**: Copy the URL to share your search results with others

## Place Categories

- Hotels & Accommodations
- Restaurants & Eateries
- Cafes & Coffee Shops
- Bars & Nightlife
- Parks & Recreation
- Museums & Culture
- Shopping & Malls
- Entertainment & Events
- Landmarks & Attractions
- Gyms & Fitness

## Customization

### Changing the Primary Color

Edit the `--primary` CSS variable in `app/globals.css`:

```css
:root {
  --primary: oklch(0.55 0.21 250); /* Change this value */
}

.dark {
  --primary: oklch(0.65 0.21 250); /* And this for dark mode */
}
```

## Project Structure

```
trippy/
├── app/
│   ├── actions/          # Server actions
│   ├── search/          # Search results page
│   ├── globals.css      # Global styles & theme
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── map/            # Google Maps components
│   ├── providers/      # Context providers
│   └── ui/             # UI components
├── lib/                # Utilities
└── types/              # TypeScript types
```

## License

MIT

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [react-icons](https://react-icons.github.io/react-icons/)
- Maps powered by [Google Maps Platform](https://developers.google.com/maps)
