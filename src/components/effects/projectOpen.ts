export const PROJECT_ROTATE_X = 5;
export const PROJECT_ROTATE_Y = -8;

export const projectPlaneClass =
  "project-plane [transform-style:preserve-3d]";

export type ProjectOpenOrigin = {
  id: string;
  src: string;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};

let pending: ProjectOpenOrigin | null = null;

export const rememberProjectOpen = (origin: ProjectOpenOrigin) => {
  pending = origin;
};

export const peekProjectOpen = (id: string) => {
  if (!pending || pending.id !== id) return null;
  return pending;
};

export const clearProjectOpen = () => {
  pending = null;
};

export const captureProjectImage = (id: string, image: HTMLImageElement) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = image.getBoundingClientRect();
  rememberProjectOpen({
    id,
    src: image.currentSrc || image.src,
    centerX: rect.left + rect.width / 2,
    centerY: rect.top + rect.height / 2,
    width: image.offsetWidth,
    height: image.offsetHeight,
  });
};
