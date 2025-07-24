import React from "react";
import Experience from "../components/Experience";
import { Canvas } from "@react-three/fiber";

const Intro = () => {
  return (
    <section className="relative min-h-screen w-full flex justify-center items-center text-gray-950 text-2xl font-bold">
      <Canvas
        shadows
        camera={{ position: [20, 10, 10], fov: 50 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <Experience />
      </Canvas>

      <div className="relative z-10">
        <h1>( Intro )</h1>
      </div>
    </section>
  );
};

export default Intro;
