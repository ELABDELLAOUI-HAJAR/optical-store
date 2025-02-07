import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  UsersIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import PageTitle from '../components/PageTitle';

function Dashboard() {
  const { t } = useTranslation();

  const stats = [
    {
      name: t('totalClients'),
      value: '24',
      icon: UserGroupIcon,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: t('totalOrders'),
      value: '59',
      icon: ShoppingCartIcon,
      change: '+54.02%',
      changeType: 'positive',
    },
    {
      name: t('totalRevenue'),
      value: '$12,545',
      icon: CurrencyDollarIcon,
      change: '+12.05%',
      changeType: 'positive',
    },
    {
      name: t('activeSuppliers'),
      value: '6',
      icon: UsersIcon,
      change: '+5.41%',
      changeType: 'positive',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <PageTitle title={t('welcomeBack')} />
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-900 px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.name}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </p>
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    item.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {item.change}
                </p>
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
