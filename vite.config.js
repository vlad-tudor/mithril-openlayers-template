import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import m from "mithril";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "@babel/plugin-transform-react-jsx",
            {
              pragma: "m",
              pragmaFrag: "'['",
            },
          ],
        ],
      },
    }),
  ],
  build: {
    sourcemap: true,
  },
});

// export default {
//   build: {
//     sourcemap: true,
//   },
// };
