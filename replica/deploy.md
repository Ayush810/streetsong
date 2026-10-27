# Deploy: Streetsong

Static site: `public/` (HTML/CSS/JS, no backend, no build step, no env vars, no secrets).
Music: Audius public API, called from the visitor's browser. Data: visitor's localStorage only.

## Step 1: preflight (run 2026-10-27)

| check | how | result |
| --- | --- | --- |
| end-to-end flows | browser click-through with the production `_headers` CSP applied by `server.js` | **pass**: home shelves (97 cards), play, pause, next, prev-restarts, like → Favourites, search (36), no-results state, playlist create / remove track / delete, genre page (50), queue (13), local files empty state |
| feature parity | `replica/features.csv`, weighted must 3 / should 2 / could 1 | **pass**: 37/37 (100%), must-haves 8/8 |
| rebrand sweep | `node replica/tools/checks.js sweep public replica/brand.json` | **pass**: clean, exit 0 |
| contrast | contrast (Node port) on `replica/design/tokens.json` | **pass**: 15 pairs, 0 failing AA |
| production build | n/a, no build step | **pass** |
| store listing lint | n/a, web only | skipped |
| open S1/S2 bugs | none open. Fixed during preflight: broken artwork from down Audius nodes (now retries mirrors, 3/3 recovered), inline `onclick` blocked by CSP | **pass** |
| privacy + terms page | `about.html`, lists processors (Audius, web host) | **pass** |
| cookie banner | not needed: no cookies, no analytics | **pass** |
| account deletion | n/a, no accounts. Clearing browser data deletes everything | **pass** |
| favicon, titles, OG image | `icon.svg`, "Streetsong" titles, `og.png` 1200x630 | **pass**, but `og:image` must become an absolute URL once the live URL is known |
| security headers | `_headers`: CSP, nosniff, referrer, permissions, frame-ancestors none | **pass**, no CSP violations in console |

Python isn't installed on this machine, so `sweep.py` and `contrast.py` ran as line-for-line
Node ports (same patterns, thresholds and skip rules): `replica/tools/checks.js`.

## Step 2: production services

None needed: no database, no Stripe, no OAuth, no email, no env vars.

## Step 3: host and domain

Recommended host: **Netlify** (free tier, reads `_headers`, HTTPS automatic). Cloudflare Pages
is equally good and also reads `_headers`.

Deploy options (the user signs in, Claude never does):
- **Netlify Drop (no tools):** sign in at https://app.netlify.com/drop and drag the
  `streetsong` folder onto the page.
- **Netlify CLI:** `npx netlify-cli login` (the user approves in the browser), then
  `npx netlify-cli deploy --dir public --prod`.
- **Cloudflare Pages CLI:** `npx wrangler login`, then
  `npx wrangler pages deploy streetsong --project-name streetsong`.

Custom domain (optional, `streetsong.app` was unregistered on 2026-10-27; the user buys it):

| record | name | value |
| --- | --- | --- |
| A | @ | 75.2.60.5 (Netlify load balancer; confirm in Netlify domain settings) |
| CNAME | www | `<site-name>.netlify.app` |

Canonical: apex `streetsong.app`, redirect `www` → apex (Netlify does this automatically when both are added).
`.app` is HSTS-preloaded, so HTTPS is mandatory; the host's certificate covers it.
No email DNS needed (the app sends no email).

Live URL: **https://streetsong.netlify.app** (deployed 2026-10-27 via Netlify CLI, project
`streetsong`, team "Ayush Tiwari's team", Free plan). HTTP → HTTPS redirect confirmed (301).

Visitor protection: the team defaults new projects to "Netlify team login" (`sso_login`). Turned off
for this project via the Netlify API on 2026-10-27 at the owner's request. The team default
(`account_sso_login`) is still on, so **future** projects on this team will start private too.

Live check, 2026-10-27, anonymous visitor:

| check | result |
| --- | --- |
| `/`, `/about.html`, `/og.png`, `/icon.svg`, `/app.js`, `/styles.css` | 200, correct content types |
| security headers | CSP, HSTS (`max-age=31536000; includeSubDomains; preload`), nosniff, referrer policy all served |
| core flow | 97 cards loaded, play, next, favourite, search (37 results) all pass; 0 broken artwork |
| console | one blocked inline script with the same hash on every page; the served HTML has no inline script, so it's injected by the testing browser, not the site |

## Step 4: watch it (first week)

- Uptime: a free monitor (e.g. UptimeRobot) on the home page and on
  `https://api.audius.co/v1/tracks/trending?app_name=Streetsong`. If Audius is down, the app is.
- Errors: no server, so check the browser console on the live site. Netlify's deploy log for deploys.
- Analytics: none, by design (keeps the "no tracking" promise in the privacy page true).
- Do the core flow on the live site (play, search, favourite, playlist), then on a phone.

## Step 5: mobile

Not applicable: web only. It works in mobile browsers and can be added to the home screen.
