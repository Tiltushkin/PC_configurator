function enableTilt(el: HTMLElement) {
  if (el.dataset.tilt === "false") return;
  if ((el as any).__tiltEnabled) return;
  (el as any).__tiltEnabled = true;

  el.style.transformStyle = "preserve-3d";
  el.style.willChange = "transform, box-shadow";

  const glare = document.createElement("div");
  glare.className = "tilt-glare";
  el.appendChild(glare);

  const max = 10;
  const handle = (e: PointerEvent) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const nx = (x / rect.width) * 2 - 1;
    const ny = (y / rect.height) * 2 - 1;
    const rx = (+ny) * max;
    const ry = (-nx) * max;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    const gx = nx * 50 + 50;
    const gy = ny * 50 + 50;
    glare.style.background = `radial-gradient(110px 110px at ${gx}% ${gy}%, rgba(255,255,255,0.22), rgba(255,255,255,0.0) 60%)`;
  };

  el.addEventListener("pointermove", handle);
  el.addEventListener("pointerleave", () => {
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
    el.style.boxShadow = "var(--glow)";
    glare.style.background = "transparent";
  });
}

function scan() {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>(".card"));
  nodes.forEach(enableTilt);
}

const mo = new MutationObserver(scan);
mo.observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener("DOMContentLoaded", scan);
scan();
