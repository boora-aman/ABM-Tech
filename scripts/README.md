# scripts/

| Script | What it does |
| --- | --- |
| `seed.ts` | Import the committed site content into MongoDB (`npm run seed`) |
| `seed-admin.ts` | Create or reset the first admin owner (`npm run seed:admin`) |
| `render-social-md.py` | Render `/social/*.md` from `src/lib/content/social.ts` |

## The social pipeline runs one way

`src/lib/content/social.ts` is the **authority** for social content. The
markdown in `/social` is *rendered from it*:

```
src/lib/content/social.ts  ──render-social-md.py──▶  social/*.md
             │
             └──▶  /admin/social  (browse, copy, tick off)
```

It used to run the other way, with the markdown as the source and the module
parsed out of it. That broke the moment a fix was applied to the derived copy
— the caption-truncation repair and the five-hashtag rewrite both landed in the
module, and re-parsing the markdown would have silently reverted them.

**To change wording:** edit `src/lib/content/social.ts`, then run
`python3 scripts/render-social-md.py` to refresh the markdown.

Publishing status is **not** in either. It lives in MongoDB keyed by post
`key`, so regenerating never resets what you have already posted.
