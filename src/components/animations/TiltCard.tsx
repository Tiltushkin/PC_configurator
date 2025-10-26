import React, { useRef, useEffect } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  maxTilt?: number;
  scale?: number;
  glare?: boolean;
};

export default function TiltCard({ maxTilt = 8, scale = 1.02, glare = true, style, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  let frame = 0, px = 0, py = 0;

  useEffect(() => {
    const el = ref.current!;
    function onMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const nx = (x / rect.width) * 2 - 1;
      const ny = (y / rect.height) * 2 - 1;
      px = nx; py = ny;
      if (!frame) frame = requestAnimationFrame(apply);
    }
    function onLeave() {
      px = 0; py = 0; if (!frame) frame = requestAnimationFrame(apply);
    }
    function apply() {
      frame = 0;
      const rx = -(py * maxTilt);
      const ry = px * maxTilt;
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
      if (glare) {
        const gx = (px + 1) * 50;
        const gy = (py + 1) * 50;
        el.style.setProperty("--glare-x", gx + "%");
        el.style.setProperty("--glare-y", gy + "%");
      }
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [maxTilt, scale, glare]);

  return (
    <div
      ref={ref}
      {...rest}
      style={{ transformStyle: "preserve-3d", willChange: "transform", transition: "transform .15s ease", ...style }}
      className={(rest.className ?? "") + " tilt-card"}
    >
      {children}
    </div>
  );
}
