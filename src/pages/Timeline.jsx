import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaCode, FaLaptopCode, FaRocket, FaCheckCircle } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const milestones = [
  {
    icon: <FaCode className="text-2xl" />,
    title: "Started Coding",
    desc: "Wrote my first line of code and fell in love with the logic.",
    year: "2020",
    color: "text-gray-800",
  },
  {
    icon: <FaLaptopCode className="text-2xl" />,
    title: "Built My First Website",
    desc: "Created a simple HTML/CSS portfolio and published it online.",
    year: "2021",
    color: "text-gray-800",
  },
  {
    icon: <FaRocket className="text-2xl" />,
    title: "Explored React & Game Dev",
    desc: "Started building real-world projects and games with React & Unity.",
    year: "2022",
    color: "text-gray-800",
  },
  {
    icon: <FaCheckCircle className="text-2xl" />,
    title: "Still Learning, Always Growing",
    desc: "Every bug, every build, every brainstorm fuels my journey.",
    year: "2025",
    color: "text-gray-800",
  },
];

const Timeline = () => {
  const timelineRef = useRef([]);
  const pathRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const path = pathRef.current;
    const pathLength = path.getTotalLength();

    path.style.strokeDasharray = pathLength;
    path.style.strokeDashoffset = pathLength;

    // Get Y thresholds for each card from path
    const cardOffsets = milestones.map((_, i) => {
      const pct = (i + 1) / (milestones.length + 1);
      const point = path.getPointAtLength(pathLength * pct);
      return point.y;
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const drawn = pathLength * progress;
        path.style.strokeDashoffset = pathLength - drawn;

        // Reveal cards as path crosses their point
        cardOffsets.forEach((y, i) => {
          const currentPoint = path.getPointAtLength(drawn);
          const card = timelineRef.current[i];
          const threshold = 20;
          if (currentPoint.y >= y - threshold) {
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power3.out",
            });
          } else {
            gsap.to(card, {
              opacity: 0,
              y: 50,
              duration: 0.5,
              ease: "power3.in",
            });
          }
        });
      },
    });

    gsap.set(timelineRef.current, { opacity: 0, y: 50 });

    gsap.to(".timeline-dot", {
      y: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-white/100 to-white/60 backdrop-blur-xl text-white px-24 py-32 overflow-hidden -mt-10"
    >
      <h1 className="text-4xl sm:text-8xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-800">
        My Dev Journey
      </h1>

      {/* Wide SVG Path */}
      <div className="absolute w-full h-full top-0 left-0 pointer-events-none z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
        >
          <path
            ref={pathRef}
            d="M500,0 
              C1000,150 0,300 500,450 
              C1000,600 0,750 500,900"
            stroke="url(#pathGradient)"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient
              id="pathGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#000000" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Timeline Cards */}
      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-44">
        {milestones.map((step, i) => (
          <div
            key={i}
            ref={(el) => (timelineRef.current[i] = el)}
            className={`relative group flex ${
              i % 2 === 0 ? "justify-start pl-10" : "justify-end pr-10"
            }`}
          >
            <div
              className={`absolute top-1/2 -translate-y-1/2 border border-gray-600 text-lg ${
                i % 2 === 0 ? "-left-6" : "-right-6"
              } rounded-full p-3 shadow-lg timeline-dot bg-gradient-to-br ${
                step.color
              } text-gray-800 flex items-center justify-center z-10`}
            >
              {step.icon}
              <span className="absolute -bottom-7 text-md font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                {step.year}
              </span>
            </div>

            <div
              className={`max-w-md w-full
              backdrop-blur-sm rounded-full shadow-2xl p-10 
              border border-black
              transition-all duration-500 
              group-hover:scale-[1.02] 
              group-hover:border-slate-500/50
              group-hover:shadow-lg
              relative overflow-hidden
              ${i % 2 === 0 ? "text-left ml-12" : "text-right mr-12"}`}
            >
              <div
                className={`absolute -inset-0.5 bg-gradient-to-br ${step.color} rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
              ></div>

              <div className="relative">
                <h3 className="text-2xl font-bold mb-3 text-transparent bg-clip-text bg-gray-700">
                  {step.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Timeline;
