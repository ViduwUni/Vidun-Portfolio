import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { SiMinutemailer } from "react-icons/si";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const headingRef = useRef();
  const subheadingRef = useRef();
  const divRef = useRef();

  useEffect(() => {
    const fadeInOut = (target, delay = 0) => {
      gsap.fromTo(
        target,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
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

    fadeInOut(headingRef.current);
    fadeInOut(subheadingRef.current, 0.2);
    fadeInOut(divRef.current, 0.3);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col bg-gradient-to-b from-white/90 to-black/20 backdrop-blur-xl text-gray-950 text-2xl font-bold p-8">
      <div className="flex flex-col items-center text-center space-y-1 mt-32">
        <h4 ref={subheadingRef} className="text-lg text-gray-700">
          HAVE QUESTIONS? GET IN TOUCH
        </h4>
        <h1 ref={headingRef} className="text-9xl font-bold text-gray-900">
          CONTACT US
        </h1>
      </div>

      {/* White box pinned at bottom */}
      <div
        ref={divRef}
        className="absolute border-[2px] border-gray-500 bottom-0 left-0 right-0 bg-white pt-20 px-20 pb-10 mb-0 rounded-t-3xl rounded-b-none shadow-lg max-w-4xl min-w-[300px] mx-auto"
      >
        <button
          type="submit"
          className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 flex items-center justify-center text-white text-2xl bg-my-mid-dark transition rounded-full shadow-md z-10"
        >
          <SiMinutemailer />
        </button>
        <form className="grid gap-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              className="bg-black/30 backdrop-blur-md placeholder-gray-400 border border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="bg-black/30 backdrop-blur-md placeholder-gray-400 border border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="bg-black/30 backdrop-blur-md placeholder-gray-400 border border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <input
              name="phone"
              type="text"
              placeholder="Phone"
              className="bg-black/30 backdrop-blur-md placeholder-gray-400 border border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
          </div>

          {/* Row 3 */}
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            className="bg-black/30 backdrop-blur-md placeholder-gray-400 border border-gray-600 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </form>
      </div>
    </section>
  );
};

export default Contact;
