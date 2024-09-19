import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import mdx from '@mdx-js/rollup';
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    // Use @mdx-js/rollup as the MDX plugin for Vite
    mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter]}),
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
});
