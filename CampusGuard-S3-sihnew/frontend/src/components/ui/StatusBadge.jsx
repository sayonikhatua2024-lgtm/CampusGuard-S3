import React from 'react';
import { CheckCircle2, AlertTriangle, XOctagon, Info, RefreshCw } from 'lucide-react';

export function StatusBadge({ status, label, pulse = false, className = '' }) {
  const normalized = status.toLowerCase();

  let colors = 'bg-surface-container border-outline-variant text-on-surface-variant';
  let Icon = Info;
  let pulseClass = '';

  if (normalized.includes('safe') || normalized.includes('verified') || normalized.includes('green') || normalized.includes('ok')) {
    colors = 'bg-secondary-container/10 border-secondary-container/30 text-secondary';
    Icon = CheckCircle2;
  } else if (normalized.includes('risk') || normalized.includes('warning') || normalized.includes('amber') || normalized.includes('degraded')) {
    colors = 'bg-tertiary-container/10 border-tertiary-container/30 text-tertiary';
    Icon = AlertTriangle;
    if (pulse) pulseClass = 'animate-pulse';
  } else if (normalized.includes('violated') || normalized.includes('blocked') || normalized.includes('red') || normalized.includes('crit')) {
    colors = 'bg-error-container/10 border-error-container/30 text-error';
    Icon = XOctagon;
    if (pulse) pulseClass = 'pulse-crimson';
  } else if (normalized.includes('optimization') || normalized.includes('purple')) {
    colors = 'bg-primary-container/10 border-primary-container/30 text-primary-container';
    Icon = RefreshCw;
  } else if (normalized.includes('blue') || normalized.includes('cyan') || normalized.includes('info')) {
    colors = 'bg-primary/10 border-primary/30 text-primary';
    Icon = Info;
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border font-label-caps text-label-caps uppercase ${colors} ${pulseClass} ${className}`}>
      <Icon size={14} className="shrink-0" />
      <span>{label || status}</span>
    </div>
  );
}
