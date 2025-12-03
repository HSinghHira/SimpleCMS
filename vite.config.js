import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "https://simplecms.hira.im",
  plugins: [react()],
});
