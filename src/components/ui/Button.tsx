import React from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    fullWidth,
    disabled,
    ...props
  }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'primary':
          return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
        case 'secondary':
          return 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500';
        case 'danger':
          return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
        case 'success':
          return 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500';
        case 'warning':
          return 'bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500';
        default:
          return 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case 'sm':
          return 'px-3 py-1.5 text-sm';
        case 'lg':
          return 'px-6 py-3 text-lg';
        default:
          return 'px-4 py-2 text-base';
      }
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md',
          'transition-all duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'transform hover:scale-[1.02] active:scale-[0.98]',
          getVariantClasses(),
          getSizeClasses(),
          fullWidth && 'w-full',
          disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '',
          'shadow-sm hover:shadow',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;