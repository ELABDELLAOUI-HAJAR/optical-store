import React from 'react';

function ModalTitle({ title }) {
  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <div className="mt-2 h-px bg-gradient-to-r from-indigo-500 to-transparent"></div>
    </div>
  );
}

export default ModalTitle;
