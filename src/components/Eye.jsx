import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../eye.css";

const Eye = ({
  look = "center",
  autoLook = true,
  closed = false,
  percentage = null,
}) => {
  const eyeRef = useRef(null);
  const pupilRef = useRef(null);
  const percentageRef = useRef(null);
  const [isBlinking, setIsBlinking] = useState(false);
  const [showPercentage, setShowPercentage] = useState(false);
  const timeoutRef = useRef(null);

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
      if (closed || isBlinking || showPercentage) return;

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
  }, [autoLook, closed, isBlinking, showPercentage]);

  // Manual look
  useEffect(() => {
    if (autoLook || closed || isBlinking || showPercentage) return;

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
  }, [look, autoLook, closed, isBlinking, showPercentage]);

  // Blink effect
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

  // Percentage show logic
  useEffect(() => {
    if (percentage !== null) {
      setShowPercentage(true);

      // hide pupil
      gsap.to(pupilRef.current, { autoAlpha: 0, duration: 0.3 });

      // show percentage
      gsap.fromTo(
        percentageRef.current,
        { autoAlpha: 0, scale: 0.5 },
        { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );

      timeoutRef.current = setTimeout(() => {
        // hide percentage
        gsap.to(percentageRef.current, {
          autoAlpha: 0,
          scale: 0.5,
          duration: 0.3,
          ease: "power2.in",
        });

        // show pupil again
        gsap.to(pupilRef.current, { autoAlpha: 1, duration: 0.4 });

        setShowPercentage(false);
      }, 3000);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [percentage]);

  return (
    <div className="eye-wrapper">
      <div ref={eyeRef} className="eye">
        <div
          ref={pupilRef}
          className="pupil relative flex items-center justify-center"
        />
        <div
          ref={percentageRef}
          className="absolute inset-0 flex items-center justify-center text-white text-sm font-bold pointer-events-none"
          style={{ opacity: 0 }}
        >
          {percentage !== null && `${Math.round(percentage)}%`}
        </div>
      </div>
    </div>
  );
};

export default Eye;