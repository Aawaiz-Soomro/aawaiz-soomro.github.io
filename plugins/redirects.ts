import type { Plugin } from "vite";
import map from "../redirects.json";

// Reads redirects.json ({ "slug": "https://target" }) and emits
// dist/<slug>/index.html for each entry, so /<slug> redirects instantly.
export default function redirects(): Plugin {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

  return {
    name: "static-redirects",
    apply: "build",
    generateBundle() {
      for (const [rawSlug, target] of Object.entries(map as Record<string, string>)) {
        const slug = rawSlug.replace(/^\/+|\/+$/g, "");
        if (!slug || !/^https?:\/\//.test(target)) {
          this.error(`Invalid redirect "${rawSlug}" -> "${target}"`);
        }
        const url = escape(target);
        this.emitFile({
          type: "asset",
          fileName: `${slug}/index.html`,
          source: `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting…</title>
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${url}">
<link rel="canonical" href="${url}">
<script>location.replace(${JSON.stringify(target)});</script>
</head>
<body><p>Redirecting to <a href="${url}">${url}</a>…</p></body>
</html>
`,
        });
      }
    },
  };
}
