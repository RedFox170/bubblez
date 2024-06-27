import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log("Loaded environment variables:", env); // Debugging-Zwecke

  return {
    plugins: [react()],
    define: {
      "process.env": {
        VITE_API_URL: env.VITE_API_URL,
      },
    },
  };
});
