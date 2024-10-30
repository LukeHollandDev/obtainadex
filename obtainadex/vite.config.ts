import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: Deno.env.get("NODE_ENV") === "production" ? "obtainadex" : "/",
  plugins: [deno(), react()],
});
