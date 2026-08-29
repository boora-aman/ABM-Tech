"""Render the social markdown FROM src/lib/content/social.ts.

The module is now the authority. This keeps the human-readable markdown in
sync with it — previously the markdown was the source and the module derived,
which broke as soon as a fix (caption truncation, hashtag limits) was applied
to the derived copy.
"""
import json, pathlib, re
from collections import OrderedDict

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOCIAL = ROOT / "social"
d = json.loads((ROOT / "src/lib/content/social.ts").read_text()
               .split("export const socialPosts: SocialPost[] = ", 1)[1].rstrip().rstrip(";"))

def block(p, heading):
    out = [heading, ""]
    if p["hook"]:
        out += [f"**Hook:** {p['hook']}", ""]
    if p["script"]:
        out += ["**Script:**", p["script"], ""]
    out += ["**Caption:**", p["caption"], "",
            f"**Hashtags:** {p['hashtags']}", "",
            "**Image prompt:**", f"> {p['imagePrompt']}", "", "---", ""]
    return "\n".join(out)

# ------------------------------------------------------------------ calendar
cal = [p for p in d if p["source"] == "calendar"]
lib = [p for p in d if p["source"] == "library"]
reels_web = [p for p in d if p["source"] == "reel" and p["group"] == "Website reels"]
reels_map = [p for p in d if p["source"] == "reel" and p["group"] == "Maps reels"]
goog = [p for p in d if p["source"] == "google"]

L = ["""# ABM Tech — 30-Day Content Calendar

**60 posts · 2 per day · Instagram + Facebook**

Read `README.md` first for slot times, the hashtag rules and the image system.

**Hashtags are final, not recipes.** Instagram capped posts and Reels at five
hashtags in December 2025 — over the cap, distribution is suppressed. Every
set below is exactly five, already chosen. Copy them as they are.

**Image prompts are complete.** Each one already carries the master style block
and the negative prompt, so it can be pasted straight into an image model. Text
and the logo go on afterwards in Canva — see `README.md` §5.

**Legend:** `[A]` = 10:30 AM value post · `[B]` = 7:00 PM offer/proof post

---
---
""", ""]

byday = OrderedDict()
for p in cal:
    byday.setdefault(p["day"], []).append(p)
for day, items in byday.items():
    g = items[0]
    L.append(f"## {g['group']} — {g['theme']}\n")
    for p in sorted(items, key=lambda x: x["slot"]):
        tag = "[A]" if "10:30" in p["slot"] else "[B]"
        L.append(block(p, f"### {tag} {p['format']} — {p['title']}"))

L.append("""---
---

# PART 2 — Service post library

**84 posts: six per service across all 13, plus six for the company.**

Different job from the calendar. The calendar is a *rhythm* — what goes out on
a Tuesday. This is *coverage* — everything there is to say about one service.

Drop these into the calendar's `[B]` evening slots, or run one service a week.
Never post six about the same service on consecutive days; the account reads as
a brochure.

The archetype letter on each post is its image style — the six inside a service
never repeat, so a set never looks like six versions of one picture.

---
---
""")
bygrp = OrderedDict()
for p in lib:
    bygrp.setdefault(p["group"], []).append(p)
for grp, items in bygrp.items():
    L.append(f"## {grp}\n")
    for i, p in enumerate(items, 1):
        L.append(block(p, f"### {i} · {p['theme']} · {p['format']}"))

L.append("""---
---

# PART 3 — Reels for the website & company

Six reels covering ABM Tech as a whole. Maps reels are in
`GOOGLE-LISTING-POSTS.md`.

**Rules:** 1080 × 1920, keep text inside the middle 80%, burn in captions
(~70% watch on mute), the first 2 seconds carry the hook, 15–30 seconds, shoot
vertical. Reels are capped at five hashtags too.

---
""")
for i, p in enumerate(reels_web, 1):
    L.append(block(p, f"### Reel {i} · {p['title']}\n\n**Length:** {p['slot']} · **Format:** {p['format']}"))

(SOCIAL / "CONTENT-CALENDAR-30-DAY.md").write_text("\n".join(L))

# -------------------------------------------------------------------- google
G = ["""# Google Listing — Social Posts

Twenty-two posts for the Google Maps / Business Profile offer, plus four reels.
Posts 1–10 are education-led; 11–22 are offer-led with ₹2,500 as the headline.

Space the offer posts roughly one a week. Twelve in quick succession tips the
account from useful into salesy.

**Hashtags are final** — exactly five per post, per Instagram's December 2025
cap. **Image prompts are complete** and can be pasted straight into a model.

---

## ⚠️ Read this before posting any of them

1. **Never claim you bypass, skip or guarantee Google verification.** Google
   picks the method and the timeline. What you sell is preparing the profile so
   it passes first time, plus handling rejections and reinstatements.
2. **Never guarantee a ranking position.** Maps results are personalised by the
   searcher's distance, so no single "position 1" exists to sell.
3. **Never offer or imply bought reviews.** Fastest route to a suspended
   profile, and reportable by any competitor.

**On "same day":** use it for what you control — *built and submitted the same
day*. Not for going live; that clock is Google's.

**₹2,500 is the one-time setup.** Ongoing optimisation is the ₹5,000/month
retainer. Keep them separate in every post.

---
---
"""]
for i, p in enumerate(goog, 1):
    G.append(block(p, f"## Post {i} — {p['title']}"))

G.append("""---
---

# Maps reels

Same rules as the website reels: 1080 × 1920, burn in captions, the first two
seconds carry the hook, 15–30 seconds, five hashtags.

---
""")
for i, p in enumerate(reels_map, 1):
    G.append(block(p, f"### Reel {chr(64+i)} · {p['title']}\n\n**Length:** {p['slot']} · **Format:** {p['format']}"))

(SOCIAL / "GOOGLE-LISTING-POSTS.md").write_text("\n".join(G))
print("rendered both markdown files from the module")
