import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

// Loads ANTHROPIC_API_KEY from .env for local development only.
function loadEnv() {
  try {
    const raw = fs.readFileSync(".env", "utf8");
    raw.split("\n").forEach((line) => {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2];
    });
  } catch (e) {}
}
loadEnv();

// Dev only middleware that mirrors the Vercel serverless proxy.
function localApi() {
  return {
    name: "local-api",
    configureServer(server) {
      server.middlewares.use("/api/analyze", (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          return res.end("Method not allowed");
        }
        let body = "";
        req.on("data", (c) => (body += c));
        req.on("end", async () => {
          try {
            const upstream = await fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "x-api-key": process.env.ANTHROPIC_API_KEY || "",
                "anthropic-version": "2023-06-01",
              },
              body,
            });
            const data = await upstream.text();
            res.statusCode = upstream.status;
            res.setHeader("content-type", "application/json");
            res.end(data);
          } catch (e) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: "Local proxy failed" }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApi()],
});
