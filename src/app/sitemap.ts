import type { MetadataRoute } from "next";

const routes = [
  "",
  "/programs",
  "/teachers",
  "/news",
  "/notices",
  "/location",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://child-center.example.com";

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
