// One-shot import of the content of the old Cargo site (creme.cargo.site).
// Usage: node scripts/import-cargo.mjs
// Writes members to src/content/members/*.md, past events to src/content/events/*.yaml,
// and downloads every image into src/assets/. Review the output by hand afterwards.
//
// ⚠ Already run once (Nov. 2026); the generated files were then edited by hand
// (event titles/dates/lineups, poster file names). Re-running overwrites those edits.
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { stringify } from 'yaml';
import { BASE, fetchText, mediaIndex, mediaUrl, pageContent } from './cargo-lib.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = join(ROOT, 'src/assets');
const CONTENT = join(ROOT, 'src/content');

// Manual fixes applied on top of the scraped text.
const TEXT_FIXES = [['Oiginal', 'Original']];
// Former members still listed on Cargo, not to be imported.
const EXCLUDED = new Set(['maxius']);

const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&quot;', '"')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');

const toText = (html) =>
  decode(
    html
      .replace(/<br\s*\/?>|<\/div>/gi, '\n')
      .replace(/<(iframe|media-item|gallery-justify)[\s\S]*?<\/\1>/gi, '')
      .replace(/<[^>]+>/g, ''),
  )
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .join('\n');

const slugify = (s) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const applyFixes = (s) => TEXT_FIXES.reduce((acc, [a, b]) => acc.replaceAll(a, b), s);

const MAX_BYTES = 1.5 * 1024 * 1024;

/** Downloads `url` to `dest` (extension-less); re-encodes heavy files to WebP. Returns the path written. */
async function download(url, dest, ext) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  let buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    buf = await sharp(buf)
      .resize({ width: 2000, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();
    ext = '.webp';
  }
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest + ext, buf);
  return ext;
}

function extOf(name) {
  const e = extname(name).toLowerCase();
  return e === '.jpeg' ? '.jpg' : e || '.jpg';
}

const LINK_KINDS = [
  ['instagram', /instagram\.com/],
  ['soundcloud', /soundcloud\.com/],
  ['youtube', /youtube\.com|youtu\.be/],
  ['mixcloud', /mixcloud\.com/],
  ['bandcamp', /bandcamp\.com/],
  ['facebook', /facebook\.com|fb\.me/],
];

function extractLinks(html) {
  const links = {};
  for (const m of html.matchAll(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const [, href, inner] = m;
    // Only anchors that display a URL are profile links; others are leftovers or bio mentions.
    if (!/https?:\/\//.test(inner)) continue;
    const kind = LINK_KINDS.find(([, re]) => re.test(href))?.[0] ?? 'website';
    links[kind] ??= href.replace(/\?hl=fr$/, '').replace(/\/tracks$/, '');
  }
  return links;
}

function extractEmbed(html) {
  const m =
    /<(?:media-item|iframe)[^>]*src="(https:\/\/(?:w\.soundcloud\.com|player-widget\.mixcloud\.com)[^"]+)"/.exec(
      html,
    );
  if (!m) return undefined;
  const src = decode(m[1]).replace('auto_play=true', 'auto_play=false');
  return { provider: src.includes('mixcloud') ? 'mixcloud' : 'soundcloud', src };
}

// Gig lists are laid out as consecutive lines: "DD.MM.YY", "CITY", "@ Venue".
function extractGigs(text) {
  const lines = text.split('\n').filter(Boolean);
  const gigs = [];
  lines.forEach((line, i) => {
    const d = /^(\d{2})\.(\d{2})\.(\d{2})$/.exec(line);
    const city = lines[i + 1];
    const venue = lines[i + 2];
    if (d && city && venue?.startsWith('@')) {
      gigs.push({ date: `20${d[3]}-${d[2]}-${d[1]}`, city, venue: venue.replace(/^@\s*/, '') });
    }
  });
  return gigs;
}

