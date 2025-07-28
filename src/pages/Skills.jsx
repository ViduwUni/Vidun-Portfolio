import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skillEvent = {
  listeners: new Set(),
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  },
  notify(skill) {
    this.listeners.forEach((callback) => callback(skill));
  },
};

// eslint-disable-next-line react-refresh/only-export-components
export const onSkillClick = (callback) => {
  return skillEvent.subscribe(callback);
};

const Skills = () => {
  const skills = [
    { name: "React", percentage: 90 },
    { name: "TypeScript", percentage: 85 },
    { name: "Next.js", percentage: 88 },
    { name: "GSAP", percentage: 80 },
    { name: "Tailwind CSS", percentage: 92 },
    { name: "Node.js", percentage: 83 },
    { name: "Prisma", percentage: 78 },
    { name: "Framer Motion", percentage: 75 },
    { name: "Three.js", percentage: 70 },
    { name: "GraphQL", percentage: 82 },
  ];

  const containerRef = useRef(null);
  const marqueeRefs = useRef([]);
  const [particles, setParticles] = useState([]);
  const headingRef = useRef(null);
  const skillsContainerRef = useRef(null);

  useEffect(() => {
    const fadeInOut = (target, delay = 0) => {
      gsap.fromTo(
        target,
        { y: 120, opacity: 0, skewY: 8, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          skewY: 0,
          scale: 1,
          ease: "elastic.out(1, 0.4)",
          duration: 5,
          delay,
          scrollTrigger: {
            trigger: target,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play reverse play reverse",
            scrub: 0.5,
          },
        }
      );
    };

    if (headingRef.current && skillsContainerRef.current) {
      fadeInOut(headingRef.current);
      fadeInOut(skillsContainerRef.current, 0.2);
    }

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach((instance) => instance.kill());
    };
  }, []);

  const createParticles = (skill, event) => {
    const newParticles = [];
    const particleCount = 15;
    const { clientX: x, clientY: y } = event;

    skillEvent.notify(skill);

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Math.random().toString(36).substr(2, 9),
        x,
        y,
        color: i % 2 === 0 ? "#fbbf24" : "#f43f5e",
        angle: Math.random() * Math.PI * 2,
        speed: 2 + Math.random() * 3,
        size: 3 + Math.random() * 5,
        opacity: 1,
      });
    }
    setParticles(newParticles);

    setTimeout(() => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          opacity: 0,
          x: p.x + Math.cos(p.angle) * p.speed * 50,
          y: p.y + Math.sin(p.angle) * p.speed * 50,
        }))
      );
    }, 10);

    setTimeout(() => {
      setParticles([]);
    }, 1000);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      marqueeRefs.current.forEach((marquee, i) => {
        if (!marquee) return;

        const content = marquee.querySelector(".marquee-content");
        if (!content) return;

        const contentWidth = content.scrollWidth;
        const direction = i % 2 === 0 ? -1 : 1;
        const speedFactor = 0.4 + i * 0.1;

        gsap.fromTo(
          content,
          {
            x: direction === -1 ? 0 : -contentWidth * speedFactor,
          },
          {
            x: direction === -1 ? -contentWidth * speedFactor : 0,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="min-h-screen py-32 flex flex-col justify-center items-center bg-gradient-to-b from-white/100 to-black/80 backdrop-blur-xl text-gray-950 overflow-hidden relative"
    >
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: particle.x,
            top: particle.y,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            transform: `translate(-50%, -50%)`,
            transition: "all 1s ease-out",
          }}
        />
      ))}

      <h1
        ref={headingRef}
        className="text-6xl md:text-8xl self-start px-8 font-bold mb-16"
      >
        WHAT I KNOW
      </h1>

      <div ref={skillsContainerRef} className="w-full space-y-4">
        {[...Array(7)].map((_, rowIndex) => {
          const isEven = rowIndex % 2 === 0;
          const rowSkills = isEven ? skills : [...skills].reverse();
          const skillsToRender = [...rowSkills, ...rowSkills];

          return (
            <div
              key={rowIndex}
              className="overflow-hidden py-1 border border-gray-700"
            >
              <div
                ref={(el) => (marqueeRefs.current[rowIndex] = el)}
                className="relative"
              >
                <div className="marquee-content flex items-center gap-12 w-max">
                  {skillsToRender.map((skill, i) => (
                    <React.Fragment key={`${skill.name}-${i}`}>
                      <span
                        className={`text-6xl md:text-6xl font-extrabold uppercase whitespace-nowrap cursor-pointer hover:scale-110 transition-transform ${
                          i % 2 === 0 ? "text-slate-200" : ""
                        }`}
                        onClick={(e) => createParticles(skill, e)}
                      >
                        {skill.name}
                      </span>
                      <span className="text-6xl">•</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Skills;
