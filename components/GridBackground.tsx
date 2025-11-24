import * as React from 'react';
import { GridType } from '../types';

interface GridBackgroundProps {
  type: GridType;
  className?: string;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({ type, className = "" }) => {
  const commonProps = {
    vectorEffect: "non-scaling-stroke",
    className: "stroke-red-400/60"
  };

  const renderLines = () => {
    switch (type) {
      case 'tian': // 田字格
        return (
          <>
            <line x1="0" y1="50" x2="100" y2="50" strokeDasharray="4 2" strokeWidth="0.5" {...commonProps} />
            <line x1="50" y1="0" x2="50" y2="100" strokeDasharray="4 2" strokeWidth="0.5" {...commonProps} />
          </>
        );
      case 'mi': // 米字格
        return (
          <>
            <line x1="0" y1="50" x2="100" y2="50" strokeDasharray="4 2" strokeWidth="0.5" {...commonProps} />
            <line x1="50" y1="0" x2="50" y2="100" strokeDasharray="4 2" strokeWidth="0.5" {...commonProps} />
            <line x1="0" y1="0" x2="100" y2="100" strokeDasharray="4 2" strokeWidth="0.5" {...commonProps} />
            <line x1="100" y1="0" x2="0" y2="100" strokeDasharray="4 2" strokeWidth="0.5" {...commonProps} />
          </>
        );
      case 'hui': // 回宫格
        return (
          <>
             <rect x="25" y="25" width="50" height="50" fill="none" strokeWidth="0.5" {...commonProps} />
             <line x1="0" y1="50" x2="100" y2="50" strokeDasharray="2 2" strokeWidth="0.5" className="stroke-red-300/40" />
             <line x1="50" y1="0" x2="50" y2="100" strokeDasharray="2 2" strokeWidth="0.5" className="stroke-red-300/40" />
          </>
        );
      case 'square': // 方格
      default:
        return null;
    }
  };

  return (
    <svg viewBox="0 0 100 100" className={`w-full h-full absolute inset-0 pointer-events-none ${className}`}>
      {/* Outer Border */}
      <rect x="0" y="0" width="100" height="100" fill="none" strokeWidth="1.5" className="stroke-red-500" vectorEffect="non-scaling-stroke" />
      {/* Inner Lines */}
      {renderLines()}
    </svg>
  );
};