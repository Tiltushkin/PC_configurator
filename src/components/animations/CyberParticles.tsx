import { useEffect, useRef } from "react";

type Props = {
  density?: number;
  speed?: number;
  zIndex?: number;
};

export default function CyberParticles({ density = 0.06, speed = 1, zIndex = 0 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    let width = 0, height = 0;
    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    type P = { x: number; y: number; vx: number; vy: number; life: number; hue: number; };
    let parts: P[] = [];

    function init() {
      const count = Math.floor((width * height) / 100000 * density);
      parts = [];
      for (let i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6 * speed,
          vy: (Math.random() - 0.5) * 0.6 * speed,
          life: Math.random() * 120 + 60,
          hue: 350 + Math.random() * 20
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        p.x += p.vx; p.y += p.vy; p.life -= 1;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
        if (p.life < 0) { p.x = Math.random()*width; p.y = Math.random()*height; p.vx = (Math.random()-0.5)*0.6*speed; p.vy = (Math.random()-0.5)*0.6*speed; p.life = Math.random()*120+60; }
        const alpha = Math.max(0.1, Math.min(1, p.life / 120));
        ctx.shadowBlur = 18;
        ctx.shadowColor = `hsla(${p.hue}, 100%, 60%, ${alpha})`;
        ctx.fillStyle = `hsla(${p.hue}, 95%, 55%, ${alpha})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI*2); ctx.fill();
        if (Math.random() < 0.02) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx*10, p.y - p.vy*10);
          ctx.lineWidth = 1; ctx.strokeStyle = `hsla(${p.hue}, 100%, 70%, ${alpha * 0.6})`; ctx.stroke();
        }
      }
      raf.current = requestAnimationFrame(step);
    }

    resize();
    window.addEventListener("resize", resize);
    raf.current = requestAnimationFrame(step);
    return () => {
      window.removeEventListener("resize", resize);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [density, speed]);

  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex, pointerEvents: "none" }} />;
}
