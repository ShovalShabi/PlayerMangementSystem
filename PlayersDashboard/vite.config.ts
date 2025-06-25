import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import getEnvVariables from "./src/etc/load-env-variables";
import dotenv from "dotenv";

dotenv.config({ path: ".env.${import.meta.env.VITE_ENV}" });

const { port } = getEnvVariables();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: port,
  },
  define: {
    "process.env": {
      VITE_PORT: process.env.VITE_PORT,
      VITE_ENV: process.env.VITE_ENV,
      VITE_BACKEND_HOST: process.env.VITE_BACKEND_HOST,
      VITE_BACKEND_PORT: process.env.VITE_BACKEND_PORT,
    },
  },
});
