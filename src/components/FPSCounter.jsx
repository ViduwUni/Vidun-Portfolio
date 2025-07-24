import React, { useEffect, useRef } from "react";
import Stats from "stats.js";

export default function FPSCounter() {
  const stats = useRef();

  useEffect(() => {
    stats.current = new Stats();
    stats.current.showPanel(0); // 0: fps panel
    document.body.appendChild(stats.current.dom);

    function animate() {
      stats.current.begin();
      stats.current.end();
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      document.body.removeChild(stats.current.dom);
    };
  }, []);

  return null; // no JSX output, stats UI is appended directly to DOM
}
