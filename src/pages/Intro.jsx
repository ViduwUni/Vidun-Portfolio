import { useEffect } from "react";
import SplitType from "split-type";
import gsap from "gsap";

const Intro = ({ checked }) => {
  const myName = "Vidun.Hettiarachchi".toUpperCase();

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
      <div className="relative z-10">
        <h1
          id="myname"
          className="splitName select-none tracking-widest opacity-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[7rem] font-bold"
        >
          {myName}
        </h1>
      </div>
    </section>
  );
};

export default Intro;
