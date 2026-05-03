import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const notesCollection = defineCollection({
  loader: glob({ base: "src/content/notes", pattern: "**/*.{md,mdx}" }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      author: z.string(),
      isDraft: z.boolean().default(false),
    }),
});

export const collections = {
  notes: notesCollection,
};
