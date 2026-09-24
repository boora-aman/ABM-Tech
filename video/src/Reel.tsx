import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AbsoluteFill,
  Easing,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { brand, color, fonts, fontsReady, promises, systems } from "./brand";

/* ==========================================================================
   ABM TECH — BRAND REEL

   30 seconds, silent by design. On Instagram and Facebook a reel with the
   platform's own trending audio added at upload outranks one with a baked-in
   track, and a baked-in track is also a licence you would have to own.

   Every scene keeps its type out of the platform chrome: the top band where
   the account name sits, the right edge where the like/share buttons stack,
   and the bottom third where the caption expands over the video.

   Timeline, at 30 fps:
     0–90     hook          "Every business runs on six systems."
     90–150   the problem   spreadsheets, WhatsApp, memory
     150–510  the six       one system every two seconds
     510–705  how we work   the six commitments
     705–810  the promise
     810–900  end card
   ========================================================================== */

export type Format = "vertical" | "square";

const T = {
  hook: [0, 90],
  pain: [90, 150],
  systems: [150, 510],
  commit: [510, 705],
  promise: [705, 810],
  end: [810, 900],
} as const;

const PER_SYSTEM = (T.systems[1] - T.systems[0]) / systems.length;

/* ------------------------------ Layout ---------------------------------- */

function useLayout(format: Format) {
  const { width } = useVideoConfig();
  const L =
    format === "vertical"
      ? { scale: 1, padTop: 300, padBottom: 440, padLeft: 96, padRight: 150 }
      : { scale: 0.7, padTop: 110, padBottom: 110, padLeft: 90, padRight: 110 };
  return { ...L, inner: width - L.padLeft - L.padRight };
}

/** The display face as every headline sets it — shared by the probe and the text. */
const DISPLAY: React.CSSProperties = {
  fontFamily: fonts.display,
  fontWeight: 800,
  letterSpacing: "-0.035em",
};

/**
 * The largest size, up to `max`, at which `measure` fits on one line in `width`.
 *
 * Measured in the DOM, on the text as the browser will actually draw it — same
 * face, weight and tracking. The canvas measurement in @remotion/layout-utils
 * came out a third too wide for Syne at 800, so everything it sized was a
 * third too small. And because the words are imported from the site's content
 * files, a pillar renamed to something longer has to shrink itself; no
 * hand-picked size survives that.
 *
 * Returns the size and a hidden probe element the caller must render. The
 * frame is held until the probe has been measured, so no frame is ever
 * captured at the unmeasured fallback size.
 */
function useFit(measure: string, width: number, max: number, face: React.CSSProperties = DISPLAY) {
  const ref = useRef<HTMLSpanElement>(null);
  const [size, setSize] = useState(max);
  const [handle] = useState(() => delayRender(`Fitting "${measure}"`));
  const released = useRef(false);

  useLayoutEffect(() => {
    const w = ref.current?.scrollWidth ?? 0;
    /* 3% under the exact fit: a line set to fill the column to the pixel
       looks cramped against the right margin even when nothing clips. */
    if (w > 0) setSize(Math.min(max, ((100 * width) / w) * 0.97));
    if (!released.current) {
      released.current = true;
      continueRender(handle);
    }
  }, [measure, width, max, handle]);

  const probe = (
    <span
      ref={ref}
      aria-hidden
      style={{
        ...face,
        fontSize: 100,
        position: "absolute",
        left: 0,
        top: 0,
        whiteSpace: "nowrap",
        visibility: "hidden",
        pointerEvents: "none",
      }}
    >
      {measure}
    </span>
  );
  return [size, probe] as const;
}

/** The longest word — what has to fit when a line is allowed to wrap. */
const longestWord = (t: string) => t.split(/\s+/).reduce((a, b) => (b.length > a.length ? b : a), "");

const ease = Easing.bezier(0.16, 1, 0.3, 1);

