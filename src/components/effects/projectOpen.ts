/** Pose for one card in the project deck. Each card leans a little further than the one in front. */
export function projectStackVars(index: number): Record<string, string> {
  const tiltX = Math.min(3 + index * 3, 21);
  const tiltY = Math.max(-3 - index * 1.4, -14);
  const depth = Math.max(-index * 24, -144);
  return {
    "--tilt-x": `${tiltX}deg`,
    "--tilt-y": `${tiltY}deg`,
    "--depth": `${depth}px`,
    "--stack-index": String(24 - index),
  };
}
