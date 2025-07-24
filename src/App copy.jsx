import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import FPSCounter from "./components/FPSCounter";
import LoadingScreen from "./components/LoadingScreen";

// Pages
import Intro from "./pages/Intro";
import Me from "./pages/Me";
import Skills from "./pages/Skills";
import Timeline from "./pages/Timeline";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

function App() {
  const wrapperRef = useRef();
  const contentRef = useRef();
  const smootherRef = useRef();
  const [loadingComplete, setLoadingComplete] = useState(false);

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

    return () => {
      if (smootherRef.current) {
        smootherRef.current.kill();
      }
    };
  }, []);

  const pages = [Intro, Me, Skills, Timeline, Projects, Contact];

  return (
    <>
      <FPSCounter />

      {/* Main content (rendered FIRST, behind loader) */}
      <div id="smooth-wrapper" ref={wrapperRef} className="relative z-0">
        <div id="smooth-content" ref={contentRef}>
          <main className="w-full">
            {pages.map((PageComponent, index) => (
              <section key={index} className="min-h-screen w-full">
                <PageComponent />
              </section>
            ))}
          </main>
        </div>
      </div>

      {/* Loading screen (covers content until hole reveals it) */}
      {!loadingComplete && (
        <div className="fixed inset-0 z-50">
          <LoadingScreen onComplete={() => setLoadingComplete(true)} />
        </div>
      )}
    </>
  );
}

export default App;
