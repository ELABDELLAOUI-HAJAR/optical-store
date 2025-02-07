import React from 'react';
import { useTranslation } from 'react-i18next';

function Suppliers() {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        {t('suppliers')}
      </h1>
      {/* Add supplier management functionality here */}
    </div>
  );
}

export default Suppliers;
