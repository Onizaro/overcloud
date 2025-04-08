import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
 base: "/",
 plugins: [react()],
 preview: {
  port: 8080,
 },
 server: {
  port: 8080,
  host: true,
  origin: "http://0.0.0.0:8080",
 },
});