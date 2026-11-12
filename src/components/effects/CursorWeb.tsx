import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { eraseShields, pointOnShield, shieldRects } from "./webShield";
import "./CursorWeb.css";

type Rgb = readonly [number, number, number];

interface WebInstance {
  x: number;
  y: number;
  createdAt: number;
  radius: number;
  sagOffsets: number[][];
}

interface WebPalette {
  baseRgb: Rgb;
  baseAlpha: number;
  innerRgb: Rgb;
  innerAlpha: number;
}

const RING_COUNT = 5;
const SEGMENTS = 10;
const SPOKE_COUNT = 10;
const WEB_LIFE_MS = 1000;
const FADE_IN_MS = 100;
const HOLD_END_MS = 350;
const FADE_OUT_MS = WEB_LIFE_MS - HOLD_END_MS;
const SCALE_IN_MS = 300;
const SPAWN_DISTANCE_PX = 80;
const MAX_WEBS = 2;
const SAG_MAX_PX = 3;
const MOBILE_BREAKPOINT_PX = 768;
const DESKTOP_RADIUS_PX = 150;
const MOBILE_RADIUS_PX = 110;
const LIGHT_GREEN_RGB: Rgb = [143, 193, 169];
const RING_OPACITY_WEIGHTS = [1.0, 0.86, 0.72, 0.58, 0.45] as const;

const UNIT_VECTORS: ReadonlyArray<readonly [number, number]> = Array.from(
  { length: SPOKE_COUNT },
  (_, index) => {
    const angle = (index * Math.PI * 2) / SPOKE_COUNT;
    return [Math.cos(angle), Math.sin(angle)] as const;
  }
);

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function parseCssColor(value: string): Rgb | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("#")) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      const r = parseInt(hex[0] + hex[0], 16);
      const g = parseInt(hex[1] + hex[1], 16);
      const b = parseInt(hex[2] + hex[2], 16);
      return Number.isNaN(r + g + b) ? null : [r, g, b];
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return Number.isNaN(r + g + b) ? null : [r, g, b];
    }
  }

  const match = trimmed.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  if (match) {
    return [Number(match[1]), Number(match[2]), Number(match[3])];
  }
  return null;
}

function blendRgb(from: Rgb, to: Rgb, weight: number): Rgb {
  return [
    Math.round(from[0] + (to[0] - from[0]) * weight),
    Math.round(from[1] + (to[1] - from[1]) * weight),
    Math.round(from[2] + (to[2] - from[2]) * weight),
  ];
}

