import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "./manifest.json",
          dest: "",
        },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        gui: "./index.html",
        scripts: "./src/content_script.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].[hash].js",
      },
    },
  },
});

// export default defineConfig(({ mode }) => {
//   if (mode === "scripts") {
//     return {
//       build: {
//         lib: {
//           entry: "./src/content_scripts/index.ts"
//         }
//       }
//     }
//   }
//   return {
//     plugins: [react()],
//   };
// });
