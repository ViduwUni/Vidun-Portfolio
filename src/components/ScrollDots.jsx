import React from "react";

function ScrollDots({ SectionList, sectionsRef, lenis, currentSection }) {
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50">
      {SectionList.map((_, i) => (
        <button
          key={i}
          onClick={() => {
            const section = sectionsRef.current[i];
            if (section) lenis.scrollTo(section, { offset: 0, duration: 1.2 });
          }}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            currentSection === i ? "bg-[#f40c3f] scale-125" : "bg-gray-400"
          }`}
        />
      ))}
    </div>
  );
}

export default ScrollDots;
