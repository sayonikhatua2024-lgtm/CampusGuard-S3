import React from 'react';

export function SectionHeader({ title, description, badge, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h2 className="font-headline-md text-headline-md text-on-surface m-0 p-0">
            {title}
          </h2>
          {badge && <div>{badge}</div>}
        </div>
        {description && (
          <p className="font-body-base text-body-base text-on-surface-variant m-0 p-0">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
