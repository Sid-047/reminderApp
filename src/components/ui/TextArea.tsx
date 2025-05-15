import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  id: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="label">
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={twMerge(
            clsx(
              'input min-h-[100px] resize-y',
              error && 'input-error',
              className
            )
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';