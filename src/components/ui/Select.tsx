import React from 'react';
import { cn } from '../../utils/cn';

interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: Option[];
  label?: string;
  error?: string;
  onChange?: (value: string) => void;
  fullWidth?: boolean;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, onChange, fullWidth = false, ...props }, ref) => {
    const id = props.id || `select-${Math.random().toString(36).substring(2, 11)}`;
    
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className={cn(fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            'bg-white border border-gray-300 text-gray-900 text-sm rounded-lg',
            'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'block w-full p-2.5 pr-8 transition-all duration-200 ease-in-out',
            'shadow-sm hover:shadow hover:border-gray-400',
            'appearance-none bg-no-repeat',
            'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236B7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")] bg-[center_right_0.5rem] bg-[length:1.5em_1.5em]',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;