/** Rise-and-fade in, from `at` frames into the parent sequence. */
function useEnter(at: number, distance = 60) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: frame - at, fps, config: { damping: 200, mass: 0.7 } });
  return {
    opacity: interpolate(p, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(p, [0, 1], [distance, 0])}px)`,
  };
}

/** Fade the whole scene out over its last `span` frames. */
function useExit(duration: number, span = 10) {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [duration - span, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  return { opacity: 1 - t, transform: `translateY(${-40 * t}px)` };
}

/* ------------------------------ Pieces ---------------------------------- */

/** The mark from components/brand/Logo.tsx, with its three bars rising in turn. */
function Mark({ size, at = 0 }: { size: number; at?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = (i: number) =>
    spring({ frame: frame - at - i * 5, fps, config: { damping: 14, mass: 0.6 } });
  const datum = spring({ frame: frame - at - 20, fps, config: { damping: 10 } });

  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      {[
        { d: "M4 31.5 L9.2 31.5 L13.4 20.5 L8.2 20.5 Z", c: color.hot },
        { d: "M13 31.5 L18.2 31.5 L24.4 14.5 L19.2 14.5 Z", c: color.mid },
        { d: "M22 31.5 L27.2 31.5 L35.4 8.5 L30.2 8.5 Z", c: color.warm },
      ].map((b, i) => (
        <path
          key={i}
          d={b.d}
          fill={b.c}
          style={{
            transformOrigin: "50% 31.5px",
            transformBox: "view-box",
            transform: `scaleY(${bar(i)})`,
          }}
        />
      ))}
      <rect x="4" y="33.6" width="31.4" height="1.6" rx="0.4" fill={color.hot} opacity={0.45} />
      <rect
        x="34.4"
        y="4.6"
        width="3"
        height="3"
        rx="0.8"
        fill={color.teal}
        style={{ transformOrigin: "35.9px 6.1px", transformBox: "view-box", transform: `scale(${datum})` }}
      />
    </svg>
  );
}

/** The ground every scene sits on: a faint grid and one slow warm glow. */
function Backdrop() {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const drift = interpolate(frame, [0, durationInFrames], [0, 1]);
  const gx = interpolate(drift, [0, 1], [width * 0.15, width * 0.85]);
  const gy = interpolate(drift, [0, 1], [height * 0.2, height * 0.7]);

  return (
    <AbsoluteFill style={{ backgroundColor: color.ground }}>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse">
            <path d="M72 0H0V72" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: gx - width * 0.6,
          top: gy - width * 0.6,
          width: width * 1.2,
          height: width * 1.2,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(255,69,0,0.22) 0%, rgba(255,69,0,0.06) 35%, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
}

/** A thin rule at the very top that fills across the whole reel. */
function Progress() {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const w = interpolate(frame, [0, durationInFrames - 1], [0, width]);
  return (
    <div style={{ position: "absolute", top: 0, left: 0, height: 8, width: w, display: "flex" }}>
      <div style={{ flex: 1, background: color.hot }} />
      <div style={{ flex: 1, background: color.mid }} />
      <div style={{ flex: 2, background: color.warm }} />
    </div>
  );
}

function Stage({
  format,
  children,
  justify = "center",
}: {
  format: Format;
  children: React.ReactNode;
  justify?: "center" | "flex-start" | "flex-end";
}) {
  const L = useLayout(format);
  return (
    <AbsoluteFill
      style={{
        paddingTop: L.padTop,
        paddingBottom: L.padBottom,
        paddingLeft: L.padLeft,
        paddingRight: L.padRight,
        display: "flex",
        flexDirection: "column",
        justifyContent: justify,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

const label = (s: number): React.CSSProperties => ({
  fontFamily: fonts.mono,
  fontWeight: 500,
  fontSize: 30 * s,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: color.dim,
  display: "flex",
  alignItems: "center",
  gap: 22 * s,
});

function Tick({ s }: { s: number }) {
  return <span style={{ width: 56 * s, height: 3, background: color.hot, display: "inline-block" }} />;
}

/* ------------------------------ Scenes ---------------------------------- */

function Hook({ format }: { format: Format }) {
  const s = useLayout(format).scale;
  const { inner } = useLayout(format);
  const exit = useExit(T.hook[1] - T.hook[0]);

  /* One short line per beat. Syne at 800 is wide, so the size a line can take
     is set by its length: "Every business" on one line tops out around 72px,
     which is legible and flat. Broken into single words, the same sentence
     sets at nearly twice that and fills the frame the way a hook should. */
  const lines = [
    { t: "Every", tone: color.dim },
    { t: "business", tone: color.dim },
    { t: "runs on", tone: color.dim },
    { t: "six", tone: color.hot },
    { t: "systems.", tone: color.ink },
  ];
  const longest = lines.map((l) => l.t).reduce((a, b) => (b.length > a.length ? b : a));
  const [size, probe] = useFit(longest, inner, 190 * s);

  return (
    <Stage format={format}>
      {probe}
      <div style={exit}>
        <div style={{ marginBottom: 56 * s }}>
          <Mark size={150 * s} />
        </div>
        {lines.map((l, i) => (
          <HookLine key={l.t} text={l.t} tone={l.tone} size={size} at={12 + i * 7} />
        ))}
      </div>
    </Stage>
  );
}

function HookLine({ text, tone, size, at }: { text: string; tone: string; size: number; at: number }) {
  const e = useEnter(at, 70);
  return (
    <div style={{ ...DISPLAY, fontSize: size, lineHeight: 0.96, whiteSpace: "nowrap", color: tone, ...e }}>
      {text}
    </div>
  );
}

function Pain({ format }: { format: Format }) {
  const s = useLayout(format).scale;
  const frame = useCurrentFrame();
  const exit = useExit(T.pain[1] - T.pain[0]);
  /* Short enough that no line wraps. A strike positioned at half the height
     of a two-line block falls in the gap between the lines, and reads as an
     underline on the wrong word. */
  const lines = ["Excel.", "WhatsApp.", "Memory."];
  const { inner } = useLayout(format);
  /* One size for all three, set by the longest, so the list reads as a list. */
  const longest = lines.reduce((a, b) => (b.length > a.length ? b : a));
  const [size, probe] = useFit(longest, inner, 170 * s);
  /* The strike lands after the last line has settled, so it reads as a
     verdict on the list rather than as part of the animation of it. */
  const strike = interpolate(frame, [40, 52], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

  return (
    <Stage format={format}>
      {probe}
      <div style={exit}>
        <div style={{ ...label(s), marginBottom: 34 * s }}>
          <Tick s={s} /> The problem
        </div>
        <div
          style={{
            fontFamily: fonts.sans,
            fontWeight: 500,
            fontSize: 50 * s,
            color: color.dim,
            marginBottom: 30 * s,
          }}
        >
          Most businesses still run on
        </div>
        {lines.map((l, i) => (
          <PainLine key={l} text={l} i={i} s={s} size={size} strike={strike} last={i === lines.length - 1} />
        ))}
      </div>
    </Stage>
  );
}

/* Its own component so the entrance hook is called once per render of a
   line, not in a loop — the rules of hooks hold even where the count never
   changes, and lint is right to insist. */
function PainLine({
  text,
  i,
  s,
  size,
  strike,
  last,
}: {
  text: string;
  i: number;
  s: number;
  size: number;
  strike: number;
  last: boolean;
}) {
  const e = useEnter(i * 9, 50);
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        alignSelf: "flex-start",
        ...DISPLAY,
        fontSize: size,
        lineHeight: 1.14,
        whiteSpace: "nowrap",
        color: last ? color.ink : color.dim,
        ...e,
      }}
    >
      {text}
      <span
        style={{
          position: "absolute",
          left: 0,
          top: "54%",
          height: 7 * s,
          width: `${strike * 100}%`,
          background: color.hot,
        }}
      />
    </div>
  );
}

function System({ i, format }: { i: number; format: Format }) {
  const s = useLayout(format).scale;
  const sys = systems[i];
  const exit = useExit(PER_SYSTEM, 9);
  const { inner } = useLayout(format);
  /* Names wrap — "Know what is happening" is three lines and should be — but
     no single word may be wider than the column. The rail and its gap come
     out of the width first. */
  const column = inner - 66 * s;
  const [nameSize, nameProbe] = useFit(longestWord(sys.name), column, 124 * s);
  const idx = useEnter(0, 40);
  const name = useEnter(6, 70);
  const q = useEnter(14, 40);

  return (
    <Stage format={format}>
      {nameProbe}
      <div style={{ display: "flex", gap: 56 * s, ...exit }}>
        {/* The rail — where this one sits among the six. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 * s, paddingTop: 22 * s }}>
          {systems.map((_, k) => (
            <div
              key={k}
              style={{
                width: 10 * s,
                height: k === i ? 90 * s : 36 * s,
                borderRadius: 6,
                background: k === i ? color.hot : k < i ? color.faint : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: fonts.mono,
              fontWeight: 700,
              fontSize: 190 * s,
              lineHeight: 1,
              color: "transparent",
              WebkitTextStroke: `3px ${color.hot}`,
              ...idx,
            }}
          >
            {sys.index}
          </div>
          <div
            style={{
              marginTop: 30 * s,
              ...DISPLAY,
              fontSize: nameSize,
              lineHeight: 1,
              color: color.ink,
              ...name,
            }}
          >
            {sys.name}
          </div>
          <div
            style={{
              marginTop: 44 * s,
              maxWidth: 780 * s,
              fontFamily: fonts.sans,
              fontWeight: 400,
              fontSize: 48 * s,
              lineHeight: 1.35,
              color: color.dim,
              ...q,
            }}
          >
            {sys.question}
          </div>
        </div>
      </div>
    </Stage>
  );
}

function Commitments({ format }: { format: Format }) {
  const s = useLayout(format).scale;
  const exit = useExit(T.commit[1] - T.commit[0]);
  const head = useEnter(0);
  const STEP = 26;
  const { inner } = useLayout(format);
  const [headSize, headProbe] = useFit("we always do.", inner, 100 * s);

  return (
    <Stage format={format}>
      {headProbe}
      <div style={exit}>
        <div style={{ ...label(s), marginBottom: 30 * s, ...head }}>
          <Tick s={s} /> How we work
        </div>
        <div
          style={{
            ...DISPLAY,
            fontSize: headSize,
            whiteSpace: "nowrap",
            lineHeight: 1.02,
            color: color.ink,
            marginBottom: 56 * s,
            ...head,
          }}
        >
          Six things
          <br />
          we always do.
        </div>
        {promises.map((p, i) => (
          <CommitmentRow key={p} text={p} i={i} s={s} at={14 + i * STEP} />
        ))}
      </div>
    </Stage>
  );
}

function CommitmentRow({ text, i, s, at }: { text: string; i: number; s: number; at: number }) {
  const e = useEnter(at, 30);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 30 * s,
        padding: `${24 * s}px 0`,
        borderTop: `1px solid ${color.line}`,
        ...e,
      }}
    >
      <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 28 * s, color: color.hot, width: 50 * s }}>
        {String(i + 1).padStart(2, "0")}
      </span>
      <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 44 * s, lineHeight: 1.2, color: color.ink }}>
        {text}
      </span>
    </div>
  );
}

/* Not called `Promise`: that shadows the global, and anything in this file
   that later awaits would get a React component instead. */
function PromiseScene({ format }: { format: Format }) {
  const s = useLayout(format).scale;
  const exit = useExit(T.promise[1] - T.promise[0]);
  /* site.promise is one sentence with a dash in it; the reel gives each half
     its own beat, because the second half is the part people remember. */
  const [first, second] = brand.promise.split(/\s+—\s+/);
  const a = useEnter(0);
  const b = useEnter(26, 70);

  return (
    <Stage format={format}>
      <div style={exit}>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 700,
            fontSize: 80 * s,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: color.dim,
            ...a,
          }}
        >
          {first}
        </div>
        {second ? (
          <div
            style={{
              marginTop: 50 * s,
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 96 * s,
              lineHeight: 1.04,
              letterSpacing: "-0.035em",
              color: color.ink,
              ...b,
            }}
          >
            {second}
          </div>
        ) : null}
      </div>
    </Stage>
  );
}

function EndCard({ format }: { format: Format }) {
  const s = useLayout(format).scale;
  const mark = useEnter(0, 30);
  const name = useEnter(8, 40);
  const { inner } = useLayout(format);
  const [nameSize, nameProbe] = useFit(brand.name, inner * 0.9, 170 * s);
  const url = useEnter(20, 30);
  const rest = useEnter(28, 20);

  return (
    <Stage format={format}>
      {nameProbe}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <div style={mark}>
          <Mark size={220 * s} at={4} />
        </div>
        <div
          style={{
            marginTop: 40 * s,
            ...DISPLAY,
            fontSize: nameSize,
            whiteSpace: "nowrap",
            color: color.ink,
            lineHeight: 1,
            ...name,
          }}
        >
          {brand.name}
        </div>
        <div style={{ ...label(s), marginTop: 26 * s, fontSize: 28 * s, ...name }}>{brand.tagline}</div>

        <div
          style={{
            marginTop: 90 * s,
            padding: `${26 * s}px ${54 * s}px`,
            borderRadius: 999,
            background: `linear-gradient(100deg, ${color.hot}, ${color.warm})`,
            fontFamily: fonts.sans,
            fontWeight: 600,
            fontSize: 50 * s,
            color: "#fff",
            ...url,
          }}
        >
          {brand.url}
        </div>

        <div
          style={{
            marginTop: 44 * s,
            fontFamily: fonts.mono,
            fontWeight: 500,
            fontSize: 36 * s,
            color: color.dim,
            letterSpacing: "0.04em",
            ...rest,
          }}
        >
          {brand.phone}
        </div>
        <div
          style={{
            marginTop: 14 * s,
            fontFamily: fonts.sans,
            fontSize: 32 * s,
            color: color.faint,
            ...rest,
          }}
        >
          {brand.city}
        </div>
      </div>
    </Stage>
  );
}

/* ------------------------------ Assembly -------------------------------- */

/**
 * Holds the frame until every face has loaded, then renders.
 *
 * Text is measured with a canvas, and a canvas measures in whatever font it
 * has — before Syne arrives that is the fallback, which is far narrower, so
 * every size computed on the first pass would be too large. Rendering nothing
 * until the fonts are in makes the first measurement the right one.
 */
function FontGate({ children }: { children: React.ReactNode }) {
  const [handle] = useState(() => delayRender("Loading brand fonts"));
  const [ready, setReady] = useState(false);
  useEffect(() => {
    fontsReady().then(() => {
      setReady(true);
      continueRender(handle);
    });
  }, [handle]);
  return ready ? <>{children}</> : null;
}

const span = ([a, b]: readonly [number, number]) => ({ from: a, durationInFrames: b - a });

export function BrandReel({ format = "vertical" }: { format?: Format }) {
  return (
    <AbsoluteFill style={{ fontFamily: fonts.sans }}>
      <Backdrop />
      <FontGate>

      <Sequence {...span(T.hook)} name="Hook">
        <Hook format={format} />
      </Sequence>
      <Sequence {...span(T.pain)} name="Problem">
        <Pain format={format} />
      </Sequence>

      {systems.map((sys, i) => (
        <Sequence
          key={sys.index}
          from={T.systems[0] + i * PER_SYSTEM}
          durationInFrames={PER_SYSTEM}
          name={`System ${sys.index} — ${sys.name}`}
        >
          <System i={i} format={format} />
        </Sequence>
      ))}

      <Sequence {...span(T.commit)} name="How we work">
        <Commitments format={format} />
      </Sequence>
      <Sequence {...span(T.promise)} name="Promise">
        <PromiseScene format={format} />
      </Sequence>
      <Sequence {...span(T.end)} name="End card">
        <EndCard format={format} />
      </Sequence>

      </FontGate>
      <Progress />
    </AbsoluteFill>
  );
}

export const REEL_FRAMES = T.end[1];
