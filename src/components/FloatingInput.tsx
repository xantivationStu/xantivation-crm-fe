'use client';
import React, { useState } from 'react';

export function FloatingInput({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full group py-4">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className="w-full bg-transparent border-b border-[var(--color-border)] focus:border-[var(--color-accent)] py-2 transition-colors duration-300 outline-none text-[var(--color-fg)]"
        placeholder=" "
      />
      <label
        className={`absolute left-0 top-6 transition-all duration-300 pointer-events-none ${
          focused || value
            ? 'top-0 text-xs text-[var(--color-accent)]'
            : 'text-sm text-[var(--color-muted-fg)]'
        }`}
      >
        {label}
      </label>
      {/* Subtle bottom glow line */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--color-accent)] to-cyan-500 transition-all duration-300 ${
          focused ? 'w-full' : 'w-0'
        }`}
      ></div>
    </div>
  );
}
