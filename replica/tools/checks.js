// Node ports of replica-design/contrast.py and replica-brand/sweep.py (no Python on this machine).
// Usage: node checks.js contrast <tokens.json> | node checks.js sweep <root> <brand.json>
const fs = require('fs'), path = require('path');
const [mode, a, b] = process.argv.slice(2);

const hex = (h) => { h = h.replace('#', '').toLowerCase(); if (h.length === 3) h = [...h].map((c) => c + c).join(''); return '#' + h; };
const lum = (h) => { const n = hex(h); return [1, 3, 5].map((i) => parseInt(n.slice(i, i + 2), 16) / 255)
  .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((s, c, i) => s + c * [0.2126, 0.7152, 0.0722][i], 0); };

if (mode === 'contrast') {
  const t = JSON.parse(fs.readFileSync(a, 'utf8'));
  const NEEDS = { normal: [4.5, 7], large: [3, 4.5], ui: [3, 3] };
  let fails = 0;
  for (const [fg, bg, size = 'normal'] of t.pairs) {
    const l1 = lum(t.color[fg]), l2 = lum(t.color[bg]);
    const r = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const [aa, aaa] = NEEDS[size];
    const grade = size === 'ui' ? (r >= aa ? 'PASS' : 'FAIL') : r >= aaa ? 'AAA' : r >= aa ? 'AA' : 'FAIL';
    if (r < aa) fails++;
    console.log(`  ${grade.padEnd(5)} ${r.toFixed(2).padStart(5)}:1  ${fg.padEnd(16)} on ${bg.padEnd(14)} ${size === 'normal' ? '' : size}`);
  }
  console.log(`\n  ${t.pairs.length} pairs, ${fails} failing AA`);
  process.exit(fails ? 1 : 0);
}

if (mode === 'sweep') {
  const cfg = JSON.parse(fs.readFileSync(b, 'utf8'));
  const SKIP = new Set(['.git', 'node_modules', 'dist', 'build', 'out', '.vercel', '.netlify', '.cache']);
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pats = [
    ...cfg.avoid.map((n) => ['name', n, new RegExp(n.split(/[\s_-]+/).map(esc).join('[\\s_-]?'), 'i')]),
    ...cfg.domains.map((d) => ['domain', d, new RegExp(esc(d), 'i')]),
  ];
  const cols = new Set(cfg.colors.map(hex));
  const HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![0-9a-zA-Z])/g;
  const hits = [];
  const root = path.resolve(a);
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((x, y) => x.name.localeCompare(y.name))) {
      const rel = path.relative(root, path.join(dir, e.name));
      if (e.isDirectory()) {
        if (SKIP.has(e.name) || (e.name === 'replica' && dir === root)) continue;
        pats.forEach(([k, l, rx]) => k === 'name' && rx.test(e.name) && hits.push(`path    ${l.padEnd(18)} ${rel}/  folder name`));
        walk(path.join(dir, e.name));
        continue;
      }
      if (!e.isFile()) continue;
      pats.forEach(([k, l, rx]) => k === 'name' && rx.test(e.name) && hits.push(`path    ${l.padEnd(18)} ${rel}  file name`));
      const buf = fs.readFileSync(path.join(dir, e.name));
      if (buf.subarray(0, 4096).includes(0) || /\.(png|jpe?g|gif|webp|ico|woff2?|ttf|mp3|wav)$/i.test(e.name)) continue;
      buf.toString('utf8').split(/\r?\n/).forEach((line, i) => {
        pats.forEach(([k, l, rx]) => rx.test(line) && hits.push(`${k.padEnd(7)} ${l.padEnd(18)} ${rel}:${i + 1}  ${line.trim().slice(0, 120)}`));
        for (const m of line.matchAll(HEX)) if (cols.has(hex(m[0]))) hits.push(`color   ${hex(m[0]).padEnd(18)} ${rel}:${i + 1}  ${line.trim().slice(0, 120)}`);
      });
    }
  })(root);
  console.log(hits.length ? hits.join('\n') + `\n\n${hits.length} hits. Replace every one before you launch.` : "Clean. Nothing of the original's name, domain or colours found.");
  process.exit(hits.length ? 1 : 0);
}
