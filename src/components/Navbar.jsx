import { useContext, useEffect, useRef, useState } from "react";
import { SmoothScrollContext } from "../App";
import { gsap } from "gsap";
import Eye from "./Eye";

const Navbar = ({ checked }) => {
  const smootherRef = useContext(SmoothScrollContext);
  const navRef = useRef(null);
  const [activeLink, setActiveLink] = useState("#intro");
  const bubbleRef = useRef(null);

  // Update active link based on scroll position
  useEffect(() => {
    const sections = [
      "#intro",
      "#me",
      "#skills",
      "#timeline",
      "#projects",
      "#contact",
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        const element = document.querySelector(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveLink(section);
            moveBubble(section);
          }
        }
      });
    };

    const moveBubble = (section) => {
      const linkElement = document.querySelector(`a[href="${section}"]`);
      if (linkElement && bubbleRef.current && navRef.current) {
        // eslint-disable-next-line no-unused-vars
        const { left, width, top, height } =
          linkElement.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();

        // Calculate maximum size that fits within navbar
        const maxSize = Math.min(
          navRect.height * 0.8,
          Math.max(width, height) * 1.2
        );

        gsap.to(bubbleRef.current, {
          left: left - navRect.left + width / 2,
          top: navRect.height / 2, // Always center vertically in navbar
          width: maxSize,
          height: maxSize,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
        });
      }
    };

    // Initialize bubble position
    if (activeLink && navRef.current) {
      const linkElement = document.querySelector(`a[href="${activeLink}"]`);
      if (linkElement) {
        // eslint-disable-next-line no-unused-vars
        const { left, width, top, height } =
          linkElement.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();

        const maxSize = Math.min(
          navRect.height * 0.8,
          Math.max(width, height) * 1.2
        );

        gsap.set(bubbleRef.current, {
          left: left - navRect.left + width / 2,
          top: navRect.height / 2,
          width: maxSize,
          height: maxSize,
        });
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeLink]);

  // Rest of your component remains the same...
  useEffect(() => {
    let timeout;

    if (checked) {
      timeout = setTimeout(() => {
        gsap.fromTo(
          navRef.current,
          { y: -50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            delay: 0.5,
          }
        );
      }, 1200);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [checked]);

  const leftLinks = [
    { label: "Intro", href: "#intro" },
    { label: "Me", href: "#me" },
    { label: "Skills", href: "#skills" },
  ];

  const rightLinks = [
    { label: "Timeline", href: "#timeline" },
    { label: "Projects", href: "#projects" },
    { label: "Contact", href: "#contact" },
  ];

  const handleClick = (e, href) => {
    e.preventDefault();
    setActiveLink(href);
    const target = document.querySelector(href);
    if (target && smootherRef?.current) {
      smootherRef.current.scrollTo(target, {
        duration: 3,
        offset: 0,
        ease: "power1.Out",
      });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed opacity-0 top-7 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl bg-black/30 backdrop-blur-md rounded-full shadow-lg px-6 flex justify-between items-center border border-white/20 text-white"
    >
      {/* Constrained bubble indicator */}
      <div
        ref={bubbleRef}
        className="absolute rounded-full bg-slate-100 pointer-events-none mix-blend-screen"
        style={{
          transform: "translate(-50%, -50%)",
          filter: "blur(8px)",
          zIndex: 5,
          willChange: "left, width, height",
        }}
      />

      {/* Left Nav */}
      <div className="flex gap-4 md:gap-6 flex-1 justify-start items-center h-12 relative z-10">
        {leftLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`hover:text-gray-100 transition duration-200 whitespace-nowrap py-2 px-2 relative ${
              activeLink === link.href ? "text-gray-700" : ""
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Logo */}
      <div className="flex items-center justify-center h-full py-1 relative z-20">
        <Eye />
      </div>

      {/* Right Nav */}
      <div className="flex gap-4 md:gap-6 flex-1 justify-end items-center h-12 relative z-10">
        {rightLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={`hover:text-gray-100 transition duration-200 whitespace-nowrap py-2 px-2 relative ${
              activeLink === link.href ? "text-gray-700" : ""
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
