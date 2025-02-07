import React from 'react';

function PageTitle({ title }) {
  return (
    <div className="border-l-4 border-indigo-500 pl-4 mb-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h1>
    </div>
  );
}

export default PageTitle;
