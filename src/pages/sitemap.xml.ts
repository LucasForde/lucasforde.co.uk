import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const homepageUrl = new URL("/", site).href;

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${homepageUrl}</loc>
  </url>
</urlset>
`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
