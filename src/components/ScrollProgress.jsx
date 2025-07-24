import React from "react";

function ScrollProgress({ scrollProgress }) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
      <div
        className="h-full bg-[#f40c3f] transition-all duration-200"
        style={{
          width: `${scrollProgress}%`,
        }}
      />
    </div>
  );
}

export default ScrollProgress;
