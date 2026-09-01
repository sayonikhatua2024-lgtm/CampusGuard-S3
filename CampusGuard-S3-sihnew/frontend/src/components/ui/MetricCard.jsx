import React from 'react';
import { Card } from './Card';

export function MetricCard({ label, value, unit, trend, trendLabel, status = 'default' }) {
  let valueColor = 'text-on-surface';
  let trendColor = 'text-on-surface-variant';

  if (status === 'critical' || status === 'error') {
    valueColor = 'text-error';
    trendColor = 'text-error';
  } else if (status === 'warning') {
    valueColor = 'text-tertiary';
    trendColor = 'text-tertiary';
  } else if (status === 'success' || status === 'safe') {
    valueColor = 'text-secondary';
    trendColor = 'text-secondary';
  }

  return (
    <Card className="flex flex-col gap-1">
      <div className="font-label-caps text-label-caps text-on-surface-variant uppercase">{label}</div>
      <div className="flex items-baseline gap-1">
        <div className={`font-code-stat text-code-stat ${valueColor}`}>
          {value}
        </div>
        {unit && (
          <div className="font-label-caps text-label-caps text-on-surface-variant">
            {unit}
          </div>
        )}
      </div>
      {trend && (
        <div className={`font-label-caps text-label-caps mt-1 ${trendColor}`}>
          {trend} {trendLabel}
        </div>
      )}
    </Card>
  );
}
