import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Panel, Rule, Datum } from "@/components/ui/Panel";
import { ButtonLink, Arrow } from "@/components/ui/Button";
import { SplitText } from "@/components/motion/SplitText";
import { nav } from "@/lib/site.config";

export const metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="page-x flex min-h-[78vh] items-center py-32">
      <div className="bay grid w-full gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <Datum className="pulse-dot" />
            <span className="meta-bright">404 · no route matched</span>
            <Rule className="w-16" />
          </div>
          <h1 className="t-h1 mb-6 font-display">
            <SplitText text="Nothing resolves" />
            <br />
            <SplitText
              text="at this path."
              delay={0.16}
              wordClassName="flare-text"
            />
          </h1>
          <p className="t-lead mb-9 max-w-lg">
            A moved URL, a typo, or a link that outlived the thing it pointed at.
            Everything the site does is reachable from the list here.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/" variant="flare" size="lg">
              Back to home
              <Arrow />
            </ButtonLink>
            <ButtonLink href="/contact" variant="glass" size="lg">
              Tell us what broke
            </ButtonLink>
          </div>
        </div>

        <Panel marks className="p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <span className="meta-bright">Routes</span>
            <Logo size={28} animate />
          </div>
          <ul>
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group/btn flex items-baseline gap-3 py-3 transition-colors hover:text-flare-hi"
                >
                  <span className="font-mono text-[0.625rem] tabular-nums text-flare/70">
                    {item.index}
                  </span>
                  <span className="text-[0.9375rem]">{item.label}</span>
                  <span className="ml-auto">
                    <Arrow />
                  </span>
                </Link>
                {i < nav.length - 1 && <Rule />}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
