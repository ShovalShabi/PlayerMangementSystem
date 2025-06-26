import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react()],
    server: {
      // make sure to coerce to number if needed
      port: Number(env.VITE_PORT),
    },
    define: {
      // expose ALL loaded env vars under process.env...
      "process.env": {
        VITE_BACKEND_HOST: env.VITE_BACKEND_HOST,
        VITE_BACKEND_PORT: env.VITE_BACKEND_PORT,
        VITE_PORT: env.VITE_PORT,
        VITE_ENV: env.VITE_ENV,
      },
    },
  });
};
