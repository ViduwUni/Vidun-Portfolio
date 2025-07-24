import React, { useEffect, useRef, useState } from "react";

const CursorFollower = ({ size = 100 }) => {
  const circleRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const updateMouse = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Check if element under cursor is a canvas or inside a canvas
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (el && (el.tagName === "CANVAS" || el.closest("canvas"))) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("mousemove", updateMouse);

    const followMouse = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.1;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.1;

      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(${
          pos.current.x - size / 2
        }px, ${pos.current.y - size / 2}px, 0)`;
      }

      requestAnimationFrame(followMouse);
    };
    followMouse();

    return () => window.removeEventListener("mousemove", updateMouse);
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
        transition: "opacity 0.3s ease, background-color 0.2s ease",
        opacity: visible ? 1 : 0,
      }}
    />
  );
};

export default CursorFollower;
