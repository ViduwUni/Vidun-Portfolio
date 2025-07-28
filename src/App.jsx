import {
  Suspense,
  useEffect,
  useRef,
  useState,
  lazy,
  createContext,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import FPSCounter from "./components/FPSCounter";
import LoaderReveal from "./components/LoaderReveal";
import CursorFollower from "./components/CursorFollower";
import { useInView } from "react-intersection-observer";
import Experience from "./components/Experience";
import Navbar from "./components/Navbar";

// Lazy-load heavy sections
const Intro = lazy(() => import("./pages/Intro"));
const Me = lazy(() => import("./pages/Me"));
const Skills = lazy(() => import("./pages/Skills"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));

// eslint-disable-next-line react-refresh/only-export-components
export const SmoothScrollContext = createContext();

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

function App() {
  const wrapperRef = useRef();
  const contentRef = useRef();
  const smootherRef = useRef();
  const [checkedFromLoader, setCheckedFromLoader] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    smootherRef.current = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 6.5,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });

    // Prevent smoother reinit on HMR
    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
        smootherRef.current = null;
      }
    };
  }, []);

  const pages = [
    () => <Intro checked={checkedFromLoader} />,
    Me,
    Skills,
    Timeline,
    Projects,
    Contact,
  ];

  return (
    <SmoothScrollContext.Provider value={smootherRef}>
      <FPSCounter />
      <CursorFollower size={100} />
      <Navbar checked={checkedFromLoader} />

      <div ref={ref} className="canvas-wrapper">
        {inView && (
          <Canvas
            shadows
            camera={{ position: [20, 10, 10], fov: 50 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: -1,
              pointerEvents: "auto",
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

      <LoaderReveal onCheckedChange={setCheckedFromLoader}>
        <div
          id="smooth-wrapper"
          ref={wrapperRef}
          className="pointer-events-auto relative z-0"
        >
          <div id="smooth-content" ref={contentRef}>
            <main className="w-full">
              <Suspense
                fallback={<div className="text-white p-10">Loading...</div>}
              >
                {pages.map((Page, index) => (
                  <section
                    key={index}
                    id={
                      [
                        "intro",
                        "me",
                        "skills",
                        "timeline",
                        "projects",
                        "contact",
                      ][index]
                    }
                    className="min-h-screen w-full"
                  >
                    {typeof Page === "function" ? <Page /> : <Page />}
                  </section>
                ))}
              </Suspense>
            </main>
          </div>
        </div>
      </LoaderReveal>
    </SmoothScrollContext.Provider>
  );
}

export default App;
