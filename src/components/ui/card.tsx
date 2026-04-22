import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-xl border border-gray-100',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }: CardProps) => {
  return (
    <div
      className={cn('p-8 border-b border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={cn('p-8', className)} {...props}>
      {children}
    </div>
  );
};
