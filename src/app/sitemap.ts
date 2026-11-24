import type { MetadataRoute } from "next";
import { getNotes } from "@/lib/content";
export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "/",
    "/about/",
    ...getNotes().map((note) => `/notes/${note.slug}/`),
  ].map((route) => ({ url: `https://luohaijiang789.github.io${route}` }));
}
