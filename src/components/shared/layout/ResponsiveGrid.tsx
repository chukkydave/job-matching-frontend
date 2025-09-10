import React from 'react';

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  cols = { default: 1, sm: 2, md: 3, lg: 4 },
  gap = 'md',
  className = '',
}) => {
  const gapClasses = {
    sm: 'gap-3',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const getGridCols = (breakpoint: keyof typeof cols) => {
    const colCount = cols[breakpoint];
    if (!colCount) return '';
    
    const gridColsMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    };
    
    return gridColsMap[colCount as keyof typeof gridColsMap] || '';
  };

  const baseClasses = 'grid';
  const defaultCols = getGridCols('default');
  const smCols = cols.sm ? `sm:${getGridCols('sm')}` : '';
  const mdCols = cols.md ? `md:${getGridCols('md')}` : '';
  const lgCols = cols.lg ? `lg:${getGridCols('lg')}` : '';
  const xlCols = cols.xl ? `xl:${getGridCols('xl')}` : '';

  const classes = `${baseClasses} ${defaultCols} ${smCols} ${mdCols} ${lgCols} ${xlCols} ${gapClasses[gap]} ${className}`.trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
