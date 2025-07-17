import React from 'react';
import { cn } from '@/lib/utils';

interface GlassInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

export const GlassInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  GlassInputProps
>(({
  className,
  label,
  error,
  icon,
  multiline = false,
  rows = 3,
  ...props
}, ref) => {
  const inputClasses = cn(
    'w-full px-4 py-3 rounded-xl border border-gray-200/50',
    'bg-white/80 backdrop-blur-sm',
    'focus:border-green-500/50 focus:ring-2 focus:ring-green-200/50',
    'transition-all duration-200',
    'placeholder:text-gray-400',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    icon && 'pl-12',
    error && 'border-red-300 focus:border-red-500 focus:ring-red-200',
    className
  );

  const InputComponent = multiline ? 'textarea' : 'input';

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <InputComponent
          ref={ref as any}
          className={inputClasses}
          rows={multiline ? rows : undefined}
          {...props}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

GlassInput.displayName = 'GlassInput';