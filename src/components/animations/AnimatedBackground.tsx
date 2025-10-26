import { memo } from "react";

const AnimatedBackground = memo(() => {
  return (
    <>
      <div className="grid-bg" />
      <div className="scanlines" />
    </>
  );
});
export default AnimatedBackground;