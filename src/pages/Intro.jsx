import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import Experience from "../components/Experience";
import { Preload, Loader } from "@react-three/drei";
import SplitType from "split-type";
import gsap from "gsap";
import { useInView } from "react-intersection-observer";

const CameraAnimation = () => {
  useFrame(({ camera }) => {
    const time = Date.now() * 0.001;
    const radius = 14 + Math.sin(time * 0.1) * 2;
    const speed = 0.2;

    camera.position.x +=
      (Math.cos(time * speed) * radius - camera.position.x) * 0.05;
    camera.position.y = 10 + Math.sin(time * speed * 0.5) * 3;
    camera.position.z +=
      (Math.sin(time * speed) * radius - camera.position.z) * 0.05;

    camera.lookAt(0, 0, 0);
  });

  return null;
};

const Intro = ({ checked }) => {
  const myName = "Vidun.Nethula".toUpperCase();
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    let split;
    let timeout;

    if (checked) {
      split = new SplitType("#myname");
      gsap.set(".char", { y: 100, opacity: 0 });
      gsap.set("#myname", { opacity: 1 });

      timeout = setTimeout(() => {
        gsap.to(".char", {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.3,
          ease: "back.out",
        });
      }, 1200);
    }

    return () => {
      clearTimeout(timeout);
      if (split) split.revert();
    };
  }, [checked]);

  return (
    <section className="relative min-h-screen w-full flex justify-center items-center text-gray-950 text-2xl font-bold">
      <div ref={ref} className="canvas-wrapper">
        {inView && (
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
            }}
          >
            <Suspense fallback={null}>
              <CameraAnimation />
              <Experience />
              <Preload all />
            </Suspense>
          </Canvas>
        )}
      </div>

      <div className="relative z-10">
        <h1
          id="myname"
          className="splitName tracking-widest opacity-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem] font-bold"
        >
          {myName}
        </h1>
      </div>

      {/* Optional loading UI */}
      <Loader />
    </section>
  );
};

export default Intro;
