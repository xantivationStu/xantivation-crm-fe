import React from "react";

export function ClippingMaskReveal({ background, children, className = "" }) {
  return (
    <section 
      className={`relative overflow-hidden w-full min-h-screen ${className}`} 
      style={{ clipPath: "inset(0 0 0 0)" }}
    >
      {/* Background layer pinned underneath (video, image, 3D Canvas...) */}
      <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-0">
        {background}
      </div>
      
      {/* Scrollable content layer overlaying the background */}
      <div className="relative z-10 w-full h-full min-h-screen flex items-center justify-center">
        {children}
      </div>
    </section>
  );
}
