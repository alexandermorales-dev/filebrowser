import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  asChild?: boolean;
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', asChild = false, children, ...props }, ref) => {
    const buttonClasses = cn(
      'px-6 py-3 rounded-lg font-semibold transition-all duration-200',
      'hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-2',
      {
        'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg':
          variant === 'primary',
        'bg-gray-200 text-gray-800 hover:bg-gray-300':
          variant === 'secondary',
        'border-2 border-blue-600 text-blue-600 hover:bg-blue-50':
          variant === 'outline',
      },
      className
    );

    if (asChild) {
      return <div className={buttonClasses}>{children}</div>;
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
