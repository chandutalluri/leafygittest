import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
}

export function LoadingSkeleton({
  className,
  variant = 'rectangular',
  ...props
}: LoadingSkeletonProps) {
  const variants = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded h-4',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200/60 backdrop-blur-sm',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}