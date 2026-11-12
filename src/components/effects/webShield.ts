const SHIELD_SELECTOR = [
  "main .surface-card",
  "main article",
  "main pre",
  "main blockquote",
  "main p",
  "main li",
  "main h1",
  "main h2",
  "main h3",
  "main h4",
  "main img",
].join(", ");

const onScreen = (rect: DOMRect, width: number, height: number) =>
  rect.width >= 8 &&
  rect.height >= 8 &&
  rect.bottom > 0 &&
  rect.right > 0 &&
  rect.top < height &&
  rect.left < width;

export const shieldRects = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const rects: DOMRect[] = [];
  document.querySelectorAll(SHIELD_SELECTOR).forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const rect = node.getBoundingClientRect();
    if (onScreen(rect, width, height)) rects.push(rect);
  });
  return rects;
};

export const pointOnShield = (x: number, y: number) => {
  const stack = document.elementsFromPoint(x, y);
  return stack.some((node) => node instanceof Element && !!node.closest(SHIELD_SELECTOR));
};

export const eraseShields = (ctx: CanvasRenderingContext2D, rects: DOMRect[]) => {
  if (rects.length === 0) return;
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#000";
  rects.forEach((rect) => {
    ctx.fillRect(rect.left - 3, rect.top - 3, rect.width + 6, rect.height + 6);
  });
  ctx.restore();
};
