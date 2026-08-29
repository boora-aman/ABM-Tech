# ABM Tech — Social Media Operating System

Everything needed to run Instagram + Facebook at **2 posts a day, every day**,
without inventing content each morning.

Three files:

| File | What it is |
| --- | --- |
| `README.md` | The system — slots, themes, hashtag rules, the master image prompt |
| `CONTENT-CALENDAR-30-DAY.md` | **Part 1:** 30-day calendar, 60 posts · **Part 2:** service library, 84 posts · **Part 3:** 6 website reels |
| `GOOGLE-LISTING-POSTS.md` | 22 Google Business Profile posts + 4 Maps reels |

**176 posts and 10 reels.** Every one carries a finished caption, exactly five
hashtags, and a complete image prompt you can paste straight into a model.

They are also browsable and tickable in the admin at **`/admin/social`** —
that is where the day-to-day job actually happens.

---

## 1. The two daily slots

Posting twice a day only works if the two posts do **different jobs**. If both
sell, the account reads as an advertisement and reach collapses. The split:

| Slot | Time (IST) | Job | Ratio of the week |
| --- | --- | --- | --- |
| **A — Value** | 10:30 AM | Teach one thing. No pitch. Earns the right to slot B. | 7 of 14 |
| **B — Offer / Proof** | 7:00 PM | A service, a price, a result, or a direct CTA. | 7 of 14 |

Why these times: 10:30 AM catches business owners after the morning rush;
7:00 PM catches them after shop close. Both are before the 9 PM entertainment
peak where business content loses to reels.

**Do not batch-post both at once.** Two posts within an hour of each other
compete for the same impressions and the second one gets throttled.

---

## 2. The weekly theme cycle

Seven themes on a repeating loop. This is what makes 60 posts feel like a
publication rather than a pile.

| Day | Theme | Slot A (value) | Slot B (offer/proof) |
| --- | --- | --- | --- |
| **Mon** | Money Monday | What a manual process actually costs | A published price, in the open |
| **Tue** | Tech Tuesday | How something works under the hood | A service explained in plain words |
| **Wed** | Systems Wednesday | One of the six business systems | The service that builds that system |
| **Thu** | Proof Thursday | A real problem we hit and solved | Before/after from a real build |
| **Fri** | Myth-buster Friday | A belief that costs businesses money | The honest alternative we offer |
| **Sat** | Sector Saturday | One industry's specific pain | What we build for that industry |
| **Sun** | Straight-talk Sunday | Founder voice, opinion, no product | Soft CTA — DM, WhatsApp, free call |

---

## 3. Format rotation

Never post the same format twice in a row. Across a week, aim for:

- **3 carousels** (5–8 slides) — best for saves, which is the strongest signal
- **4 single-image graphics** — quotes, stats, price cards
- **3 reels** (15–30 s, face or screen recording) — best for reach to new people
- **2 before/after or comparison graphics** — best for shares
- **1 poll or question sticker** (story, not feed) — best for replies
- **1 text-heavy "receipt"** — a real screenshot, redacted

Reels get the most new reach; carousels get the most saves; single images get
the most comments. You need all three.

---

## 4. Hashtags — the five-tag rule

**Instagram capped posts and Reels at five hashtags in December 2025.** A hard
platform limit, not advice. Extra tags are ignored, and posts over the cap get
*suppressed* distribution in Explore, on hashtag pages and in Reels
recommendations.

So the old playbook — twenty-five broad tags, some in the caption and the rest
in the first comment — is now actively harmful. Every post in this system
carries exactly five, already chosen. **Copy them as they are.**

Two things about how hashtags work now:

- **They no longer drive reach.** They tell the system what the post is about.
  Reach comes from the content, the format and engagement.
- **Caption or first comment makes no algorithmic difference.** Instagram counts
  both identically. First-comment placement is purely cosmetic.

### How each set of five is built

