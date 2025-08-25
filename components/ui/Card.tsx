import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  shadow = true,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  const shadowStyle = shadow ? 'shadow-sm' : '';
  
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 ${shadowStyle} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;