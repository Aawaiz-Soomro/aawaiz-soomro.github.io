import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { imagetools } from "vite-imagetools";
import WebfontDownload from "vite-plugin-webfont-dl";

export default defineConfig({
  plugins: [
    tsconfigPaths() as unknown as PluginOption,
    svgr() as unknown as PluginOption,
    react(),
    imagetools(),
    ViteImageOptimizer({
      jpg: {
        quality: 80,
      },
      png: {
        quality: 80,
      },
      webp: {
        lossless: true,
      },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                cleanupNumericValues: false,
                removeViewBox: false, // https://github.com/svg/svgo/issues/1128
              },
            },
          },
          'sortAttrs',
          {
            name: 'addAttributesToSVGElement',
            params: {
              attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
            },
          },
        ],
      },
    }),
    WebfontDownload([
      'https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&display=swap'
    ]),
  ],
  base: "/",
});