| Slot | Job | Example |
| --- | --- | --- |
| 2 × **topic** | What the post is actually about | `#CRMSoftware` `#LeadManagement` |
| 1 × **anchor** | What the business is | `#CustomSoftware` |
| 1 × **local** | Where you are — cheapest reach available | `#Dehradun` |
| 1 × **audience** | Who it is for | `#SmallBusinessIndia` |

Specific beats broad now that only five count. `#CRMSoftware` earns its slot;
`#Business` does not.

### The pools

Rotated automatically so consecutive posts never carry an identical set — a
repeated block of five on every post is exactly the pattern spam filters watch
for.

**Anchor** — `#CustomSoftware` `#BusinessSoftware` `#SoftwareDevelopment`
**Local** — `#Dehradun` `#Uttarakhand` `#DehradunBusiness` `#IndiaBusiness`
**Audience** — `#SmallBusinessIndia` `#MSME` `#BusinessOwner` `#Entrepreneur`

| Topic bank | Tags |
| --- | --- |
| Websites & SEO | `#WebsiteDesign` `#WebDevelopment` `#LocalSEO` `#SEOTips` `#SmallBusinessWebsite` `#WebsiteDevelopment` |
| CRM & sales | `#CRM` `#CRMSoftware` `#SalesAutomation` `#LeadManagement` `#SalesPipeline` `#CustomerRelationship` |
| ERP & billing | `#ERPSoftware` `#InventoryManagement` `#GSTBilling` `#BillingSoftware` `#StockManagement` `#ERP` |
| Mobile & apps | `#MobileAppDevelopment` `#ReactNative` `#AndroidApp` `#AppDevelopment` `#FieldService` `#IOSApp` |
| AI & automation | `#AIAutomation` `#WorkflowAutomation` `#BusinessAutomation` `#ProcessAutomation` `#AIForBusiness` `#APIIntegration` |
| E-commerce | `#Ecommerce` `#OnlineStore` `#EcommerceWebsite` `#D2C` `#SellOnline` `#OrderManagement` |
| Small business | `#BusinessTips` `#SmallBusiness` `#BusinessGrowth` `#StartupIndia` `#BusinessAdvice` `#DigitalTransformation` |
| Google profile | `#GoogleBusinessProfile` `#GoogleMyBusiness` `#GoogleMaps` `#LocalSEO` `#MapsListing` `#LocalBusiness` |

**Facebook** never rewarded hashtag volume. Two or three, or none.

---

## 5. Images — one master prompt, one subject per post

### 5.1 AI cannot render text. Plan around it.

Every current image model spells words wrong and invents letterforms. A ₹ figure
or a service name generated *inside* the picture will be wrong, and wrong in a
way that looks careless on a software company's feed.

**So it is always two steps:**

1. **Generate the picture.** The prompt produces a scene with deliberate empty
   space and no text at all.
2. **Add the text and logo in Canva** over that empty space.

Every prompt ends with `no text, no words, no letters, no numbers`. Do not
remove it. **The logo is never generated either** — place the real SVG from
`public/icon.svg`, bottom-left, same size every time.

### 5.2 The master prompt

This is the block that makes 176 images look like one brand. **It is already
appended to every prompt in the other two files** — you do not need to paste it
yourself. It is here so you can reuse it for anything new.

**Light — the default:**

```
soft directional daylight from the left, warm paper #ECEAE4 background, one
vivid orange #F4501A accent and nothing else saturated, editorial product
photography, shot on 50mm, shallow depth of field, generous empty space in the
upper third for a text overlay, muted natural palette, photorealistic,
4:5 aspect ratio
```

**Dark — for price cards and dramatic posts:**

```
low-key studio lighting, deep ink #0E1014 background, one vivid orange #F4501A
rim light and nothing else saturated, editorial product photography, shot on
50mm, shallow depth of field, generous empty space in the upper third for a
text overlay, photorealistic, 4:5 aspect ratio
```

**Negative — paste into the negative field, or leave appended:**

```
no text, no words, no letters, no numbers, no logos, no watermarks, no people
looking at camera, no stock-photo handshakes, no clutter, not oversaturated,
no HDR, no lens flare
```

