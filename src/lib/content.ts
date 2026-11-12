import { getCollection, type CollectionEntry } from 'astro:content';

export type Member = CollectionEntry<'members'>;
export type Event = CollectionEntry<'events'>;

export async function getMembers(): Promise<Member[]> {
  const members = await getCollection('members');
  return members.sort((a, b) => a.data.order - b.data.order);
}

/** Events split at build time: upcoming (soonest first) and past (latest first). */
export async function getEvents(now = new Date()) {
  const events = await getCollection('events');
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const upcoming = events
    .filter((e) => e.data.date.getTime() >= today)
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  const past = events
    .filter((e) => e.data.date.getTime() < today)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
  return { upcoming, past };
}

export const SOCIALS = {
  facebook: 'https://www.facebook.com/cremedjcrew/',
  instagram: 'https://www.instagram.com/cremedjcrew/',
  email: 'cremedjcrew@gmail.com',
} as const;

/** YouTube playlist compiling every C.R.E.M.E set ("C.R.E.M.E. DJ Crew Allstars"). */
export const SETS_PLAYLIST = {
  id: 'PLbVTv_Ez0D_Q',
  url: 'https://www.youtube.com/playlist?list=PLbVTv_Ez0D_Q',
} as const;

export type DjSet = { videoId: string; title: string; author: string; published: Date };

const decodeXml = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

let setsCache: Promise<DjSet[]> | undefined;

/**
 * Sets of the playlist, fetched from YouTube's RSS feed at build time (no API key).
 * The feed only exposes the 15 latest videos. Returns [] on failure so the page
 * falls back to the bare playlist player instead of breaking the build.
 */
export function getSets(): Promise<DjSet[]> {
  setsCache ??= (async () => {
    try {
      const res = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${SETS_PLAYLIST.id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const xml = await res.text();
      const tag = (entry: string, name: string) =>
        entry.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1]?.trim() ?? '';
      return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
        .map(([, entry]) => ({
          videoId: tag(entry, 'yt:videoId'),
          title: decodeXml(tag(entry, 'title')),
          author: decodeXml(tag(entry, 'name')),
          published: new Date(tag(entry, 'published')),
        }))
        .filter((s) => /^[\w-]{11}$/.test(s.videoId));
    } catch (err) {
      console.warn(`[sets] could not load the YouTube playlist feed: ${err}`);
      return [];
    }
  })();
  return setsCache;
}
