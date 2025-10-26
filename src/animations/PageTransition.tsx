import { motion } from "framer-motion";
import { type ReactNode } from "react";

type Props = { children: ReactNode };

const variants = {
  initial: { opacity: 0, y: 10, filter: "blur(4px)" },
  in: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  out: { opacity: 0, y: -10, filter: "blur(6px)", transition: { duration: 0.35, ease: [0.65, 0, 0.35, 1] } },
};

export default function PageTransition({ children }: Props) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={variants}
      style={{ willChange: "transform, filter, opacity" }}
    >
      {children}
    </motion.div>
  );
}