function rgba(rgb: Rgb, alpha: number): string {
  const clamped = Math.max(0, Math.min(1, alpha));
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clamped.toFixed(4)})`;
}

function resolvePalette(): WebPalette {
  const root = document.documentElement;
  const isDark =
    root.classList.contains("dark") ||
    root.getAttribute("data-theme") === "dark" ||
    (!root.classList.contains("light") &&
      root.getAttribute("data-theme") !== "light" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  const cssAccent = getComputedStyle(root).getPropertyValue("--accent");
  const parsedAccent = parseCssColor(cssAccent) ?? LIGHT_GREEN_RGB;

  if (isDark) {
    return {
      baseRgb: parsedAccent,
      baseAlpha: 0.55,
      innerRgb: blendRgb(parsedAccent, [255, 255, 255], 0.16),
      innerAlpha: 0.78,
    };
  }

  return {
    baseRgb: LIGHT_GREEN_RGB,
    baseAlpha: 0.9,
    innerRgb: blendRgb(LIGHT_GREEN_RGB, parsedAccent, 0.3),
    innerAlpha: 0.95,
  };
}

function getWebOpacity(elapsed: number): number {
  if (elapsed < 0 || elapsed >= WEB_LIFE_MS) return 0;
  if (elapsed < FADE_IN_MS) return elapsed / FADE_IN_MS;
  if (elapsed <= HOLD_END_MS) return 1;
  const fadeOutProgress = (elapsed - HOLD_END_MS) / FADE_OUT_MS;
  return Math.max(0, 1 - easeOutCubic(fadeOutProgress));
}

function createSagOffsets(): number[][] {
  return Array.from({ length: RING_COUNT }, () =>
    Array.from({ length: SEGMENTS }, () => (Math.random() * 2 - 1) * SAG_MAX_PX)
  );
}

function checkShouldEnable(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
  return !reducedMotion && hasFinePointer;
}

export const CursorWeb: React.FC = () => {
  const { theme } = useTheme();
  const [enabled, setEnabled] = useState<boolean>(() => checkShouldEnable());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paletteRef = useRef<WebPalette>({
    baseRgb: LIGHT_GREEN_RGB,
    baseAlpha: 0.9,
    innerRgb: [109, 152, 134],
    innerAlpha: 0.95,
  });

  // Subscribe to reduced-motion and fine-pointer capability changes
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointerQuery = window.matchMedia("(pointer: fine)");
    const updateEligibility = () => {
      setEnabled(!motionQuery.matches && pointerQuery.matches);
    };

    updateEligibility();
    motionQuery.addEventListener("change", updateEligibility);
    pointerQuery.addEventListener("change", updateEligibility);
    return () => {
      motionQuery.removeEventListener("change", updateEligibility);
      pointerQuery.removeEventListener("change", updateEligibility);
    };
  }, []);

  // Keep cached CSS theme & --accent palette synchronized without per-frame style recalc
  useEffect(() => {
    if (!enabled) return;
    const syncPalette = () => {
      paletteRef.current = resolvePalette();
    };
    syncPalette();

    const observer = new MutationObserver(syncPalette);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });
    return () => observer.disconnect();
  }, [enabled, theme]);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let viewportW = window.innerWidth;
    let viewportH = window.innerHeight;
    let rafId: number | null = null;
    let pointerInside = false;
    let pendingPointer: { x: number; y: number } | null = null;
    let lastSpawnCenter: { x: number; y: number } | null = null;
    const webs: WebInstance[] = [];

    const resizeCanvas = () => {
      viewportW = window.innerWidth;
      viewportH = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(viewportW * dpr);
      canvas.height = Math.floor(viewportH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnWeb = (x: number, y: number, now: number) => {
      const radius =
        viewportW < MOBILE_BREAKPOINT_PX ? MOBILE_RADIUS_PX : DESKTOP_RADIUS_PX;
      webs.push({
        x,
        y,
        createdAt: now,
        radius,
        sagOffsets: createSagOffsets(),
      });
      while (webs.length > MAX_WEBS) {
        webs.shift();
      }
      lastSpawnCenter = { x, y };
    };

    const drawWeb = (web: WebInstance, now: number, palette: WebPalette) => {
      const elapsed = now - web.createdAt;
      const lifeAlpha = getWebOpacity(elapsed);
      if (lifeAlpha <= 0) return;

      const scale =
        elapsed < SCALE_IN_MS
          ? 0.92 + 0.08 * easeOutCubic(elapsed / SCALE_IN_MS)
          : 1;
      const outerBreath =
        Math.sin((elapsed / WEB_LIFE_MS) * Math.PI * 2) * 2;

      // Precompute outer ring endpoints while drawing rings from inner to outer
      const ringXs: number[][] = new Array(RING_COUNT);
      const ringYs: number[][] = new Array(RING_COUNT);

      for (let r = 0; r < RING_COUNT; r++) {
        const baseRingR = web.radius * ((r + 1) / RING_COUNT);
        const breath = r === RING_COUNT - 1 ? outerBreath : 0;
        const sags = web.sagOffsets[r];
        const xs = new Array<number>(SEGMENTS);
        const ys = new Array<number>(SEGMENTS);

        for (let i = 0; i < SEGMENTS; i++) {
          const vertexR = Math.max(4, (baseRingR + breath + sags[i]) * scale);
          const [ux, uy] = UNIT_VECTORS[i];
          xs[i] = web.x + ux * vertexR;
          ys[i] = web.y + uy * vertexR;
        }
        ringXs[r] = xs;
        ringYs[r] = ys;
      }

      // Draw spokes in one path batch
      const spokeColor = rgba(palette.baseRgb, palette.baseAlpha * lifeAlpha);
      const outerXs = ringXs[RING_COUNT - 1];
      const outerYs = ringYs[RING_COUNT - 1];
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = spokeColor;
      for (let i = 0; i < SPOKE_COUNT; i++) {
        ctx.moveTo(web.x, web.y);
        ctx.lineTo(outerXs[i], outerYs[i]);
      }
      ctx.stroke();

      // Draw concentric 10-segment rings (one path batch per ring)
      ctx.lineWidth = 0.8;
      for (let r = 0; r < RING_COUNT; r++) {
        const xs = ringXs[r];
        const ys = ringYs[r];
        ctx.beginPath();
        if (r === 0) {
          ctx.strokeStyle = rgba(palette.innerRgb, palette.innerAlpha * lifeAlpha);
        } else {
          ctx.strokeStyle = rgba(
            palette.baseRgb,
            palette.baseAlpha * RING_OPACITY_WEIGHTS[r] * lifeAlpha
          );
        }
        ctx.moveTo(xs[0], ys[0]);
        for (let i = 1; i < SEGMENTS; i++) {
          ctx.lineTo(xs[i], ys[i]);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // Small centre anchor dot matching spokes
      ctx.beginPath();
      ctx.fillStyle = spokeColor;
      ctx.arc(web.x, web.y, 2, 0, Math.PI * 2);
      ctx.fill();
    };

    const paintActiveWebs = (now: number) => {
      while (webs.length > 0 && now - webs[0].createdAt >= WEB_LIFE_MS) {
        webs.shift();
      }
      ctx.clearRect(0, 0, viewportW, viewportH);
      if (webs.length === 0) return false;

      ctx.lineCap = "round";
      const palette = paletteRef.current;
      for (let i = 0; i < webs.length; i++) {
        drawWeb(webs[i], now, palette);
      }
      eraseShields(ctx, shieldRects());
      return true;
    };

    const renderFrame = (now: number) => {
      // Process at most one throttled pointermove update per animation frame
      if (pendingPointer && pointerInside) {
        const { x, y } = pendingPointer;
        pendingPointer = null;
        const overReading = pointOnShield(x, y);
        if (
          !overReading &&
          (!lastSpawnCenter ||
            Math.hypot(x - lastSpawnCenter.x, y - lastSpawnCenter.y) > SPAWN_DISTANCE_PX)
        ) {
          spawnWeb(x, y, now);
        }
      } else {
        pendingPointer = null;
      }

      const hasVisible = paintActiveWebs(now);
      if (!hasVisible) {
        rafId = null;
        return;
      }

      rafId = window.requestAnimationFrame(renderFrame);
    };

    const ensureLoop = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(renderFrame);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointerInside = true;
      pendingPointer = { x: e.clientX, y: e.clientY };
      ensureLoop();
    };

    const handlePointerLeave = () => {
      pointerInside = false;
      pendingPointer = null;
    };

    const handleResize = () => {
      resizeCanvas();
      if (webs.length > 0) {
        paintActiveWebs(performance.now());
      }
    };

    resizeCanvas();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("pointerleave", handlePointerLeave);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      ctx.clearRect(0, 0, viewportW, viewportH);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return <canvas ref={canvasRef} className="cursor-web-canvas" aria-hidden="true" />;
};

export default CursorWeb;
