'use client';

import React, { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, animate } from 'framer-motion';

export default function AnimatedCounter({
  value,
  duration = 1.2,
  formatter = (v: number) => Math.floor(v).toLocaleString(),
}: {
  value: number;
  duration?: number;
  formatter?: (val: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 60,
    damping: 15,
  });
  
  useEffect(() => {
    // Animate from 0 to target value on mount, or whenever value changes
    const controls = animate(motionValue, value, { duration, ease: [0.25, 0.1, 0.25, 1] });
    return () => controls.stop();
  }, [value, motionValue, duration]);

  useEffect(() => {
    return springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = formatter(latest);
      }
    });
  }, [springValue, formatter]);

  return <span ref={ref}>0</span>;
}
