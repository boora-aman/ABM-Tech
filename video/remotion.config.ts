import { Config } from "@remotion/cli/config";

/* The entry point lives in src/, next to the scenes. */
Config.setEntryPoint("./src/index.ts");
Config.setVideoImageFormat("jpeg");
/* Near-lossless for the master. Instagram and Facebook re-encode on upload,
   and every generation of lossy compression before theirs shows. */
Config.setCrf(16);
Config.setPixelFormat("yuv420p");
/* Tag the stream BT.709 limited range. Left untagged, JPEG frames encode as
   full-range yuvj420p, which some players and upload pipelines read as
   limited range — the dark ground crushes to flat black and the orange
   shifts. Instagram, Facebook and YouTube all expect BT.709. */
Config.setColorSpace("bt709");
