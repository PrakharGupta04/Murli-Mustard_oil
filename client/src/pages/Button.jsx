import React from 'react';

const buttonVariants = {
  default: 'bg-gray-900 text-white hover:bg-gray-800',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  outline: 'border border-gray-200 bg-white hover:bg-gray-100 text-gray-900',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  ghost: 'hover:bg-gray-100 text-gray-900',
  link: 'text-gray-900 underline-offset-4 hover:underline',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-8 px-3 text-sm',
  lg: 'h-12 px-8',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef(
  ({ 
    className, 
    variant = 'default', 
    size = 'default', 
    disabled = false,
    type = 'button',
    ...props 
  }, ref) => {
    return (
      <button
        type={type}
        className={`
          inline-flex items-center justify-center rounded-md text-sm font-medium
          transition-colors focus-visible:outline-none focus-visible:ring-2
          focus-visible:ring-gray-400 focus-visible:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50
          ${buttonVariants[variant]}
          ${buttonSizes[size]}
          ${className}
        `}
        ref={ref}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';