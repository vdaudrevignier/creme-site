// Helpers to read the data Cargo (creme.cargo.site) embeds in its HTML pages.
export const BASE = 'https://creme.cargo.site';

export async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

/** Raw HTML content of the Cargo page whose purl is `slug`, or null. */
export function pageContent(html, slug) {
  const marker = `"purl":"${slug}"`;
  const i = html.indexOf(marker);
  if (i < 0) return null;
  const m = /"content":("(?:[^"\\]|\\.)*")/.exec(html.slice(i));
  return m ? JSON.parse(m[1]) : null;
}

/** Map of media hash -> { name, width, height }. */
export function mediaIndex(html) {
  const out = {};
  for (const m of html.matchAll(
    /"name":"([^"]+)","hash":"([A-Z0-9]+)","width":(\d+),"height":(\d+)/g,
  )) {
    out[m[2]] = { name: m[1], width: +m[3], height: +m[4] };
  }
  return out;
}

export const mediaUrl = (hash, name) => `https://freight.cargo.site/w/1500/i/${hash}/${name}`;
