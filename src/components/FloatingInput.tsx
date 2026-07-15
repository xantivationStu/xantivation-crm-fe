'use client';
import React, { useState } from 'react';

export function FloatingInput({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  disabled = false,
  onBlur,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
}) {
  const [focused, setFocused] = useState(false);

  const handleBlur = () => {
    setFocused(false);
    if (onBlur) onBlur();
  };

  return (
    <div className={`relative w-full group pt-6 pb-2 border-b border-[var(--color-border)] transition-colors duration-300 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        required={required}
        disabled={disabled}
        className="w-full bg-transparent py-1 transition-colors duration-300 outline-none text-[var(--color-fg)] text-base lg:text-lg"
        placeholder=" "
      />
      <label
        className={`absolute left-0 transition-all duration-300 pointer-events-none ${
          focused || value
            ? 'top-0 text-xs lg:text-sm text-[var(--color-accent)] font-bold'
            : 'top-6 text-base lg:text-lg text-[var(--color-muted-fg)]'
        }`}
      >
        {label}
      </label>
      {/* Subtle bottom glow line overlays the border exactly */}
      <div
        className={`absolute bottom-[-1px] left-0 h-[2px] bg-gradient-to-r from-[var(--color-accent)] to-cyan-500 transition-all duration-300 ${
          focused ? 'w-full' : 'w-0'
        }`}
      ></div>
    </div>
  );
}
