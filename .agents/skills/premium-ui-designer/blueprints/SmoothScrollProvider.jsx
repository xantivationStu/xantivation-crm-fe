'use client';

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

// Note: To dynamically check pathname shifts client-side in Next.js, 
// import usePathname from 'next/navigation' and trigger pathname updates inside useEffect.
export default function SmoothScrollProvider({ children, pathname = "" }: { children: React.ReactNode, pathname?: string }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Destroy Lenis on admin dashboards to prevent drag & scroll lag
    if (window.location.pathname.startsWith("/admin") || pathname.startsWith("/admin")) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      return;
    }

    window.history.scrollRestoration = "manual";

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    let hasHash = false;
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        hasHash = true;
        setTimeout(() => {
          lenis.scrollTo(target, { duration: 1.2, immediate: false });
        }, 150);
      }
    }
    if (!hasHash) {
      lenis.scrollTo(0, { immediate: true });
    }

    function raf(time: number) {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
        requestAnimationFrame(raf);
      }
    }

    requestAnimationFrame(raf);

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [pathname]);

  return <>{children}</>;
}
