import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../eye.css";

const Eye = ({ look = "center", autoLook = true, closed = false }) => {
  const eyeRef = useRef(null);
  const pupilRef = useRef(null);
  const [isBlinking, setIsBlinking] = useState(false);

  const movePupil = (x, y) => {
    gsap.to(pupilRef.current, {
      x,
      y,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  // Cursor-follow logic
  useEffect(() => {
    if (!autoLook) return;

    const handleMouseMove = (e) => {
      if (closed || isBlinking) return;

      const eye = eyeRef.current.getBoundingClientRect();
      const centerX = eye.left + eye.width / 2;
      const centerY = eye.top + eye.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(eye.width / 4, Math.hypot(dx, dy));

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      movePupil(pupilX, pupilY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [autoLook, closed, isBlinking]);

  // Manual look when autoLook is false
  useEffect(() => {
    if (autoLook || closed || isBlinking) return;

    const offset = 20;
    const directions = {
      center: [0, 0],
      left: [-offset, 0],
      right: [offset, 0],
      up: [0, -offset],
      down: [0, offset],
    };

    if (look in directions) {
      movePupil(...directions[look]);
    }
  }, [look, autoLook, closed, isBlinking]);

  // Animate pupil to close/open
  useEffect(() => {
    gsap.to(pupilRef.current, {
      scaleY: closed || isBlinking ? 0.1 : 1,
      duration: 0.2,
      transformOrigin: "center",
    });
  }, [closed, isBlinking]);

  // Auto blink
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="eye-wrapper">
      <div ref={eyeRef} className="eye">
        <div ref={pupilRef} className="pupil" />
      </div>
    </div>
  );
};

export default Eye;
