import { useEffect } from "react";

function MouseMoveOverlay({ onMouseMove }) {
  // onMouseMove receives { x, y } normalized coords (-1 to 1)
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    onMouseMove({ x, y });
  };

  useEffect(() => {
    // Optional: prevent scrolling from this div if needed
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "auto",
        zIndex: 10,
        backgroundColor: "transparent",
      }}
    />
  );
}

export default MouseMoveOverlay;
