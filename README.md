# Star Wars API Client
See it live at [swapi-ui.vercel.app/](https://swapi-ui.vercel.app/)

## Description
A Single-Page Application made with React, Next.js 15 and TypeScript, that fetches data from
the public [Star Wars API](https://swapi.dev/) and displays Star Wars characters. Users can search by
character name, homeworld, and movie.

Images used are random placeholders to avoid copyright infringements. Better be safe than sorry.

## Design Decisions
1. Sprinkled "use client" almost everywhere, since I'm consuming a public API without authentication
2. Kept placeholder images as part of the bundle for fast image load
3. Debounced the text input to respect the user's typing speed and control the re-render frequencies
4. I'm frontloading the characters because they rarely grow larger in size (unlike an eCommerce or betting application)

## Usage
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

1. Install dependencies: `pnpm install`
2. Run the development server: `pnpm dev`
3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

