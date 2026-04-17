// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Used for canonical URLs + OG meta tags. Override via ASTRO_SITE env var
  // (or edit this line) when deploying to a different origin.
  site: process.env.ASTRO_SITE ?? 'https://india-population.pages.dev',
});
