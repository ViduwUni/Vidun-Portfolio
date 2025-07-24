import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

import FPSCounter from "./components/FPSCounter";

// Your pages
import Intro from "./pages/Intro";
import Me from "./pages/Me";
import Skills from "./pages/Skills";
import Timeline from "./pages/Timeline";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

function App() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth ease
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Auto-scroll to closest section on scroll stop
    let scrollTimeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        const closest = sectionsRef.current.reduce((prev, section) => {
          const offset = Math.abs(section.offsetTop - scrollY);
          return offset < Math.abs(prev.offsetTop - scrollY) ? section : prev;
        });
        lenis.scrollTo(closest, { offset: 0, duration: 1.2 });
      }, 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // All your sections wrapped with refs
  const SectionList = [Intro, Me, Skills, Timeline, Projects, Contact];

  return (
    <>
      <FPSCounter />
      <main className="relative z-10 w-full">
        {SectionList.map((Section, index) => (
          <div
            key={index}
            ref={(el) => (sectionsRef.current[index] = el)}
            className="min-h-screen"
          >
            <Section />
          </div>
        ))}
      </main>
    </>
  );
}

export default App;
