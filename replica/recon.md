# Recon map: Spotify (web player) → personal free-music clone

## Scope
- **App / platform:** Spotify Web Player (open.spotify.com), desktop web, responsive to mobile.
- **Slice:** the core listening loop: browse → search → play → queue → like → playlists.
- **For:** the user's own personal use. No accounts, no payments.

## Sources
| source | URL | gave us |
| --- | --- | --- |
| help center | https://support.spotify.com/ | playback, queue, playlists, Liked Songs, shuffle/repeat |
| pricing page | https://www.spotify.com/premium/ | gated: ad-free, skip limits, offline (we give all free) |
| marketing site | https://www.spotify.com/ | core loop: "listen to music" |
| public API docs | https://developer.spotify.com/documentation/web-api | entities: track, album, artist, playlist |
| music source (legal) | https://docs.audius.org/ | free, artist-uploaded streaming API, no key |

## Screen inventory
| ID | screen | route | purpose | key components | states |
| --- | --- | --- | --- | --- | --- |
| S01 | App shell | always | sidebar + main + now-playing bar | Sidebar, PlayerBar | desktop, mobile |
| S02 | Home | `#/` | trending + genre shelves | Shelf, Card | loading, filled, error |
| S03 | Search | `#/search?q=` | find tracks | SearchInput, TrackRow, genre tiles | empty (browse genres), loading, results, no results |
| S04 | Liked Songs | `#/liked` | saved tracks | header, TrackList | empty, filled |
| S05 | Playlist | `#/playlist/:id` | user playlist | header, TrackList, rename/delete | empty, filled |
| S06 | Queue | `#/queue` | now playing + up next | TrackList | empty, filled |
| S07 | Local files | `#/local` | play files from disk | file picker, TrackList | empty, filled |
| S08 | Genre | `#/genre/:g` | trending by genre | TrackList | loading, filled |

## User flows
```
F01 Listen to something now          S02 home -> click card play         (1 click)
F02 Find and play a song             S03 type query -> click row         (2 actions)
    edge: no results, network error, stream fails -> skip to next
F03 Like a song                      PlayerBar heart / row heart -> S04   (1 click)
F04 Make a playlist and add songs    sidebar "+" -> row menu "Add to playlist" (3 clicks)
F05 Control playback                 PlayerBar: play/pause, next/prev, seek, volume, shuffle, repeat, keyboard space
F06 Play local files                 S07 pick files -> click row
```

## Components
Button (primary/icon/ghost; hover, active, disabled) · SidebarNav item (active) · Card (hover reveals play) ·
Shelf · TrackRow (hover, playing, liked) · TrackList header · SearchInput · PlayerBar · Slider (seek/volume) ·
Toast · Context menu (add to playlist) · Genre tile · Skeleton loader · Empty state.

## Inferred data model
```
Track     id, title, artist, artwork, duration, genre, source (audius|local), streamUrl
          evidence: API docs, track rows. confidence: high
Playlist  id, name, createdAt, trackIds[] (tracks cached by id)   confidence: high
Liked     ordered list of track ids                                confidence: high
Queue     ordered track list, index, shuffle, repeat (off|all|one) confidence: high
```
Persistence: browser localStorage (personal app, no backend).

## Cannot be cloned (skip)
- Spotify's licensed catalogue: replaced with Audius (free, artist-uploaded) + user's local files.
- Spotify accounts, social graph, follower counts, editorial/algorithmic playlists from listening data.
- Spotify name, logo, green trade dress, icons, copy.
- Podcasts, lyrics (licensed), Connect/device handoff, offline downloads.

## Size
8 screens, 6 flows, 4 entities. Hard parts: reliable streaming + skip on error, queue/shuffle/repeat logic,
responsive layout. **Size: S** (a weekend), as a no-build static web app.
