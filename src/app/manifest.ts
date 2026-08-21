import type { MetadataRoute } from "next";
import { site } from "@/lib/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#0d0e12",
    theme_color: "#0d0e12",
    lang: "en-IN",
    dir: "ltr",
    categories: ["business", "productivity", "developer"],
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
    shortcuts: [
      { name: "Pricing", short_name: "Pricing", url: "/pricing" },
      { name: "Services", short_name: "Services", url: "/services" },
      { name: "Contact", short_name: "Contact", url: "/contact" },
    ],
  };
}
