import { useEffect, useRef, useState, Suspense, lazy } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import FPSCounter from "./components/FPSCounter";
import LoaderReveal from "./components/LoaderReveal";
import CursorFollower from "./components/CursorFollower";

// Lazy-load heavy sections
const Intro = lazy(() => import("./pages/Intro"));
const Me = lazy(() => import("./pages/Me"));
const Skills = lazy(() => import("./pages/Skills"));
const Timeline = lazy(() => import("./pages/Timeline"));
const Projects = lazy(() => import("./pages/Projects"));
const Contact = lazy(() => import("./pages/Contact"));

function App() {
  const wrapperRef = useRef();
  const contentRef = useRef();
  const smootherRef = useRef();
  const [checkedFromLoader, setCheckedFromLoader] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

    smootherRef.current = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: 1.2,
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
    <>
      <FPSCounter />
      <CursorFollower size={100} />

      <LoaderReveal onCheckedChange={setCheckedFromLoader}>
        <div id="smooth-wrapper" ref={wrapperRef} className="relative z-0">
          <div id="smooth-content" ref={contentRef}>
            <main className="w-full">
              <Suspense
                fallback={<div className="text-white p-10">Loading...</div>}
              >
                {pages.map((Page, index) => (
                  <section key={index} className="min-h-screen w-full">
                    {typeof Page === "function" ? <Page /> : <Page />}
                  </section>
                ))}
              </Suspense>
            </main>
          </div>
        </div>
      </LoaderReveal>
    </>
  );
}

export default App;
