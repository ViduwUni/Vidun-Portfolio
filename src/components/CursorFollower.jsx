import React, { useEffect, useRef } from "react";

const CursorFollower = ({ size = 100 }) => {
  const circleRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const visible = useRef(false);
  const visibilityChanged = useRef(false);

  useEffect(() => {
    let rafId;

    const updateMouse = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      const el = document.elementFromPoint(e.clientX, e.clientY);
      const isVisible = el && (el.tagName === "CANVAS" || el.closest("canvas"));

      if (visible.current !== isVisible) {
        visible.current = isVisible;
        visibilityChanged.current = true;
      }
    };

    const followMouse = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(${
          pos.current.x - size / 2
        }px, ${pos.current.y - size / 2}px, 0)`;

        if (visibilityChanged.current) {
          circleRef.current.style.opacity = visible.current ? "1" : "0";
          visibilityChanged.current = false;
        }
      }

      rafId = requestAnimationFrame(followMouse);
    };

    window.addEventListener("mousemove", updateMouse);
    rafId = requestAnimationFrame(followMouse);

    return () => {
      window.removeEventListener("mousemove", updateMouse);
      cancelAnimationFrame(rafId);
    };
  }, [size]);

  return (
    <div
      ref={circleRef}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        mixBlendMode: "difference",
        backgroundColor: "#fff",
        border: "2px solid #000",
        opacity: 0,
        willChange: "transform, opacity",
      }}
    />
  );
};

export default CursorFollower;
