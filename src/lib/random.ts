// Small client-side helpers for the random meme bits.

export const pickOne = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)]!;

/** `n` distinct random items. */
export function pickMany<T>(items: readonly T[], n: number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return pool.slice(0, n);
}

/** Reads JSON stored in a `data-*` attribute, or null. */
export function readData<T>(el: Element | null, key: string): T | null {
  const raw = el?.getAttribute(`data-${key}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
