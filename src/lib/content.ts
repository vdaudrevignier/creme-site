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
