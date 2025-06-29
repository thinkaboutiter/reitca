import React from 'react';

const Version = () => {
  const version = process.env.REACT_APP_VERSION || '1.0.0';
  const buildNumber = process.env.REACT_APP_BUILD_NUMBER || '0';
  
  return (
    <div className="fixed bottom-2 right-2 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded shadow-sm">
      v{version}({buildNumber})
    </div>
  );
};

export default Version;