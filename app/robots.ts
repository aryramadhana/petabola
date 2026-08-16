import type { MetadataRoute } from "next";

// Placeholder domain — belum ada domain produksi final saat file ini
// ditulis. Ganti bareng dengan BASE_URL di app/sitemap.ts begitu domain
// aslinya sudah fix.
const BASE_URL = "https://petabola.id";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
