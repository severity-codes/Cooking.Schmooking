import { defineConfig } from "vite";
import React from "@vitejs/plugin-react"; // Capitalized React to follow common conventions

// Example target URL
const targetURL = "http://localhost:9080";

// Validate the target URL
if (!targetURL.startsWith("http://localhost:9080")) {
  throw new Error("Proxy target does not start with 'http://localhost:9080'");
}

// Define the proxy configuration using the validated targetURL
const proxyConfig = {
  "/api": {
    target: targetURL,
    changeOrigin: true,
  },
  "/auth": {
    target: targetURL, // Use variable to avoid redundancy
    changeOrigin: true,
  },
};

// Export the Vite configuration
export default defineConfig({
  plugins: [React()],
  server: {
    proxy: proxyConfig,
  },
});
