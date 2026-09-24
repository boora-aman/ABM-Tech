import React from "react";
import { Composition } from "remotion";
import { BrandReel, REEL_FRAMES } from "./Reel";

export function Root() {
  return (
    <>
      {/* 9:16 — Instagram Reels, Facebook Reels, YouTube Shorts, WhatsApp status. */}
      <Composition
        id="BrandReel"
        component={BrandReel}
        durationInFrames={REEL_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ format: "vertical" as const }}
      />
      {/* 1:1 — the feed post and the Google Business Profile video slot. */}
      <Composition
        id="BrandReelSquare"
        component={BrandReel}
        durationInFrames={REEL_FRAMES}
        fps={30}
        width={1080}
        height={1080}
        defaultProps={{ format: "square" as const }}
      />
    </>
  );
}
