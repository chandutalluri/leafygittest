import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'subtle';
}

export function GlassCard({ children, className, variant = 'default', ...props }: GlassCardProps) {
  const variants = {
    default: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg',
    elevated: 'bg-white/90 backdrop-blur-lg border border-white/30 shadow-xl',
    subtle: 'bg-white/60 backdrop-blur-sm border border-white/10 shadow-md',
  };

  return (
    <div
      className={cn('rounded-2xl transition-all duration-300', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}
