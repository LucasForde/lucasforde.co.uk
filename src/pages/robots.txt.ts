import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL("/sitemap.xml", site).href;

  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}
`,
    { headers: { "Content-Type": "text/plain; charset=utf-8" } },
  );
};
