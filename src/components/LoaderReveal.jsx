import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

const LoaderReveal = ({ children, onCheckedChange }) => {
  const [hidden, setHidden] = useState(false);
  const [tempStop, setTempStop] = useState(true); // 👈 tempStop
  const textRef = useRef(null);
  const subTextRef = useRef(null);
  const descRef = useRef(null);
  const maskRef = useRef(null);
  const overlayRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked((prev) => {
      const newVal = !prev;
      if (onCheckedChange) onCheckedChange(newVal);
      return newVal;
    });
  };

  useEffect(() => {
    const text = "Welcome to My Portfolio";
    const subText = "Still in development phase";
    const desc = "Feel free to explore (Expect bugs and issues)";

    let index = 0;
    let subIndex = 0;
    let descIndex = 0;

    const interval = setInterval(() => {
      if (textRef.current && index < text.length) {
        textRef.current.textContent += text[index++];
      } else if (subTextRef.current && subIndex < subText.length) {
        subTextRef.current.textContent += subText[subIndex++];
      } else if (descRef.current && descIndex < desc.length) {
        descRef.current.textContent += desc[descIndex++];
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    // Circle reveal animation
    gsap.to(maskRef.current, {
      clipPath: "circle(0% at 50% 50%)",
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        setHidden(true);
        setTempStop(false);
      },
    });
  };

  return (
    <>
      <div>{children}</div>

      {tempStop && !hidden && (
        <div
          ref={overlayRef}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            pointerEvents: "auto",
          }}
        >
          <div
            ref={maskRef}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#111",
              clipPath: "circle(150% at 50% 50%)",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#fff",
              fontFamily: "'Fira Code', monospace",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            <div
              ref={textRef}
              style={{
                fontSize: "2rem",
                whiteSpace: "pre",
              }}
            />
            <div
              ref={subTextRef}
              style={{
                fontSize: "1rem",
                whiteSpace: "pre",
                marginBottom: "1.5rem",
              }}
            />
            <div
              ref={descRef}
              style={{
                fontSize: "0.9rem",
                whiteSpace: "pre-wrap",
                maxWidth: "400px",
                color: "#ccc",
                marginBottom: "2rem",
              }}
            />
            <button
              onClick={() => {
                handleStart();
                handleClick();
              }}
              style={{
                backgroundColor: "#fff",
                color: "#111",
                border: "none",
                padding: "0.8rem 2rem",
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: "8px",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
                boxShadow: "0 4px 10px rgba(255,255,255,0.2)",
              }}
            >
              Start
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoaderReveal;
