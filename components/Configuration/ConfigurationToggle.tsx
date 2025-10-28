'use client';

import React from 'react';

interface ConfigurationToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ConfigurationToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = ''
}: ConfigurationToggleProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          toggle: 'w-9 h-5',
          dot: 'w-4 h-4',
          translate: 'translate-x-4'
        };
      case 'lg':
        return {
          toggle: 'w-14 h-7',
          dot: 'w-6 h-6',
          translate: 'translate-x-7'
        };
      default: // md
        return {
          toggle: 'w-11 h-6',
          dot: 'w-5 h-5',
          translate: 'translate-x-5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <div className="flex-1 min-w-0 pr-4">
        <label className="text-sm font-medium text-gray-900 cursor-pointer block">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
          ${sizeClasses.toggle}
          min-h-[44px] min-w-[44px]
          ${checked
            ? 'bg-emerald-600 hover:bg-emerald-700'
            : 'bg-gray-200 hover:bg-gray-300'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        role="switch"
        aria-checked={checked}
      >
        <span
          className={`
            inline-block rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out
            ${sizeClasses.dot}
            ${checked ? sizeClasses.translate : 'translate-x-0.5'}
          `}
        />
      </button>
    </div>
  );
}