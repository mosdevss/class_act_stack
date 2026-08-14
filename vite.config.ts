// import { defineConfig } from 'vite'
//
// import { tanstackStart } from '@tanstack/react-start/plugin/vite'
//
// import viteReact from '@vitejs/plugin-react'
//   const isProd = mode === 'production';
//   const BASE = isProd ? '/your-repo-name/' : '/';
//
// const config = defineConfig({
//   resolve: { tsconfigPaths: true },
//   preview: {
//     host: '127.0.0.1',
//   },
//   plugins: [
//     tanstackStart({
//         router: {
//           basepath: BASE,
//         },
//         client: {
//           base: BASE,
//         },
//       prerender: {
//         enabled: true,
//         crawlLinks: true,
//       },
//     }),
//     viteReact(),
//   ],
// })
//
// export default config

// vite.config.ts
import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const BASE = isProd ? '/class_act_stack/' : '/';

  return {
    base: BASE,

    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),

      tanstackStart({
        router: {
          basepath: BASE,
        },
        client: {
          base: BASE,
        },
        prerender: {
          enabled: true,
          crawlLinks: true,
        },
      }),

      react(),
    ],
  };
});
