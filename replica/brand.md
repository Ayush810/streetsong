# Brand: Streetsong

**Angle:** free music, straight from the artists who chose to share it. Like a busker on the
street, it's out in the open, no paywall, and you can stop and listen as long as you like.

Why not "Freewave" (the placeholder): FreeWave Technologies is an established wireless-radio
company with marks in class 9, the same class as apps. Too close to risk.

## Step 1: name candidates (20)

| style | candidates |
| --- | --- |
| descriptive | Openplay, Freestream, Tunehall, Listenhall |
| compound | Streetsong, Songcorner, Wavecart, Noteway |
| invented | Ondo, Lumo, Vellow, Brio |
| metaphor | Busker, Openair, Hearthtone, Campfire |
| verb / short | Riffle, Hum, Strum, Buskr |

Cut: Freestream / Openplay (generic, hard to protect), Hearthtone (sounds like Blizzard's
*Hearthstone*), Hum / Strum / Brio / Lumo (crowded in music and apps), Busker / Openair /
Riffle (all their domains taken), Campfire (existing chat products).

**Shortlist:** Streetsong (chosen), Ondo, Tunehall, Buskr, Songcorner.

## Step 2: checks

Screening only, not legal clearance. Get a trademark lawyer's search before spending money on the name.

| check | Streetsong | Ondo | Tunehall | Buskr | Songcorner |
| --- | --- | --- | --- | --- | --- |
| .com (RDAP, 2026-10-27) | taken | taken | taken | taken | to run |
| .app (RDAP, 2026-10-27) | **unregistered** | taken | **unregistered** | taken | to run |
| .fm (RDAP, 2026-10-27) | **unregistered** | **unregistered** | **unregistered** | **unregistered** | to run |
| web: "name + music app" (2026-10-27) | no music app found | only a 2009 phone concept by Pilotfish | no app found; "Tune-" prefix crowded (TuneIn, Tune.fm) | to run | to run |
| US trademark (tmsearch.uspto.gov, classes 9, 41, 42) | to run | to run | to run | to run | to run |
| EU trademark (TMview) | to run | to run | to run | to run | to run |
| Canada (ised-isde.canada.ca) | to run | to run | to run | to run | to run |
| WIPO Global Brand Database | to run | to run | to run | to run | to run |
| App Store and Google Play | to run | to run | to run | to run | to run |
| handles (X, Instagram, TikTok, GitHub) | to run | to run | to run | to run | to run |

## Step 3: palette

The original's primary is green (#1db954). Ours is **streetlamp amber**, from a different family,
on a warm near-black night palette. Tokens: `replica/design/tokens.json`. Contrast check, 2026-10-27: 0 AA failures.

| role | value |
| --- | --- |
| bg | #0f0e0c |
| surface | #1a1815 |
| surface-2 | #24211d |
| text | #f6f2ea |
| text-muted | #aaa398 |
| accent (streetlamp) | #ffb547 |
| on-accent | #1a1206 |
| accent-2 (brick) | #ff6b4a |
| danger | #ff7a6b |

## Step 4: logo brief

- **Idea:** a single winding line that is both an **S** and a sound wave, like a street
  winding out of sight, lit amber.
- **Mark type:** symbol plus wordmark. The symbol works alone as the app icon.
- **Works at 16px:** one heavy stroke, no detail inside. Current draft: amber rounded square,
  near-black S-wave stroke (`public/icon.svg`, used as favicon and `.brand-mark`).
- **Deliverables:** SVG master, 1024x1024 app icon with no transparency (iOS), favicon set
  (16/32/180/512), social image 1200x630.
- **Must not resemble the original's mark:** the original is three stacked curved bars in a
  green circle. Ours: no circle, no stacked arcs, no green/black pair. Check side by side.

## Step 5: voice

**Warm, plain, curious.**
- warm, not cute: friendly, no jokes on errors
- plain, not flat: short words, still with some life
- curious, not pushy: invites you to explore, never nags

| do | don't |
| --- | --- |
| "Nothing here yet. Go find something you love." | "Oops! Looks like this is empty :(" |
| "That track wouldn't play, so we skipped it." | "Error: playback failed (code 4)" |
| "Saved to your favourites" | "Successfully added item to collection" |
| "Play" | "Start listening now!!" |
| Name the artist first-class | Call them "content" |

### Rewritten strings (10 most seen)

| where | before | after |
| --- | --- | --- |
| brand | Freewave | Streetsong |
| idle player title | Nothing playing | Quiet for now |
| idle player sub | Pick a song to start | Pick something to play |
| search placeholder | What do you want to listen to? | Search songs, artists, moods |
| liked list name | Liked Songs | Favourites |
| like toast | Added to Liked Songs | Saved to Favourites |
| liked empty | Songs you like will appear here | Nothing saved yet |
| liked empty body | Save songs by tapping the heart icon. | Tap the heart on any song and it lands here. |
| skip toast | Couldn't play that track — skipping | That one wouldn't play, so we skipped it |
| queue empty | Your queue is empty | Nothing lined up |
| home sub (new) | (none) | Free music from independent artists |

## Step 6: sweep

`replica/brand.json` lists what must not ship: the original's name and domains, its brand
colours, and the old placeholder name. Swept 2026-10-27, result recorded in the chat.