For reels and stories, swap `4:5 aspect ratio` for `9:16 vertical aspect ratio`.

### 5.3 Writing a new subject

A prompt is `SUBJECT` + the master block. The subject is one concrete sentence:
a real object, a specific action, one orange element.

**Good:** *"A worn spiral notebook open on a wooden desk beside a switched-off
phone, handwritten columns trailing off, one entry circled in vivid orange"*

**Bad:** *"An image representing business efficiency"* — nothing to photograph.

### 5.4 The six archetypes

Rotated so a service's six posts never look like six versions of one image.

| | Archetype | Best for |
| --- | --- | --- |
| **A** | **Object still-life** — a real business object on the brand ground | Problem posts |
| **B** | **Isometric clay scene** — matte 3D at 30°, usually on the dark ground | Price and how-it-works |
| **C** | **Abstract data form** — geometric shapes, no literal objects | Automation, APIs, dashboards |
| **D** | **Editorial photograph** — a real Indian business interior, no faces to camera | Sector and proof posts |
| **E** | **Macro detail** — extreme close crop, tactile | Quality and detail posts |
| **F** | **Blueprint schematic** — technical drawing, thin orange lines | Architecture and process |

### 5.5 Sizes

| Use | Size |
| --- | --- |
| Feed post / carousel slide | **1080 × 1350** (4:5) |
| Reel / story | **1080 × 1920** (9:16), text inside the middle 80% |

### 5.6 The grid test

Before scheduling a week, view the nine upcoming images as a 3×3 grid.
Two adjacent posts sharing an archetype? Swap one. More than one accent colour?
Something has crept in. A headline you cannot read at thumbnail size is too
long.

### 5.7 Tools

**Midjourney** suits archetypes A, D, E — add `--ar 4:5 --style raw`.
**Gemini / nanobanana** follows the "empty space" instruction best, so it suits
B and C. **DALL·E** is the most literal — try it when a prompt is being ignored.
**Canva** is where text and logo go on, always.

---

## 6. Non-negotiable rules

1. **Never promise a Google ranking position.** Maps results are personalised by
   the searcher's distance from the business — there is no single "position 1"
   to sell. Promise the work and the reporting, not the outcome.
2. **Never advertise bypassing Google verification.** Say "we handle the
   verification process end to end". Anything stronger is a policy violation
   that gets the client's listing suspended and yours reported.
3. **No bought reviews, ever.** It is the fastest route to a suspended profile.
4. **No client name or screenshot without written permission.** Redact and
   describe by sector — "a pharmacy in Dehradun", never the shop name.
5. **Every price posted must match the website.** A figure on Instagram that
   differs from `/pricing` is the fastest way to lose a deal on the first call.
6. **Never exceed five hashtags.** Instagram's December 2025 cap is enforced —
   over it, the post's distribution is suppressed rather than merely unhelped.
7. **Reply to every comment and DM within 12 hours.** Reach on a business
   account is mostly a function of reply rate.

---

## 7. Weekly working rhythm

| When | Task | Time |
| --- | --- | --- |
| Sunday evening | Build all 14 images for the week in Canva | 90 min |
| Sunday evening | Schedule all 14 posts in Meta Business Suite | 30 min |
| Daily 12:30 PM | Reply to comments/DMs from the morning post | 10 min |
| Daily 9:00 PM | Reply to comments/DMs from the evening post | 10 min |
| Friday | Check Insights: top 3 by saves, top 3 by reach. Repeat those formats. | 15 min |

Total: **under 3 hours a week** once the templates exist.

---

## 8. Cross-posting to Facebook

Meta Business Suite posts to both at once, but the caption should differ
slightly:

- **Instagram** — hook in line 1, short lines. The five hashtags can sit in the
  caption or the first comment; it makes no algorithmic difference.
- **Facebook** — you can write longer. Put the CTA link *in the post* (Instagram
  captions carry no clickable link; Facebook does). Cut to two or three
  hashtags, or drop them — Facebook never rewarded them.

Keep the same image on both.
