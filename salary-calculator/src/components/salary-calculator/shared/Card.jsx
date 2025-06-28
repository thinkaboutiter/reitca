import React from 'react';

export const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  background = 'bg-white',
  shadow = 'shadow-lg'
}) => {
  return (
    <div className={`${background} rounded-lg ${shadow} ${padding} ${className}`}>
      {children}
    </div>
  );
};