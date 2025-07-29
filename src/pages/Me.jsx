import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  FaGithub,
  FaInstagramSquare,
  FaLinkedin,
  FaAddressCard,
} from "react-icons/fa";

gsap.registerPlugin(Draggable, ScrollTrigger);

const Me = () => {
  const socialLinks = [
    {
      label: "GitHub",
      href: "https://github.com/yourusername",
      icon: <FaGithub />,
    },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/yourusername",
      icon: <FaLinkedin />,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/yourname",
      icon: <FaInstagramSquare />,
    },
  ];

  const ImgRef = useRef(null);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const animationRef = useRef({});

  useEffect(() => {
    const img = ImgRef.current;

    // Floating animations
    const floatY = gsap.to(img, {
      y: -15,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      paused: true,
    });

    const floatX = gsap.to(img, {
      x: 8,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      paused: true,
    });

    animationRef.current.floatY = floatY;
    animationRef.current.floatX = floatX;

    // Fade animation
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
          duration: 2,
          delay,
          scrollTrigger: {
            trigger: target,
            start: "top 85%",
            end: "top 40%",
            toggleActions: "play reverse play reverse",
            scrub: 0.5,
            onEnter: () => {
              floatY.play();
              floatX.play();
            },
            onLeaveBack: () => {
              floatY.pause();
              floatX.pause();
            },
          },
        }
      );
    };

    fadeInOut(img);
    fadeInOut(contentRef.current, 0.1);

    return () => {
      floatY.kill();
      floatX.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <>
      <section className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-8 p-10 bg-gradient-to-b from-transparent via-white/60 to-white text-gray-950 overflow-hidden">
        {/* Left - Image */}
        <div
          ref={containerRef}
          className="flex justify-center items-center relative"
        >
          <img
            ref={ImgRef}
            src="/src/assets/images/Me.jpeg"
            alt="My Portrait"
            className="w-40 h-40 sm:w-56 sm:h-56 md:w-96 md:h-96 object-cover rounded-full shadow-lg cursor-grab active:cursor-grabbing"
          />
        </div>

        {/* Right - Content */}
        <div
          ref={contentRef}
          className="flex flex-col justify-center items-start gap-6 p-6 max-w-4xl mx-auto text-justify"
        >
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-bold text-left">
            Hi, I'm Vidun 👋
          </h1>

          <p className="text-base sm:text-lg md:text-2xl leading-relaxed">
            I'm a software engineering student passionate about exploring the
            endless possibilities of game development and building modern,
            user-friendly web applications. I love designing interactive
            experiences and solving real-world problems through code.
          </p>

          <p className="text-base sm:text-lg md:text-2xl leading-relaxed">
            I work with a range of languages and tools like Python, C++, C#, and
            JavaScript, constantly experimenting with new frameworks and
            technologies to grow as a creative and well-rounded developer.
          </p>

          {/* Social Buttons */}
          <div className="flex flex-wrap gap-4">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-2xl p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                {icon}
              </a>
            ))}
          </div>

          {/* Resume */}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 text-white flex flex-row items-center gap-3 px-6 py-2 rounded-2xl shadow hover:scale-105 transition"
          >
            View Resume
            <FaAddressCard />
          </a>
        </div>
      </section>
      <div className="h-32 w-full bg-white" />
    </>
  );
};

export default Me;
