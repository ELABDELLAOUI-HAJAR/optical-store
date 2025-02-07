import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, XMarkIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import OrderForm from '../components/OrderForm';
import PageTitle from '../components/PageTitle';
import ModalTitle from '../components/ModalTitle';

function Orders() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([
    // Sample data - replace with actual data from your backend
    {
      id: 1,
      client: 'John Doe',
      date: '2025-01-17',
      product: 'Eyeglasses X1',
      status: 'Pending',
      total: 299.99
    },
    {
      id: 2,
      client: 'Jane Smith',
      date: '2025-01-16',
      product: 'Contact Lenses Y2',
      status: 'Completed',
      total: 149.99
    }
  ]);

  const handleAddNewOrder = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitOrder = (orderData) => {
    // Add the new order to the orders list
    const newOrder = {
      id: orders.length + 1,
      client: orderData.customerName,
      date: orderData.orderDate.toISOString().split('T')[0],
      product: 'New Order', // You might want to add product selection to the form
      status: orderData.orderState === 'delivered' ? 'Completed' : 'Pending',
      total: 0 // You might want to add price calculation
    };

    setOrders([...orders, newOrder]);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <PageTitle title={t('orders')} />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={handleAddNewOrder}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              {t('addneworder')}
            </button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8 overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="shadow-sm ring-1 ring-black ring-opacity-5">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white sm:pl-6">
                          {t('client')}
                        </th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white sm:table-cell">
                          {t('date')}
                        </th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white lg:table-cell">
                          {t('product')}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                          {t('status')}
                        </th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white sm:table-cell">
                          {t('total')}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                          {t('actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                            {order.client}
                            <dl className="font-normal lg:hidden">
                              <dt className="sr-only">{t('date')}</dt>
                              <dd className="mt-1 truncate text-gray-500 dark:text-gray-400">
                                {order.date}
                              </dd>
                              <dt className="sr-only sm:hidden">{t('total')}</dt>
                              <dd className="mt-1 truncate text-gray-500 dark:text-gray-400 sm:hidden">
                                ${order.total}
                              </dd>
                            </dl>
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                            {order.date}
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                            {order.product}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              order.status === 'Completed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                            ${order.total}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                              <button
                                type="button"
                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              >
                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="sr-only">{t('edit')}</span>
                              </button>
                              <button
                                type="button"
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="sr-only">{t('delete')}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-white dark:bg-gray-800 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">{t('close')}</span>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <ModalTitle title={t('neworder')} />
                  <div className="mt-4">
                    <OrderForm onSubmit={handleSubmitOrder} onCancel={handleCloseModal} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Orders;
