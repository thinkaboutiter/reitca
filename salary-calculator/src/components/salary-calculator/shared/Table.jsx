import React from 'react';

export const Table = ({ 
  headers, 
  children, 
  className = '',
  striped = true 
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200">
            {headers.map((header, index) => (
              <th 
                key={index} 
                className={`text-left py-3 px-4 font-semibold ${header.align || ''}`}
              >
                {header.title || header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={striped ? 'divide-y divide-gray-100' : ''}>
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ 
  children, 
  className = '',
  highlighted = false 
}) => {
  return (
    <tr className={`
      ${highlighted ? 'bg-green-50 font-semibold' : ''} 
      ${className}
    `}>
      {children}
    </tr>
  );
};

export const TableCell = ({ 
  children, 
  className = '',
  align = 'left' 
}) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center', 
    right: 'text-right'
  };

  return (
    <td className={`py-3 px-4 ${alignments[align]} ${className}`}>
      {children}
    </td>
  );
};