function extractBio(html, name) {
  const head = html.split(/<hr\s*\/?>/i)[0];
  // Drop anchors whose text is just a URL (they become `links`), keep the others' text.
  const cleaned = head.replace(/<a [^>]*>([\s\S]*?)<\/a>/g, (_, inner) =>
    inner.replace(/https?:\/\/\S+/g, ''),
  );
  const lines = toText(cleaned).split('\n');
  const first = lines.findIndex((l) => l);
  if (first >= 0 && lines[first].toLowerCase() === name.toLowerCase()) lines.splice(first, 1);
  return applyFixes(
    lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim(),
  );
}

async function main() {
  const homeHtml = await fetchText(BASE);
  const home = pageContent(homeHtml, 'homepage');
  const homeMedia = mediaIndex(homeHtml);

  // --- Members -----------------------------------------------------------
  const memberRe =
    /hash="([A-Z0-9]+)"[^>]*href="([^"]+)" [^>]*rel="history"[\s\S]*?<figcaption[^>]*>([^<]+)</g;
  let order = 0;
  for (const [, photoHash, cargoSlug, caption] of home.matchAll(memberRe)) {
    const slug = slugify(cargoSlug.replace(/-\d+$/, ''));
    if (EXCLUDED.has(slug)) continue;
    order += 1;
    const html = await fetchText(`${BASE}/${cargoSlug}`);
    const content = pageContent(html, cargoSlug) ?? '';
    const media = { ...homeMedia, ...mediaIndex(html) };
    const name =
      toText(/<h2>([\s\S]*?)(<br|<\/h2>)/.exec(content)?.[1] ?? caption).trim() || caption;

    const photo = media[photoHash];
    const photoBase = `members/${slug}`;
    const photoFile =
      photoBase +
      (await download(mediaUrl(photoHash, photo.name), join(ASSETS, photoBase), extOf(photo.name)));

    const gallery = [];
    for (const [i, [, h]] of [
      ...content.matchAll(/class="zoomable" hash="([A-Z0-9]+)"/g),
    ].entries()) {
      const img = media[h];
      if (!img) continue;
      const base = `members/${slug}/${String(i + 1).padStart(2, '0')}`;
      const ext = await download(mediaUrl(h, img.name), join(ASSETS, base), extOf(img.name));
      gallery.push(`../../assets/${base}${ext}`);
    }

    const bio = extractBio(content, name);
    const data = {
      name: caption.trim(),
      order,
      photo: `../../assets/${photoFile}`,
      bio: bio ? { en: bio } : undefined,
      links: extractLinks(content),
      embed: extractEmbed(content),
      gigs: extractGigs(toText(content)),
      gallery,
    };
    const fm = stringify(JSON.parse(JSON.stringify(data)), { lineWidth: 0 });
    await mkdir(join(CONTENT, 'members'), { recursive: true });
    await writeFile(join(CONTENT, 'members', `${slug}.md`), `---\n${fm}---\n`);
    console.log(`member  ${slug}  (${gallery.length} photos, ${data.gigs.length} gigs)`);
  }

  // --- Past events (poster marquee on the homepage) ----------------------
  const marquee = /<marquee-set[\s\S]*?<\/marquee-set>/.exec(home)?.[0] ?? '';
  let n = 0;
  for (const [, hash, url] of marquee.matchAll(/hash="([A-Z0-9]+)" href="([^"]+)"/g)) {
    const img = homeMedia[hash];
    if (!img) continue;
    n += 1;
    const id = `cargo-${String(n).padStart(2, '0')}`;
    const base = `events/${id}`;
    const file =
      base + (await download(mediaUrl(hash, img.name), join(ASSETS, base), extOf(img.name)));
    await mkdir(join(CONTENT, 'events'), { recursive: true });
    await writeFile(
      join(CONTENT, 'events', `${id}.yaml`),
      stringify({ title: 'TODO', url, poster: `../../assets/${file}`, _cargoFile: img.name }),
    );
    console.log(`event   ${id}  ${url}  (${img.name})`);
  }

  // --- Homepage logo ----------------------------------------------------
  const logo = /<h1><img[^>]*src="([^"]+)"/.exec(home)?.[1];
  if (logo) {
    await download(decode(logo), join(ASSETS, 'logo'), '.png');
    console.log('logo    src/assets/logo.png');
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
