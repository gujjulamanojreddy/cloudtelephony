import React from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'default' | 'search';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, rightIcon, fullWidth = false, variant = 'default', ...props }, ref) => {
    const id = props.id || `input-${Math.random().toString(36).substring(2, 11)}`;
    
    return (
      <div className={cn(fullWidth && 'w-full')}>        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-white mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className={cn(
              "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
              variant === 'search' && "text-gray-400 group-hover:text-gray-500"
            )}>
              {leftIcon}
            </div>
          )}          <input
            ref={ref}
            id={id}
            className={cn(
              'bg-white border border-gray-300 text-gray-900 text-sm rounded-lg shadow-sm',
              'focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:shadow-md',
              'block w-full transition-all duration-200 ease-in-out',
              'hover:border-gray-400',
              variant === 'default' && 'p-2.5',
              variant === 'search' && 'pl-10 pr-4 py-2.5 group hover:border-gray-400',
              leftIcon && variant !== 'search' && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;