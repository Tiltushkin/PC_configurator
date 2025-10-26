export const fxConfig = {
  particles: {
    density: 2.4,
    speed: 0.9,
    targetFps: 42,
  },
  parallax: {
    intensity: 0.05,
  },
  transitions: {
    durationIn: 0.38,
    durationOut: 0.28,
  }
};

export function isReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function shouldUseLiteMode() {
  const mem = (navigator as any).deviceMemory || 0;
  const cores = navigator.hardwareConcurrency || 0;
  const isSmall = window.innerWidth < 1024 || window.innerHeight < 720;
  return isReducedMotion() || (mem && mem <= 4) || (cores && cores <= 4) || isSmall;
}
