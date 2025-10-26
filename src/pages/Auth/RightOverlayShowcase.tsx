import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DemoBuild = {
  title: string;
  cpu: string;
  gpu: string;
  price: string;
  fpsHint?: string;
};

const DEMO: DemoBuild[] = [
  { title: "Radeon Raider", cpu: "Ryzen 5 5600", gpu: "Radeon RX 6700 XT", price: "≈ $900", fpsHint: "1440p High" },
  { title: "Scarlet Striker", cpu: "Core i5‑12400F", gpu: "GeForce RTX 3060 Ti", price: "≈ $1000", fpsHint: "1080p Ultra" },
  { title: "Crimson Titan", cpu: "Ryzen 7 5800X3D", gpu: "GeForce RTX 4070", price: "≈ $1600", fpsHint: "1440p Ultra" },
];

const fade = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  in: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22,1,0.36,1] } },
  out: { opacity: 0, y: -8, filter: "blur(6px)", transition: { duration: 0.3, ease: [0.65,0,0.35,1] } },
};

export default function RightOverlayShowcase() {
  const [idx, setIdx] = useState(0);
  const builds = useMemo(() => DEMO, []);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % builds.length), 2800);
    return () => clearInterval(id);
  }, [builds.length]);

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <h3 style={{ margin: 0, fontSize: 20, letterSpacing: .4, color: "var(--text-0)" }}>Собери ПК мечты уже сейчас</h3>
        <p style={{ margin: 0, opacity: .75, fontSize: 14, lineHeight: 1.5 }}>
          Войди в аккаунт и начни с готовых геймерских конфигов — адаптируй под себя за пару кликов.
        </p>
      </div>

      <div aria-hidden style={{ height: 160, position: "relative" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            variants={fade}
            initial="initial"
            animate="in"
            exit="out"
            className="card"
            style={{ position: "absolute", inset: 0, padding: 16, display: "grid", gap: 10 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <strong style={{ fontSize: 16 }}>{builds[idx].title}</strong>
              <span style={{ fontSize: 12, opacity: .8 }}>{builds[idx].fpsHint}</span>
            </div>
            <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
              <div><span style={{ opacity: .7 }}>CPU:</span> {builds[idx].cpu}</div>
              <div><span style={{ opacity: .7 }}>GPU:</span> {builds[idx].gpu}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
              <span style={{ fontWeight: 700 }}>{builds[idx].price}</span>
              <span style={{ fontSize: 12, opacity: .8 }}>примерная цена</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: "flex", gap: 6 }}>
        {builds.map((_, i) => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: 999,
            background: i === idx ? "var(--accent)" : "var(--stroke)",
            opacity: i === idx ? 1 : .6
          }} />
        ))}
      </div>
    </div>
  );
}
