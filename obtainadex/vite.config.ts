import { defineConfig, HmrContext } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import { exec } from "node:child_process";

// custom plugin to re-build tailwind css on hot reload
const rebuildTailwindcss = {
  name: "rebuild-tailwindcss",
  handleHotUpdate({ file, server }: HmrContext) {
    exec("deno task tailwind", (err, _stdout, stderr) => {
      if (err) {
        console.error(`Error executing command on reload for ${file}:`, stderr);
      }

      server.ws.send({
        type: "full-reload",
        path: "*",
      });
    });
  },
};

// https://vite.dev/config/
export default defineConfig({
  base: Deno.env.get("NODE_ENV") === "production" ? "obtainadex" : "/",
  plugins: [rebuildTailwindcss, deno(), react()],
});
