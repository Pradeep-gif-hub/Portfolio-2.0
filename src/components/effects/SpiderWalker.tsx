import { useEffect, useRef } from "react";
import { eraseShields, shieldRects } from "./webShield";

const SPIDER_SRC = "/spider.png";

type Point = { x: number; y: number };
type Segment = { a: Point; b: Point; c: Point };
type Web = { segments: Segment[]; alpha: number };

const silkIsLight = () => {
  const root = document.documentElement;
  return (
    root.classList.contains("dark") ||
    root.getAttribute("data-theme") === "dark" ||
    (!root.classList.contains("light") &&
      root.getAttribute("data-theme") !== "light" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
};

const smooth = (edge0: number, edge1: number, value: number) => {
  const t = Math.min(1, Math.max(0, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const sagPoint = (a: Point, b: Point, bend: number): Point => ({
  x: (a.x + b.x) / 2 + bend * 0.15,
  y: (a.y + b.y) / 2 + Math.min(12, Math.abs(b.x - a.x) * 0.07) + bend,
});

const segment = (a: Point, b: Point, bend: number): Segment => ({
  a,
  b,
  c: sagPoint(a, b, bend),
});

const buildWeb = (hub: Point, radius: number): Segment[] => {
  const count = 14 + Math.floor(Math.random() * 3);
  const spin = Math.random() * Math.PI * 2;
  const gap = Math.floor(Math.random() * count);
  const spokes = Array.from({ length: count }, (_, index) => {
    const angle = spin + (index / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;
    const length = radius * (0.78 + Math.random() * 0.32);
    return {
      angle,
      tip: {
        x: hub.x + Math.cos(angle) * length,
        y: hub.y + Math.sin(angle) * length,
      },
      length,
    };
  });

  const segments: Segment[] = spokes.map((spoke) =>
    segment(hub, spoke.tip, (Math.random() - 0.5) * 3),
  );

  const turns = 8 + Math.floor(Math.random() * 2);
  for (let ring = 1; ring <= turns; ring += 1) {
    const reach = 0.16 + (0.78 * ring) / turns;
    for (let index = 0; index < count; index += 1) {
      if (index === gap || index === (gap + 1) % count) continue;
      const current = spokes[index];
      const next = spokes[(index + 1) % count];
      const a = {
        x: hub.x + Math.cos(current.angle) * current.length * reach,
        y: hub.y + Math.sin(current.angle) * current.length * reach,
      };
      const b = {
        x: hub.x + Math.cos(next.angle) * next.length * reach,
        y: hub.y + Math.sin(next.angle) * next.length * reach,
      };
      segments.push(segment(a, b, (Math.random() - 0.35) * 2.4));
    }
  }

  for (let index = 0; index < count; index += 1) {
    if (index % 5 === gap % 5) continue;
    const current = spokes[index];
    const next = spokes[(index + 1) % count];
    segments.push(segment(current.tip, next.tip, (Math.random() - 0.4) * 4));
  }

  return segments;
};

export const SpiderWalker = () => {
    const webRef = useRef<HTMLCanvasElement>(null);
    const spiderRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const webCanvas = webRef.current;
    const spiderCanvas = spiderRef.current;
    if (!webCanvas || !spiderCanvas) return;
    const webCtx = webCanvas.getContext("2d");
    const spiderCtx = spiderCanvas.getContext("2d");
    if (!webCtx || !spiderCtx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let frame = 0;
    let running = true;

    const source = document.createElement("canvas");
    const sourceCtx = source.getContext("2d", { willReadFrequently: true });
    let pixels: ImageData | null = null;
    let spriteW = 0;
    let spriteH = 0;

    const image = new Image();
    image.src = SPIDER_SRC;
    image.onload = () => {
      spriteW = 280;
      spriteH = Math.round((280 * image.height) / image.width);
      source.width = spriteW;
      source.height = spriteH;
      spiderCanvas.width = spriteW;
      spiderCanvas.height = spriteH;
      sourceCtx?.drawImage(image, 0, 0, spriteW, spriteH);
      pixels = sourceCtx?.getImageData(0, 0, spriteW, spriteH) ?? null;
      if (reduced) paintSpider(0, 0);
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      webCanvas.width = Math.floor(width * ratio);
      webCanvas.height = Math.floor(height * ratio);
      webCanvas.style.width = `${width}px`;
      webCanvas.style.height = `${height}px`;
      webCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();

    const narrow = () => width < 768;
    const cornerPoint = (index: number) => {
      const left = narrow() ? 28 : 48;
      const right = Math.max(left + 120, width - (narrow() ? 28 : 48));
      const top = narrow() ? 86 : 148;
      const bottom = Math.max(top + 140, height - (narrow() ? 36 : 72));
      if (index === 0) return { x: left, y: top };
      if (index === 1) return { x: right, y: top };
      if (index === 2) return { x: right, y: bottom };
      return { x: left, y: bottom };
    };
    let corner = 1;

    let pos = cornerPoint(corner);
    let rotation = Math.PI;
    let gait = 0;
    let stride = 0;
    const previous = { x: pos.x, y: pos.y };
    let crawlStart = { ...pos };
    let crawlEnd = { ...pos };

    const placeSpider = () => {
      const size = narrow() ? 64 : 142;
      spiderCanvas.style.width = `${size}px`;
      spiderCanvas.style.transform = `translate(-50%, -50%) rotate(${rotation}rad)`;
      spiderCanvas.style.left = `${pos.x}px`;
      spiderCanvas.style.top = `${pos.y}px`;
    };

    const sample = (x: number, y: number) => {
      if (!pixels || x < 0 || y < 0 || x >= spriteW - 1 || y >= spriteH - 1) {
        return [0, 0, 0, 0];
      }
      const x0 = x | 0;
      const y0 = y | 0;
      const fx = x - x0;
      const fy = y - y0;
      const row = spriteW * 4;
      const i00 = y0 * row + x0 * 4;
      const data = pixels.data;
      const out = [0, 0, 0, 0];
      const weights = [
        [i00, (1 - fx) * (1 - fy)],
        [i00 + 4, fx * (1 - fy)],
        [i00 + row, (1 - fx) * fy],
        [i00 + row + 4, fx * fy],
      ] as const;
      for (const [index, weight] of weights) {
        out[0] += data[index] * weight;
        out[1] += data[index + 1] * weight;
        out[2] += data[index + 2] * weight;
        out[3] += data[index + 3] * weight;
      }
      return out;
    };

    const paintSpider = (phase: number, amount: number) => {
      if (!pixels) return;
      const framePixels = spiderCtx.createImageData(spriteW, spriteH);
      const out = framePixels.data;
      const cx = spriteW * 0.511;
      const cy = spriteH * 0.5;
      const bodyR = spriteW * 0.1;
      for (let y = 0; y < spriteH; y += 1) {
        for (let x = 0; x < spriteW; x += 1) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.hypot(dx, dy);
          const angle = Math.atan2(dy, dx);
          const falloff = smooth(bodyR, bodyR + 14, dist);
          const group = Math.sin(angle * 4);
          const radial = Math.sin(phase) * group * 9 * amount * falloff;
          const tangential = Math.cos(phase) * group * 5 * amount * falloff;
          const srcDist = Math.max(0, dist - radial);
          const srcAngle = angle - tangential / Math.max(dist, 1);
          const color = sample(cx + Math.cos(srcAngle) * srcDist, cy + Math.sin(srcAngle) * srcDist);
          const index = (y * spriteW + x) * 4;
          out[index] = color[0];
          out[index + 1] = color[1];
          out[index + 2] = color[2];
          out[index + 3] = color[3];
        }
      }
      spiderCtx.putImageData(framePixels, 0, 0);
    };

    let webs: Web[] = [];
    let shown = 0;
    let mode: "build" | "crawl" | "sit" = "build";
    let modeUntil = 0;
    let crawlFrom = 0;
    let crawlDuration = 1000;
    let hub = cornerPoint(corner);
    let arrivedAt = 0;

    const spawnWeb = () => {
      hub = cornerPoint(corner);
      pos = { ...hub };
      arrivedAt = performance.now();
      const radius = narrow()
        ? Math.min(44, width * 0.1, height * 0.08)
        : Math.min(108, width * 0.16, height * 0.18);
      webs = webs.filter((web) => web.alpha > 0.05).slice(-1);
      webs.push({ segments: buildWeb(hub, radius), alpha: 1 });
      shown = 0;
      mode = "build";
      modeUntil = performance.now() + 700;
    };

    const strokeSegment = (piece: Segment) => {
      webCtx.beginPath();
      webCtx.moveTo(piece.a.x, piece.a.y);
      webCtx.quadraticCurveTo(piece.c.x, piece.c.y, piece.b.x, piece.b.y);
      webCtx.stroke();
    };

    const drawWebs = () => {
      webCtx.clearRect(0, 0, width, height);
      const light = silkIsLight();
      webCtx.lineCap = "round";
      webCtx.lineJoin = "round";
      webs.forEach((web) => {
        const count = Math.max(1, Math.round(web.segments.length * Math.min(1, shown)));
        webCtx.strokeStyle = light
          ? `rgba(255, 255, 255, ${0.16 * web.alpha})`
          : `rgba(30, 28, 24, ${0.2 * web.alpha})`;
        webCtx.lineWidth = 1.05;
        for (let index = 0; index < count; index += 1) strokeSegment(web.segments[index]);
        webCtx.strokeStyle = light
          ? `rgba(255, 252, 246, ${0.82 * web.alpha})`
          : `rgba(62, 56, 48, ${0.78 * web.alpha})`;
        webCtx.lineWidth = 0.4;
        for (let index = 0; index < count; index += 1) strokeSegment(web.segments[index]);
      });

    };

    const startCrawl = (now: number) => {
      crawlStart = cornerPoint(corner);
      const step = Math.random() < 0.5 ? 1 : 3;
      corner = (corner + step) % 4;
      crawlEnd = cornerPoint(corner);
      pos = { ...crawlStart };
      mode = "crawl";
      crawlFrom = now;
      crawlDuration = 3000;
      const dx = crawlEnd.x - crawlStart.x;
      const dy = crawlEnd.y - crawlStart.y;
      rotation = Math.atan2(dy, dx) - Math.PI / 2;
      webs.forEach((web) => {
        web.alpha = Math.min(web.alpha, 0.35);
      });
    };

    if (!reduced) spawnWeb();
    placeSpider();

    const tick = (now: number) => {
      if (!running) return;
      frame = requestAnimationFrame(tick);
      if (document.hidden || document.querySelector("[data-greeting-intro]")) return;

      if (mode === "build") {
        shown += 0.018;
        pos = cornerPoint(corner);
        if (shown >= 1 && now >= modeUntil) {
          mode = "sit";
          modeUntil = arrivedAt + 3000;
        }
      }

      if (mode === "crawl") {
        const t = Math.min(1, (now - crawlFrom) / crawlDuration);
        const eased = t * t * (3 - 2 * t);
        pos = {
          x: crawlStart.x + (crawlEnd.x - crawlStart.x) * eased,
          y: crawlStart.y + (crawlEnd.y - crawlStart.y) * eased,
        };
        if (t >= 1) spawnWeb();
      }

      if (mode === "sit") {
        pos = cornerPoint(corner);
        if (now >= modeUntil) startCrawl(now);
      }

      const moved = Math.hypot(pos.x - previous.x, pos.y - previous.y);
      if (moved > 0.4) gait += moved * 0.085;
      stride += ((moved > 0.4 ? 1 : 0) - stride) * 0.12;
      previous.x = pos.x;
      previous.y = pos.y;

      webs.forEach((web, index) => {
        if (index < webs.length - 1) web.alpha = Math.max(0, web.alpha - 0.01);
      });

      placeSpider();
      const blocked = shieldRects();
      const onReading = blocked.some(
        (rect) =>
          pos.x >= rect.left - 16 &&
          pos.x <= rect.right + 16 &&
          pos.y >= rect.top - 16 &&
          pos.y <= rect.bottom + 16,
      );
      spiderCanvas.style.opacity = onReading ? "0" : "1";
      if (pixels) {
        if (stride > 0.04) paintSpider(gait, stride);
        else spiderCtx.putImageData(pixels, 0, 0);
      }
      drawWebs();
      eraseShields(webCtx, blocked);
    };

    if (!reduced) frame = requestAnimationFrame(tick);
    const onResize = () => {
      resize();
      if (mode !== "crawl") {
        pos = cornerPoint(corner);
        hub = { ...pos };
      }
    };
    window.addEventListener("resize", onResize);
    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true">
      <canvas ref={webRef} className="absolute inset-0" />
      <canvas
        ref={spiderRef}
        className="absolute max-w-none"
        style={{ filter: "drop-shadow(0 8px 6px rgba(0,0,0,0.35))" }}
      />
    </div>
  );
};
