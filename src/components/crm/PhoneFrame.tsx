import Image from "next/image";
import { cn } from "@/lib/utils";

/* ==========================================================================
   PHONE FRAME — a real screenshot in a plain device outline.

   No fake device photo and no mocked-up interface: the screen is a capture
   from the app running on a phone, at the phone's own 9:20 ratio, so what a
   visitor sees is what a rep will see after installing it.
   ========================================================================== */

export function PhoneFrame({
  src,
  alt,
  priority,
  className,
  sizes = "(min-width: 1024px) 260px, 60vw",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        /* A fixed near-black bezel, not a theme token: a phone does not turn
           white when the site switches to dark mode. */
        "relative rounded-[2.2rem] border border-white/10 bg-[#111318] p-[0.45rem] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      <div className="relative aspect-[9/20] overflow-hidden rounded-[1.8rem] bg-page">
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      </div>
    </div>
  );
}
