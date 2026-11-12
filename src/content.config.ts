import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const i18nText = z.object({ fr: z.string().optional(), en: z.string().optional() });

const embedSchema = z.object({
  provider: z.enum(['soundcloud', 'mixcloud', 'youtube']),
  src: z.url(),
});

const members = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/members' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      order: z.number().int(),
      photo: image(),
      /** Meme caption of the photo: used as alt text and hover tooltip. */
      photoAlt: i18nText.optional(),
      bio: i18nText.optional(),
      links: z
        .object({
          instagram: z.url(),
          soundcloud: z.url(),
          mixcloud: z.url(),
          bandcamp: z.url(),
          youtube: z.url(),
          facebook: z.url(),
          website: z.url(),
        })
        .partial()
        .default({}),
      /** One player or several (shown one under the other). */
      embed: z
        .union([embedSchema, z.array(embedSchema)])
        .optional()
        .transform((e) => (e === undefined ? [] : Array.isArray(e) ? e : [e])),
      gigs: z
        .array(z.object({ date: z.coerce.date(), city: z.string(), venue: z.string() }))
        .default([]),
      gallery: z.array(image()).default([]),
    }),
});

const events = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/events' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      city: z.string(),
      venue: z.string(),
      address: z.string().optional(),
      lineup: z.array(z.string()).default([]),
      url: z.url().optional(),
      poster: image().optional(),
    }),
});

export const collections = { members, events };
