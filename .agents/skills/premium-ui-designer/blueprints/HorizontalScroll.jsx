import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HorizontalScroll({ slides, className = "" }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    if (!trackRef.current) return;

    const mm = gsap.matchMedia();

    // Enable horizontal scroll trigger only for desktop screens (>= 768px)
    mm.add("(min-width: 768px)", () => {
      const track = trackRef.current;
      const scrollAmount = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -scrollAmount,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${scrollAmount}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`w-full overflow-hidden ${className}`}>
      <div 
        ref={trackRef} 
        className="flex md:flex-row flex-col md:w-[300vw] w-full min-h-screen"
      >
        {slides.map((slide, idx) => (
          <div 
            key={idx} 
            className="md:w-screen w-full min-h-screen flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: slide.bgColor || "transparent" }}
          >
            {slide.content}
          </div>
        ))}
      </div>
    </div>
  );
}
