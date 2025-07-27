import React, { useEffect, useRef } from "react";

const CursorFollower = ({ size = 100 }) => {
  const circleRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const prevPos = useRef({ x: 0, y: 0 });
  const scale = useRef({ x: 1, y: 1 });

  useEffect(() => {
    let rafId;
    const damping = 0.15; // Lower = more fluid
    const stretchFactor = 0.2; // How much it stretches when moving fast
    const maxStretch = 1.5; // Maximum stretch amount
    const recoverySpeed = 0.1; // How quickly it returns to normal shape

    const updateMouse = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const followMouse = () => {
      // Calculate velocity
      velocity.current.x = mouse.current.x - prevPos.current.x;
      velocity.current.y = mouse.current.y - prevPos.current.y;

      // Store previous position for next frame
      prevPos.current.x = mouse.current.x;
      prevPos.current.y = mouse.current.y;

      // Smooth follow movement
      pos.current.x += (mouse.current.x - pos.current.x) * damping;
      pos.current.y += (mouse.current.y - pos.current.y) * damping;

      // Calculate speed for stretch effect
      const speed = Math.sqrt(
        velocity.current.x * velocity.current.x +
          velocity.current.y * velocity.current.y
      );

      // Normalize speed to a 0-1 range (adjust divisor as needed)
      const normalizedSpeed = Math.min(speed / 20, 1);

      // Calculate stretch based on direction and speed
      if (speed > 2) {
        const angle = Math.atan2(velocity.current.y, velocity.current.x);
        const stretchX =
          1 +
          normalizedSpeed *
            stretchFactor *
            Math.abs(Math.cos(angle)) *
            maxStretch;
        const stretchY =
          1 - normalizedSpeed * stretchFactor * Math.abs(Math.sin(angle)) * 0.5;

        scale.current.x += (stretchX - scale.current.x) * 0.3;
        scale.current.y += (stretchY - scale.current.y) * 0.3;
      } else {
        // Gradually return to normal shape when not moving fast
        scale.current.x += (1 - scale.current.x) * recoverySpeed;
        scale.current.y += (1 - scale.current.y) * recoverySpeed;
      }

      if (circleRef.current) {
        circleRef.current.style.transform = `translate3d(${
          pos.current.x - size / 2
        }px, ${pos.current.y - size / 2}px, 0) scaleX(${
          scale.current.x
        }) scaleY(${scale.current.y})`;
      }

      rafId = requestAnimationFrame(followMouse);
    };

    window.addEventListener("mousemove", updateMouse);
    // Initialize previous position
    prevPos.current.x = mouse.current.x;
    prevPos.current.y = mouse.current.y;
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
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        border: "2px solid rgba(0,0,0,0.3)",
        opacity: 1,
        willChange: "transform",
        transformOrigin: "center center",
        transition: "transform 0.05s ease-out", // Smooth the scale changes
      }}
    />
  );
};

export default CursorFollower;
