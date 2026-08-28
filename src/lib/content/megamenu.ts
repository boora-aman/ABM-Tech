import { getServices, getIndustries, getPillars } from "./repo";

/* ==========================================================================
   MEGA MENU

   Built on the server from the same repo the pages read, so a service renamed
   in the admin is renamed in the header without a redeploy. Shaped here rather
   than in the Header component because the Header is a client component and
   cannot touch the database.

   Deliberately small: the panel shows the six systems with their services
   nested, and the sectors as a plain list. A header menu that mirrors the
   whole sitemap is a sitemap, not a menu.
   ========================================================================== */

export type MenuLink = { href: string; label: string; note?: string };
export type MenuColumn = { title: string; links: MenuLink[] };
export type MenuPanel = {
  /** Matches the nav item's href. */
  key: string;
  columns: MenuColumn[];
  /** Promoted link shown at the foot of the panel. */
  footer?: MenuLink;
};

export async function getMenuPanels(): Promise<MenuPanel[]> {
  const [services, industries, pillars] = await Promise.all([
    getServices(),
    getIndustries(),
    getPillars(),
  ]);

  const byPillar = (key: string) => services.filter((s) => s.pillar === key);

  /* Services, grouped by the business loop each one fixes — the same grouping
     the /services page uses, so the header teaches the structure of the site
     rather than presenting a flat list of thirteen names. */
  const serviceColumns: MenuColumn[] = pillars
    .map((p) => ({
      title: p.name,
      links: byPillar(p.key).map((s) => ({
        href: `/services/${s.slug}`,
        label: s.title,
        note: s.short,
      })),
    }))
    .filter((c) => c.links.length > 0);

  const run = byPillar("run");
  if (run.length) {
    serviceColumns.push({
      title: "Keep it running",
      links: run.map((s) => ({
        href: `/services/${s.slug}`,
        label: s.title,
        note: s.short,
      })),
    });
  }

  /* Twelve sectors split into even columns so the panel stays rectangular at
     any breakpoint rather than leaving one stubby trailing column. */
  const per = Math.ceil(industries.length / 3);
  const industryColumns: MenuColumn[] = [0, 1, 2]
    .map((i) => ({
      title: i === 0 ? "Sectors" : "",
      links: industries.slice(i * per, (i + 1) * per).map((ind) => ({
        href: "/industries",
        label: ind.name,
      })),
    }))
    .filter((c) => c.links.length > 0);

  return [
    {
      key: "/services",
      columns: serviceColumns,
      footer: { href: "/pricing", label: "See every price in the open" },
    },
    {
      key: "/industries",
      columns: industryColumns,
      footer: { href: "/industries", label: "How we work in your sector" },
    },
  ];
}
