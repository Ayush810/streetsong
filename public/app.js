/* Streetsong: a personal music player streaming free, artist-uploaded music from the Audius public API. */
(() => {
  'use strict';

  const API = 'https://api.audius.co/v1';
  const APP_NAME = 'Streetsong';
  const STORE_KEY = 'streetsong:v1';

  const GENRES = [
    ['Electronic', '#7c3aed'], ['Hip-Hop/Rap', '#e11d48'], ['Lo-Fi', '#0d9488'], ['Pop', '#db2777'],
    ['Rock', '#b45309'], ['Ambient', '#2563eb'], ['R&B/Soul', '#9333ea'], ['House', '#ea580c'],
    ['Alternative', '#4d7c0f'], ['Jazz', '#0369a1'], ['Acoustic', '#a16207'], ['Techno', '#475569'],
    ['Classical', '#7f1d1d'], ['Dubstep', '#15803d'], ['Folk', '#92400e'], ['Experimental', '#be185d'],
  ];
  const HOME_GENRES = ['Electronic', 'Lo-Fi', 'Hip-Hop/Rap', 'Pop', 'Ambient', 'Rock'];

  // ---------- icons ----------
  const ICONS = {
    home: 'M12 3 3 10v11h6v-6h6v6h6V10z',
    search: 'M10.5 3a7.5 7.5 0 0 1 5.9 12.1l4.7 4.8-1.4 1.4-4.8-4.7A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z',
    queue: 'M3 5h14v2H3zm0 6h14v2H3zm0 6h9v2H3zm14-2 5 3-5 3z',
    folder: 'M3 5h7l2 2h9v12H3z',
    plus: 'M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7z',
    play: 'M8 5v14l11-7z',
    pause: 'M7 5h4v14H7zm6 0h4v14h-4z',
    next: 'M6 6l9 6-9 6zm10 0h2v12h-2z',
    prev: 'M18 6v12l-9-6zM6 6h2v12H6z',
    shuffle: 'M16 4h4v4l-1.4-1.4-3.3 3.3-1.4-1.4 3.3-3.3zM4 6.4 5.4 5l13.2 13.2L20 16.8V20h-4l1.4-1.4L4.2 5.4zm5 8 1.4 1.4-4 4L5 18.4z',
    repeat: 'M7 7h10V4l4 4-4 4V9H7v4H5V9a2 2 0 0 1 2-2zm10 10H7v3l-4-4 4-4v3h10v-4h2v4a2 2 0 0 1-2 2z',
    repeatOne: 'M7 7h10V4l4 4-4 4V9H7v4H5V9a2 2 0 0 1 2-2zm10 10H7v3l-4-4 4-4v3h10v-4h2v4a2 2 0 0 1-2 2zM11 10h2v5h-2v-3.5h-1z',
    heart: 'M12 20.3 10.6 19C5.4 14.4 2 11.3 2 7.5A4.9 4.9 0 0 1 7 2.5c1.9 0 3.7.9 5 2.3a6.6 6.6 0 0 1 5-2.3 4.9 4.9 0 0 1 5 5c0 3.8-3.4 6.9-8.6 11.5zM7 4.5a2.9 2.9 0 0 0-3 3c0 2.9 3.1 5.7 8 10 4.9-4.3 8-7.1 8-10a2.9 2.9 0 0 0-3-3c-1.5 0-3 1-3.6 2.4h-2.8C10 5.5 8.5 4.5 7 4.5z',
    heartFill: 'M12 20.3 10.6 19C5.4 14.4 2 11.3 2 7.5A4.9 4.9 0 0 1 7 2.5c1.9 0 3.7.9 5 2.3a6.6 6.6 0 0 1 5-2.3 4.9 4.9 0 0 1 5 5c0 3.8-3.4 6.9-8.6 11.5z',
    volume: 'M3 9h4l5-4v14l-5-4H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z',
    mute: 'M3 9h4l5-4v14l-5-4H3zm13.6.2 1.4-1.4 2.1 2.1 2.1-2.1 1.4 1.4-2.1 2.1 2.1 2.1-1.4 1.4-2.1-2.1-2.1 2.1-1.4-1.4 2.1-2.1z',
    more: 'M5 10a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm7 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
    music: 'M9 3v10.6A4 4 0 1 0 11 17V7h8V3z',
    list: 'M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z',
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name]}"/></svg>`;
  const hydrateIcons = (root = document) =>
    root.querySelectorAll('i[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });

  // ---------- helpers ----------
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (sec) => {
    if (!isFinite(sec) || sec < 0) return '0:00';
    sec = Math.floor(sec);
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = String(sec % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
  };
  const uid = () => Math.random().toString(36).slice(2, 10);
  const PLACEHOLDER_ART = 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#24211d"/><path transform="translate(26 26) scale(2)" fill="#5a534a" d="${ICONS.music}"/></svg>`);

  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  // ---------- storage ----------
  const store = (() => {
    let data = { liked: [], playlists: [], volume: 0.8, shuffle: false, repeat: 'off' };
    try { Object.assign(data, JSON.parse(localStorage.getItem(STORE_KEY) || '{}')); } catch { /* fresh start */ }
    const save = () => { try { localStorage.setItem(STORE_KEY, JSON.stringify(data)); } catch { /* storage unavailable */ } };
    return { data, save };
  })();
  const S = store.data;
  const isLiked = (id) => S.liked.some((t) => t.id === id);
  const persistable = (t) => t.source !== 'local';

  function toggleLike(track) {
    if (!persistable(track)) return toast('Local files can’t be saved');
    const i = S.liked.findIndex((t) => t.id === track.id);
    if (i >= 0) { S.liked.splice(i, 1); toast('Removed from Favourites'); }
    else { S.liked.unshift(track); toast('Saved to Favourites'); }
    store.save();
    renderLibrary(); updateNow(); refreshLikeButtons();
    if (route().name === 'liked') render();
  }

  // ---------- Audius API ----------
  const cache = new Map();
  async function api(path, params = {}) {
    const qs = new URLSearchParams({ ...params, app_name: APP_NAME });
    const url = `${API}${path}?${qs}`;
    if (cache.has(url)) return cache.get(url);
    const p = fetch(url).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    }).then((j) => (j.data || []));
    cache.set(url, p);
    p.catch(() => cache.delete(url));
    return p;
  }
  // Artwork lives on community nodes that are sometimes down; remember each image's mirrors to retry on error.
  const artMirrors = new Map();
  const toTrack = (t) => {
    const art = t.artwork?.['480x480'] || t.artwork?.['150x150'] || '';
    if (art && t.artwork?.mirrors?.length) { try { artMirrors.set(new URL(art).pathname, t.artwork.mirrors); } catch { /* bad url */ } }
    return toTrackFields(t, art);
  };
  const toTrackFields = (t, art) => ({
    id: t.id,
    title: t.title,
    artist: t.user?.name || 'Unknown artist',
    art,
    duration: t.duration || 0,
    genre: t.genre || '',
    source: 'audius',
  });
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName !== 'IMG' || img.src.startsWith('data:')) return;
    let url;
    try { url = new URL(img.src); } catch { return; }
    const mirrors = artMirrors.get(url.pathname) || [];
    const tries = Number(img.dataset.tries || 0);
    if (tries < mirrors.length) { img.dataset.tries = tries + 1; img.src = mirrors[tries].replace(/\/$/, '') + url.pathname; }
    else img.src = PLACEHOLDER_ART;
  }, true);
  const playable = (t) => t.is_streamable !== false && !t.is_stream_gated && t.access?.stream !== false;
  const getTracks = (path, params) => api(path, params).then((list) => list.filter(playable).map(toTrack));
  const trending = (genre, limit = 20) => getTracks('/tracks/trending', genre ? { genre, limit } : { limit });
  const searchTracks = (query) => getTracks('/tracks/search', { query, limit: 40 });
  const srcFor = (t) => t.source === 'local' ? t.url : `${API}/tracks/${encodeURIComponent(t.id)}/stream?app_name=${APP_NAME}`;

  // ---------- player ----------
  const audio = $('#audio');
  const P = { queue: [], order: [], pos: -1, playing: false };
  const current = () => (P.pos >= 0 ? P.queue[P.order[P.pos]] : null);

  function buildOrder(startIdx) {
    const idx = P.queue.map((_, i) => i);
    if (S.shuffle) {
      const rest = idx.filter((i) => i !== startIdx);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      P.order = startIdx >= 0 ? [startIdx, ...rest] : rest;
    } else {
      P.order = idx;
    }
  }

  function playList(tracks, startIdx = 0) {
    if (!tracks.length) return;
    P.queue = tracks.slice();
    buildOrder(startIdx);
    P.pos = P.order.indexOf(startIdx);
    load(true);
  }

  function load(autoplay) {
    const t = current();
    if (!t) return;
    audio.src = srcFor(t);
    if (autoplay) audio.play().catch(() => {});
    updateNow();
    refreshPlaying();
    if (route().name === 'queue') render();
  }

  function next(auto = false) {
    if (!P.queue.length) return;
    if (P.pos + 1 < P.order.length) P.pos++;
    else if (S.repeat === 'all') P.pos = 0;
    else return; // end of queue
    load(true);
  }

  function prev() {
    if (!P.queue.length) return;
    if (audio.currentTime > 3 || P.pos === 0) { audio.currentTime = 0; return; }
    P.pos--;
    load(true);
  }

  function togglePlay() {
    if (!current()) {
      const list = lastListed.length ? lastListed : S.liked;
      if (list.length) playList(list, 0);
      return;
    }
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  }

  function addToQueue(track) {
    if (!current()) return playList([track], 0);
    P.queue.push(track);
    P.order.splice(P.pos + 1, 0, P.queue.length - 1);
    toast('Up next');
    if (route().name === 'queue') render();
  }

  function setShuffle(on) {
    S.shuffle = on; store.save();
    const cur = current() ? P.order[P.pos] : -1;
    if (P.queue.length) { buildOrder(cur); P.pos = cur >= 0 ? 0 : -1; }
    updateModes();
    if (route().name === 'queue') render();
  }

  function cycleRepeat() {
    S.repeat = { off: 'all', all: 'one', one: 'off' }[S.repeat] || 'off';
    store.save();
    updateModes();
  }

  let errorSkips = 0;
  audio.addEventListener('play', () => { P.playing = true; updatePlayBtn(); refreshPlaying(); });
  audio.addEventListener('pause', () => { P.playing = false; updatePlayBtn(); refreshPlaying(); });
  audio.addEventListener('playing', () => { errorSkips = 0; });
  audio.addEventListener('ended', () => {
    if (S.repeat === 'one') { audio.currentTime = 0; audio.play().catch(() => {}); }
    else next(true);
  });
  audio.addEventListener('error', () => {
    if (!current()) return;
    if (++errorSkips > 3) { toast('Several tracks in a row wouldn’t play. Check your connection.'); errorSkips = 0; return; }
    toast('That one wouldn’t play, so we skipped it');
    setTimeout(() => next(true), 600);
  });
  audio.addEventListener('timeupdate', updateSeek);
  audio.addEventListener('loadedmetadata', updateSeek);

  // ---------- player bar UI ----------
  const seek = $('#seek'), vol = $('#volume');
  let seeking = false;
  const setFill = (el) => el.style.setProperty('--p', `${(el.value - el.min) / (el.max - el.min) * 100}%`);

  function updateSeek() {
    const d = audio.duration || current()?.duration || 0;
    $('#t-cur').textContent = fmt(audio.currentTime);
    $('#t-dur').textContent = fmt(d);
    if (!seeking) { seek.value = d ? (audio.currentTime / d) * 1000 : 0; setFill(seek); }
    if ('mediaSession' in navigator && d && isFinite(d)) {
      try { navigator.mediaSession.setPositionState({ duration: d, position: Math.min(audio.currentTime, d), playbackRate: 1 }); } catch { /* unsupported */ }
    }
  }
  seek.addEventListener('input', () => { seeking = true; setFill(seek); $('#t-cur').textContent = fmt((seek.value / 1000) * (audio.duration || 0)); });
  seek.addEventListener('change', () => { if (audio.duration) audio.currentTime = (seek.value / 1000) * audio.duration; seeking = false; });

  function setVolume(v) {
    audio.volume = v; audio.muted = v === 0;
    vol.value = Math.round(v * 100); setFill(vol);
    $('#btn-mute').innerHTML = icon(v === 0 ? 'mute' : 'volume');
  }
  let lastVol = S.volume || 0.8;
  vol.addEventListener('input', () => { const v = vol.value / 100; setVolume(v); if (v > 0) lastVol = v; S.volume = v; store.save(); });
  $('#btn-mute').addEventListener('click', () => { const v = audio.volume > 0 ? 0 : (lastVol || 0.8); setVolume(v); S.volume = v; store.save(); });

  function updatePlayBtn() {
    const b = $('#btn-play');
    b.innerHTML = icon(P.playing ? 'pause' : 'play');
    b.setAttribute('aria-label', P.playing ? 'Pause' : 'Play');
    document.querySelectorAll('[data-play-list]').forEach((el) => {
      const mine = el.dataset.playList === activeListKey && P.playing;
      el.innerHTML = icon(mine ? 'pause' : 'play');
    });
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = P.playing ? 'playing' : 'paused';
  }

  function updateModes() {
    $('#btn-shuffle').classList.toggle('on', !!S.shuffle);
    const r = $('#btn-repeat');
    r.classList.toggle('on', S.repeat !== 'off');
    r.innerHTML = icon(S.repeat === 'one' ? 'repeatOne' : 'repeat');
    r.title = `Repeat: ${S.repeat}`;
  }

  function updateNow() {
    const t = current();
    const like = $('#now-like');
    if (!t) return;
    const art = $('#now-art');
    art.src = t.art || PLACEHOLDER_ART;
    $('#now-title').textContent = t.title;
    $('#now-artist').textContent = t.artist;
    like.hidden = !persistable(t);
    like.classList.toggle('on', isLiked(t.id));
    like.innerHTML = icon(isLiked(t.id) ? 'heartFill' : 'heart');
    document.title = `${t.title} · ${t.artist} — Streetsong`;
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: t.title, artist: t.artist, album: 'Streetsong',
        artwork: t.art ? [{ src: t.art, sizes: '480x480', type: 'image/jpeg' }] : [],
      });
    }
  }

  $('#btn-play').addEventListener('click', togglePlay);
  $('#btn-next').addEventListener('click', () => next(false));
  $('#btn-prev').addEventListener('click', prev);
  $('#btn-shuffle').addEventListener('click', () => setShuffle(!S.shuffle));
  $('#btn-repeat').addEventListener('click', cycleRepeat);
  $('#now-like').addEventListener('click', () => current() && toggleLike(current()));

  if ('mediaSession' in navigator) {
    const ms = navigator.mediaSession;
    ms.setActionHandler('play', () => audio.play());
    ms.setActionHandler('pause', () => audio.pause());
    ms.setActionHandler('nexttrack', () => next(false));
    ms.setActionHandler('previoustrack', prev);
    try { ms.setActionHandler('seekto', (e) => { audio.currentTime = e.seekTime; }); } catch { /* unsupported */ }
  }

  document.addEventListener('keydown', (e) => {
    if (e.target.closest('input, textarea, [contenteditable]') && e.target.type !== 'range') return;
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    else if (e.code === 'ArrowRight' && e.shiftKey) next(false);
    else if (e.code === 'ArrowLeft' && e.shiftKey) prev();
    else if (e.code === 'ArrowRight' && e.target.type !== 'range') audio.currentTime += 5;
    else if (e.code === 'ArrowLeft' && e.target.type !== 'range') audio.currentTime -= 5;
    else if (e.key === 'Escape') closeMenu();
  });

  // ---------- track lists ----------
  // Lists rendered on the current page, keyed so rows and big play buttons know what to play.
  const lists = new Map();
  let lastListed = [];
  let activeListKey = null;

  function registerList(key, tracks) {
    lists.set(key, tracks);
    if (tracks.length) lastListed = tracks;
    return key;
  }

  function playFromList(key, idx) {
    const tracks = lists.get(key);
    if (!tracks) return;
    activeListKey = key;
    playList(tracks, idx);
  }

  function trackRows(key, tracks, opts = {}) {
    registerList(key, tracks);
    if (!tracks.length) return '';
    const rows = tracks.map((t, i) => `
      <div class="track" data-list="${esc(key)}" data-idx="${i}" data-id="${esc(t.id)}" role="button" tabindex="0" aria-label="Play ${esc(t.title)} by ${esc(t.artist)}">
        <div class="t-num"><span class="n">${i + 1}</span><span class="hover-icon">${icon('play')}</span></div>
        <div class="t-main">
          <img src="${esc(t.art || PLACEHOLDER_ART)}" alt="" loading="lazy">
          <div class="t-text"><div class="t-title">${esc(t.title)}</div><div class="t-artist">${esc(t.artist)}</div></div>
        </div>
        <div class="t-genre">${esc(t.genre)}</div>
        <button class="icon-btn like-row${isLiked(t.id) ? ' on' : ''}" data-like aria-label="Like" ${persistable(t) ? '' : 'disabled'}>${icon(isLiked(t.id) ? 'heartFill' : 'heart')}</button>
        <div class="t-dur">${fmt(t.duration)}</div>
        <button class="icon-btn" data-more aria-label="More options">${icon('more')}</button>
      </div>`).join('');
    return `<div class="tracks" data-playlist-id="${esc(opts.playlistId || '')}">
      <div class="track-head"><div style="text-align:center">#</div><div>Title</div><div>Genre</div><div></div><div style="text-align:right">Time</div><div></div></div>
      ${rows}</div>`;
  }

  function refreshPlaying() {
    const t = current();
    document.querySelectorAll('.track').forEach((row) => {
      const on = t && row.dataset.id === String(t.id);
      row.classList.toggle('playing', !!on);
      const n = row.querySelector('.n');
      if (on) n.innerHTML = `<span class="eq${P.playing ? '' : ' paused'}"><span></span><span></span><span></span></span>`;
      else if (n.querySelector('.eq')) n.textContent = Number(row.dataset.idx) + 1;
    });
    updatePlayBtn();
  }

  function refreshLikeButtons() {
    document.querySelectorAll('.track').forEach((row) => {
      const b = row.querySelector('[data-like]');
      const on = isLiked(row.dataset.id);
      b.classList.toggle('on', on);
      b.innerHTML = icon(on ? 'heartFill' : 'heart');
    });
  }

  const trackAt = (row) => lists.get(row.dataset.list)?.[Number(row.dataset.idx)];

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-reload]')) return location.reload();
    const bigPlay = e.target.closest('[data-play-list]');
    if (bigPlay) {
      e.stopPropagation();
      const key = bigPlay.dataset.playList;
      if (activeListKey === key && current()) togglePlay();
      else playFromList(key, Number(bigPlay.dataset.start || 0));
      return;
    }
    const row = e.target.closest('.track');
    if (row) {
      const t = trackAt(row);
      if (e.target.closest('[data-like]')) return t && toggleLike(t);
      if (e.target.closest('[data-more]')) return t && openTrackMenu(e.target.closest('[data-more]'), t, row);
      const cur = current();
      if (cur && cur.id === t?.id) return togglePlay();
      return playFromList(row.dataset.list, Number(row.dataset.idx));
    }
    const card = e.target.closest('.card[data-list]');
    if (card) return playFromList(card.dataset.list, Number(card.dataset.idx));
    if (!e.target.closest('#menu')) closeMenu();
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter') && e.target.matches('.track, .card[data-list]')) e.target.click();
  });

  // ---------- context menu ----------
  const menu = $('#menu');
  function closeMenu() { menu.hidden = true; menu.innerHTML = ''; }

  function openTrackMenu(anchor, track, row) {
    const playlistId = row.closest('.tracks')?.dataset.playlistId;
    const canSave = persistable(track);
    menu.innerHTML = `
      <button data-act="queue">Add to queue</button>
      ${playlistId ? `<button data-act="remove">Remove from this playlist</button>` : ''}
      ${canSave ? `<hr><div class="label">Add to playlist</div>
        <button data-act="new">+ New playlist</button>
        ${S.playlists.map((p) => `<button data-act="add" data-pid="${esc(p.id)}">${esc(p.name)}</button>`).join('')}` : ''}`;
    menu.hidden = false;
    const r = anchor.getBoundingClientRect();
    const mw = menu.offsetWidth, mh = menu.offsetHeight;
    menu.style.left = `${Math.max(8, Math.min(r.right - mw, innerWidth - mw - 8))}px`;
    menu.style.top = `${r.bottom + mh + 8 > innerHeight ? Math.max(8, r.top - mh - 4) : r.bottom + 4}px`;
    menu.onclick = (e) => {
      const b = e.target.closest('button[data-act]');
      if (!b) return;
      const act = b.dataset.act;
      if (act === 'queue') addToQueue(track);
      else if (act === 'remove') removeFromPlaylist(playlistId, Number(row.dataset.idx));
      else if (act === 'new') { const p = createPlaylist(); if (p) addToPlaylist(p.id, track); }
      else if (act === 'add') addToPlaylist(b.dataset.pid, track);
      closeMenu();
    };
  }
  document.addEventListener('scroll', closeMenu, true);
  addEventListener('resize', closeMenu);

  // ---------- playlists ----------
  function createPlaylist() {
    const name = prompt('Playlist name', `My Playlist #${S.playlists.length + 1}`);
    if (!name || !name.trim()) return null;
    const p = { id: uid(), name: name.trim().slice(0, 80), tracks: [], createdAt: Date.now() };
    S.playlists.push(p); store.save(); renderLibrary();
    toast(`Created “${p.name}”`);
    return p;
  }
  function addToPlaylist(pid, track) {
    const p = S.playlists.find((x) => x.id === pid);
    if (!p) return;
    if (p.tracks.some((t) => t.id === track.id)) return toast(`Already in “${p.name}”`);
    p.tracks.push(track); store.save(); renderLibrary();
    toast(`Added to “${p.name}”`);
    if (route().name === 'playlist' && route().arg === pid) render();
  }
  function removeFromPlaylist(pid, idx) {
    const p = S.playlists.find((x) => x.id === pid);
    if (!p) return;
    p.tracks.splice(idx, 1); store.save(); renderLibrary(); render();
    toast('Removed from playlist');
  }
  $('#new-playlist').addEventListener('click', () => { const p = createPlaylist(); if (p) location.hash = `#/playlist/${p.id}`; });

  function renderLibrary() {
    const r = route();
    const items = [
      `<li><a href="#/liked" class="${r.name === 'liked' ? 'active' : ''}"><span class="lib-thumb liked">${icon('heartFill')}</span>
        <span><div class="lib-name">Favourites</div><div class="lib-sub">${S.liked.length} songs</div></span></a></li>`,
      ...S.playlists.map((p) => `<li><a href="#/playlist/${esc(p.id)}" class="${r.name === 'playlist' && r.arg === p.id ? 'active' : ''}">
        ${p.tracks[0]?.art ? `<img class="lib-thumb" src="${esc(p.tracks[0].art)}" alt="">` : `<span class="lib-thumb">${icon('music')}</span>`}
        <span style="min-width:0"><div class="lib-name">${esc(p.name)}</div><div class="lib-sub">Playlist · ${p.tracks.length} songs</div></span></a></li>`),
    ];
    $('#lib-list').innerHTML = items.join('');
  }

  // ---------- local files ----------
  let localTracks = [];
  $('#file-input').addEventListener('change', (e) => {
    const files = [...e.target.files].filter((f) => f.type.startsWith('audio/') || /\.(mp3|m4a|aac|ogg|oga|opus|wav|flac|webm)$/i.test(f.name));
    const added = files.map((f) => {
      const t = { id: `local-${uid()}`, title: f.name.replace(/\.[^.]+$/, ''), artist: 'Local file', art: '', duration: 0, genre: '', source: 'local', url: URL.createObjectURL(f) };
      const probe = new Audio();
      probe.preload = 'metadata';
      probe.src = t.url;
      probe.onloadedmetadata = () => { t.duration = probe.duration; if (route().name === 'local') render(); };
      return t;
    });
    localTracks = localTracks.concat(added);
    e.target.value = '';
    if (added.length) toast(`Added ${added.length} file${added.length > 1 ? 's' : ''}`);
    if (route().name === 'local') render();
  });

  // ---------- views ----------
  const main = $('#main');

  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    const [path, query = ''] = h.split('?');
    const [name, ...rest] = path.split('/');
    return { name: name || 'home', arg: decodeURIComponent(rest.join('/')), q: new URLSearchParams(query).get('q') || '' };
  }

  const skeletonCards = (n = 6) => `<div class="cards">${Array.from({ length: n }, () =>
    `<div class="card"><div class="card-art skel"></div><div class="skel" style="height:14px;width:80%"></div><div class="skel" style="height:12px;width:50%;margin-top:8px"></div></div>`).join('')}</div>`;
  const skeletonRows = (n = 8) => Array.from({ length: n }, () =>
    `<div class="track" style="cursor:default"><div></div><div class="t-main"><div class="skel" style="width:40px;height:40px"></div><div style="flex:1"><div class="skel" style="height:13px;width:60%"></div><div class="skel" style="height:11px;width:35%;margin-top:6px"></div></div></div></div>`).join('');
  const errorBox = (msg) => `<div class="error-box"><p>${esc(msg)}</p><button class="btn" data-reload>Try again</button></div>`;
  const emptyState = (ic, title, body, cta = '') => `<div class="empty">${icon(ic)}<h2>${esc(title)}</h2><p>${esc(body)}</p>${cta}</div>`;

  function cards(key, tracks, all = false) {
    registerList(key, tracks);
    return `<div class="cards${all ? ' all' : ''}">${tracks.map((t, i) => `
      <div class="card" data-list="${esc(key)}" data-idx="${i}" tabindex="0" role="button" aria-label="Play ${esc(t.title)}">
        <div class="card-art"><img src="${esc(t.art || PLACEHOLDER_ART)}" alt="" loading="lazy">
          <button class="play-btn" data-play-list="${esc(key)}" data-start="${i}" aria-label="Play">${icon('play')}</button></div>
        <div class="card-title">${esc(t.title)}</div>
        <div class="card-sub">${esc(t.artist)}</div>
      </div>`).join('')}</div>`;
  }

  function greeting() {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }

  let renderToken = 0;
  async function render() {
    const token = ++renderToken;
    const stale = () => token !== renderToken;
    const r = route();
    lists.clear();
    closeMenu();
    document.querySelectorAll('#nav a').forEach((a) => a.classList.toggle('active', a.dataset.route === r.name));
    renderLibrary();

    if (r.name === 'home') {
      const shelves = [['Trending now', null], ...HOME_GENRES.map((g) => [g, g])];
      main.innerHTML = `<div class="view"><div class="view-head"><h1 style="margin-bottom:4px">${greeting()}</h1>
        <p style="color:var(--muted);margin:0 0 24px">Free music from independent artists</p></div>
        ${shelves.map(([title, g], i) => `<section class="shelf" id="shelf-${i}">
          <div class="shelf-head"><h2>${esc(title)}</h2><a href="#/genre/${encodeURIComponent(g || 'All')}">Show all</a></div>
          ${skeletonCards()}</section>`).join('')}
        <p style="color:var(--muted);font-size:12px">Music from <a href="https://audius.co" rel="noopener" style="text-decoration:underline">Audius</a> artists · <a href="about.html" style="text-decoration:underline">About · Privacy · Terms</a></p></div>`;
      shelves.forEach(([title, g], i) => {
        trending(g, 14).then((tracks) => {
          if (stale()) return;
          const el = $(`#shelf-${i}`);
          if (!tracks.length) return el.remove();
          el.querySelector('.cards').outerHTML = cards(`home-${i}`, tracks);
          refreshPlaying();
        }).catch(() => {
          if (stale()) return;
          $(`#shelf-${i}`).querySelector('.cards').outerHTML = errorBox('Couldn’t load this shelf.');
        });
      });
    }

    else if (r.name === 'genre') {
      const g = r.arg === 'All' ? null : r.arg;
      const color = (GENRES.find(([n]) => n === g) || [, '#3b2a12'])[1];
      main.innerHTML = `<div class="hero" style="--hero:${color}"><div><div class="hero-kicker">Genre</div><h1>${esc(g || 'Trending now')}</h1>
        <div class="hero-sub">What independent artists are playing right now</div></div></div>
        <div class="actions"><button class="play-btn big" data-play-list="genre" aria-label="Play">${icon('play')}</button></div>
        <div class="view" id="list">${skeletonRows()}</div>`;
      try {
        const tracks = await trending(g, 50);
        if (stale()) return;
        $('#list').innerHTML = tracks.length ? trackRows('genre', tracks) : emptyState('music', 'Nothing here yet', 'No trending tracks for this genre.');
      } catch { if (!stale()) $('#list').innerHTML = errorBox('Couldn’t load tracks.'); }
    }

    else if (r.name === 'search') {
      main.innerHTML = `<div class="view">
        <div class="search-box">${icon('search')}<input id="q" type="search" placeholder="Search songs, artists, moods" value="${esc(r.q)}" autocomplete="off" aria-label="Search"></div>
        <div id="results"></div></div>`;
      const input = $('#q');
      const results = $('#results');
      const showBrowse = () => {
        results.innerHTML = `<h2 style="font-size:22px;margin:0 0 16px">Browse all</h2><div class="genres">${GENRES.map(([g, c]) =>
          `<a class="genre-tile" href="#/genre/${encodeURIComponent(g)}" style="background:${c}">${esc(g)}</a>`).join('')}</div>`;
      };
      let timer, qToken = 0;
      const run = async (q) => {
        q = q.trim();
        history.replaceState(null, '', q ? `#/search?q=${encodeURIComponent(q)}` : '#/search');
        if (!q) return showBrowse();
        const mine = ++qToken;
        results.innerHTML = skeletonRows(6);
        try {
          const tracks = await searchTracks(q);
          if (mine !== qToken || stale()) return;
          lists.clear();
          results.innerHTML = tracks.length
            ? `<h2 style="font-size:22px;margin:0 0 12px">Songs</h2>${trackRows('search', tracks)}`
            : emptyState('search', `Nothing found for “${q}”`, 'Try another spelling, or a genre or mood instead.');
          refreshPlaying();
        } catch { if (mine === qToken) results.innerHTML = errorBox('Search failed.'); }
      };
      input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => run(input.value), 300); });
      input.focus();
      if (r.q) run(r.q); else showBrowse();
      return;
    }

    else if (r.name === 'liked') {
      main.innerHTML = `<div class="hero" style="--hero:#7a4a10"><div class="hero-art liked">${icon('heartFill')}</div><div>
        <div class="hero-kicker">Your songs</div><h1>Favourites</h1><div class="hero-sub">${S.liked.length} songs</div></div></div>
        ${S.liked.length ? `<div class="actions"><button class="play-btn big" data-play-list="liked" aria-label="Play">${icon('play')}</button></div>` : ''}
        <div class="view">${S.liked.length ? trackRows('liked', S.liked)
          : emptyState('heart', 'Nothing saved yet', 'Tap the heart on any song and it lands here.', '<a class="btn primary" href="#/search">Go find something</a>')}</div>`;
    }

    else if (r.name === 'playlist') {
      const p = S.playlists.find((x) => x.id === r.arg);
      if (!p) { main.innerHTML = `<div class="view">${emptyState('list', 'Playlist not found', 'It may have been deleted.', '<a class="btn primary" href="#/">Go home</a>')}</div>`; return; }
      const art = p.tracks[0]?.art;
      main.innerHTML = `<div class="hero" style="--hero:#2a3550">${art ? `<img class="hero-art" src="${esc(art)}" alt="">` : `<div class="hero-art">${icon('music')}</div>`}<div>
        <div class="hero-kicker">Playlist</div><h1>${esc(p.name)}</h1><div class="hero-sub">${p.tracks.length} songs · ${fmt(p.tracks.reduce((s, t) => s + (t.duration || 0), 0))}</div></div></div>
        <div class="actions">
          ${p.tracks.length ? `<button class="play-btn big" data-play-list="playlist" aria-label="Play">${icon('play')}</button>` : ''}
          <button class="btn" id="pl-rename">Rename</button><button class="btn" id="pl-delete">Delete</button></div>
        <div class="view">${p.tracks.length ? trackRows('playlist', p.tracks, { playlistId: p.id })
          : emptyState('music', 'This playlist is empty', 'Use the ⋯ menu on any song to add it here.', '<a class="btn primary" href="#/search">Go find something</a>')}</div>`;
      $('#pl-rename').onclick = () => {
        const name = prompt('Rename playlist', p.name);
        if (name && name.trim()) { p.name = name.trim().slice(0, 80); store.save(); render(); }
      };
      $('#pl-delete').onclick = () => {
        if (!confirm(`Delete “${p.name}”? This can’t be undone.`)) return;
        S.playlists = S.playlists.filter((x) => x.id !== p.id); store.save();
        toast('Playlist deleted'); location.hash = '#/';
      };
    }

    else if (r.name === 'queue') {
      const t = current();
      const upcoming = P.order.slice(P.pos + 1).map((i) => P.queue[i]);
      main.innerHTML = `<div class="view"><div class="view-head"><h1>Queue</h1></div>
        ${t ? `<h2 style="font-size:16px;color:var(--muted)">Now playing</h2>${trackRows('q-now', [t])}
          <h2 style="font-size:16px;color:var(--muted);margin-top:32px">Next up</h2>
          ${upcoming.length ? trackRows('q-next', upcoming) : '<p style="color:var(--muted)">Nothing queued after this song.</p>'}`
        : emptyState('queue', 'Nothing lined up', 'Play something and what comes next shows up here.', '<a class="btn primary" href="#/">Browse music</a>')}</div>`;
      // Clicking an upcoming row jumps within the current queue instead of replacing it.
      main.querySelectorAll('.track[data-list="q-next"]').forEach((row) => row.addEventListener('click', (e) => {
        if (e.target.closest('button')) return;
        e.stopPropagation();
        P.pos += Number(row.dataset.idx) + 1; load(true);
      }, true));
    }

    else if (r.name === 'local') {
      main.innerHTML = `<div class="hero" style="--hero:#1f3d33"><div class="hero-art">${icon('folder')}</div><div>
        <div class="hero-kicker">Library</div><h1>Local files</h1><div class="hero-sub">Play music from your computer. Files stay on your device.</div></div></div>
        <div class="actions">${localTracks.length ? `<button class="play-btn big" data-play-list="local" aria-label="Play">${icon('play')}</button>` : ''}
          <button class="btn primary" id="pick">Add audio files</button></div>
        <div class="view">${localTracks.length ? trackRows('local', localTracks)
          : emptyState('folder', 'No local files yet', 'Add MP3, M4A, OGG, WAV or FLAC files to play them here. They are not uploaded anywhere.')}</div>`;
      $('#pick').onclick = () => $('#file-input').click();
    }

    else { location.hash = '#/'; return; }

    refreshPlaying();
    if (!['search'].includes(r.name)) main.scrollTop = 0;
  }

  // ---------- boot ----------
  hydrateIcons();
  setVolume(typeof S.volume === 'number' ? S.volume : 0.8);
  updateModes();
  updatePlayBtn();
  setFill(seek);
  addEventListener('hashchange', render);
  render();
})();
