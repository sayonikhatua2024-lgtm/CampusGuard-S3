import React from 'react';

export function Card({ children, className = '', border = true, elevated = false, noPadding = false }) {
  return (
    <div className={`
      rounded border border-border-hairline
      ${elevated ? 'bg-surface-elevated' : 'bg-surface'}
      ${noPadding ? '' : 'p-gutter'}
      ${className}
    `}>
      {children}
    </div>
  );
}

export function SectionCard({ title, icon: Icon, children, className = '', action }) {
  return (
    <Card className={`flex flex-col h-full ${className}`} noPadding>
      <div className="flex justify-between items-center px-4 py-3 border-b border-border-hairline bg-surface-container-low">
        <h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase flex items-center gap-2">
          {Icon && <Icon size={16} />}
          {title}
        </h3>
        {action && <div>{action}</div>}
      </div>
      <div className="p-gutter flex-1">
        {children}
      </div>
    </Card>
  );
}
