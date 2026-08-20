import React from 'react';

export function PrimaryButton({ children, onClick, disabled = false, className = '', type = 'button', icon: Icon }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        bg-primary text-on-primary font-label-caps text-label-caps uppercase
        px-4 py-2 rounded flex items-center justify-center gap-2
        transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100
        hover:bg-primary-container
        ${className}
      `}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

export function SecondaryButton({ children, onClick, disabled = false, className = '', type = 'button', icon: Icon, active = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        border font-label-caps text-label-caps uppercase px-4 py-2 rounded
        flex items-center justify-center gap-2 transition-colors
        ${active
          ? 'bg-surface-container-high border-outline text-on-surface'
          : 'border-border-hairline bg-surface hover:bg-surface-container-low text-on-surface-variant'}
        disabled:opacity-50
        ${className}
      `}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
}
