import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { defineConfig, type PreviewServer } from "vite";

function existsInDist(requestUrl: string): boolean {
  let pathname: string;
  try {
    pathname = decodeURIComponent(requestUrl.split("?")[0] ?? "/");
  } catch {
    return false;
  }
  const relative = pathname.replace(/^\/+/, "");
  const candidates = [
    join("dist", relative),
    join("dist", `${relative}.html`),
    join("dist", relative, "index.html"),
  ];
  if (!relative) candidates.unshift(join("dist", "index.html"));
  return candidates.some((candidate) => {
    try {
      return statSync(candidate).isFile();
    } catch {
      return existsSync(candidate) && !candidate.endsWith("/");
    }
  });
}

function notFoundPage() {
  return {
    name: "static-404",
    configurePreviewServer(server: PreviewServer) {
      return () => {
        server.middlewares.use((req, res, next) => {
          if (res.headersSent || existsInDist(req.url ?? "/")) {
            next();
            return;
          }
          const html = readFileSync(join("dist", "404.html"), "utf8");
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(html);
        });
      };
    },
  };
}

export default defineConfig({
  appType: "mpa",
  server: { host: "0.0.0.0", allowedHosts: ["terminal.local"] },
  plugins: [notFoundPage()],
});
