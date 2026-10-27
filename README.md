# Streetsong

Free music from independent artists. Search, save favourites, make playlists. No sign-up.

**Live:** https://streetsong.netlify.app

Music streams from the [Audius](https://audius.co) public API: artists upload their own tracks and
choose to let anyone stream them for free. You can also play audio files from your own computer.

## Run locally

```
node server.js
```

Open http://localhost:5173. No install, no build, no API key. The local server applies the same
security headers as production (`public/_headers`).

## Deploy

```
npx netlify-cli deploy --dir public --prod
```

`netlify.toml` sets `public/` as the publish folder, so connecting this repo in Netlify also works.

## Features

Home with trending + genre shelves · search · genre pages · play/pause/seek/next/previous ·
shuffle · repeat (all/one) · queue · Favourites · playlists (create, rename, delete, add/remove) ·
local files · OS media keys · keyboard (Space, ←/→ seek, Shift+←/→ skip) · mobile layout.

Favourites and playlists are saved in your browser (localStorage), so they're per browser and device.

## Layout

- `public/`: the website (the only folder that's deployed)
  - `index.html` app shell · `app.js` player, router, views, Audius client · `styles.css` design ·
    `about.html` about, privacy, terms · `icon.svg` logo · `og.png` link preview · `_headers` security headers
- `server.js`: tiny static server for local use
- `replica/`: planning notes from building it: recon of the reference app, feature matrix, brand
  (name checks, palette, voice), design tokens, deploy checklist
