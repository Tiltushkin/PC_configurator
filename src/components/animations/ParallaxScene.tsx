import { useEffect, useRef } from "react";

type Props = { intensity?: number };

export default function ParallaxScene({ intensity = 0.06 }: Props) {
  const raf = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const { innerWidth: w, innerHeight: h } = window;
      const nx = (e.clientX / w) * 2 - 1;
      const ny = (e.clientY / h) * 2 - 1;
      target.current.x = nx;
      target.current.y = ny;
    }
    function loop() {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      const rx = current.current.y * intensity * -1;
      const ry = current.current.x * intensity;
      document.documentElement.style.setProperty("--parallax-rx", `${rx}turn`);
      document.documentElement.style.setProperty("--parallax-ry", `${ry}turn`);
      document.documentElement.style.setProperty("--parallax-ox", `${current.current.x * 12}px`);
      document.documentElement.style.setProperty("--parallax-oy", `${current.current.y * 12}px`);
      raf.current = requestAnimationFrame(loop);
    }
    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [intensity]);

  return null;
}
