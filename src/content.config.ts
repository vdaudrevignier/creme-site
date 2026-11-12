import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const i18nText = z.object({ fr: z.string().optional(), en: z.string().optional() });

const members = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/members' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      order: z.number().int(),
      photo: image(),
      bio: i18nText.optional(),
      links: z
        .object({
          instagram: z.url(),
          soundcloud: z.url(),
          mixcloud: z.url(),
          bandcamp: z.url(),
          facebook: z.url(),
          website: z.url(),
        })
        .partial()
        .default({}),
      embed: z.object({ provider: z.enum(['soundcloud', 'mixcloud']), src: z.url() }).optional(),
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
