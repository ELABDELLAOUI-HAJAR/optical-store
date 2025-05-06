import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, XMarkIcon, PencilIcon, TrashIcon, PrinterIcon  } from '@heroicons/react/24/outline';
import OrderForm from '../components/OrderForm';
import PageTitle from '../components/PageTitle';
import ModalTitle from '../components/ModalTitle';
import SearchBar from '../components/SearchBar';
import { insertOrder, fetchOrders } from '../supabaseClient';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

function Orders() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 5;

  const getOrders = useCallback(async () => {
    const ordersData = await fetchOrders();
    setAllOrders(ordersData);
  }, []);

  useEffect(() => {
    getOrders();
  }, [currentPage, getOrders]);


  const filteredOrders = useMemo(() => {
    return allOrders.filter((order) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        (order.client && order.client.first_name.toLowerCase().includes(searchTerm)) ||
        (order.client && order.client.last_name.toLowerCase().includes(searchTerm)) ||
        (order.order_date && order.order_date.toLowerCase().includes(searchTerm))
      );
    });
  }, [allOrders, searchQuery]);

  const currentOrders = useMemo(() => {
    const indexOfLastOrder = currentPage * rowsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
    setTotalPages(Math.ceil(filteredOrders.length / rowsPerPage));
    return filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  }, [filteredOrders, currentPage, rowsPerPage]);

  useEffect(() => {
    setOrders(currentOrders);
  }, [currentOrders]);

  const handleAddNewOrder = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  const handleEditOrder = (orderId) => {
    const order = allOrders.find(o => o.id === orderId);
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const handleDeleteOrder = async(orderId) => {
    if (window.confirm(t('delete_confirmation_order'))) {
      /*await deleteOrder(orderId);
      setCurrentPage(1);
      getOrders();*/
      console.log('delete order', orderId);
    }
  };

  const handleCloseModal = () => {
    setEditingOrder(null);
    setIsModalOpen(false);
  };

  const handlePrintOrder = async (order) => {
    try {
      const invoiceDiv = document.createElement('div');
      invoiceDiv.style.position = 'absolute';
      invoiceDiv.style.left = '-9999px';
      invoiceDiv.style.width = '800px';
      invoiceDiv.style.padding = '17px';
      invoiceDiv.style.background = 'white';
      invoiceDiv.style.display = 'flex';
      invoiceDiv.style.flexDirection = 'column';
      
      invoiceDiv.innerHTML = `
        <div class="invoice">
          <!-- Header with logo -->
          <div class="header">
            <img src="${process.env.PUBLIC_URL}/invoice_header.jpg" alt="Company Logo" class="company-logo">
          </div>
          
          <h3><b>Salé, le :</b> ${new Date(order.order_date).toLocaleDateString()}</h3>
          
          <h2 class="invoice-title"><b>Facture :</b> ${order.id}</h2>

          <p class="client-name"><b>Nom du client :</b> ${order.client.first_name} ${order.client.last_name}</p>
          
          <table class="prescription-table">
            <thead>
              <tr>
                <th></th>
                <th>SPH</th>
                <th>CYL</th>
                <th>AXE</th>
                <th>ADD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OD</td>
                <td>${order.right_eye_sph || ''}</td>
                <td>${order.right_eye_cyl || ''}</td>
                <td>${order.right_eye_axe || ''}</td>
                <td>${order.right_eye_add || ''}</td>
              </tr>
              <tr>
                <td>OG</td>
                <td>${order.left_eye_sph || ''}</td>
                <td>${order.left_eye_cyl || ''}</td>
                <td>${order.left_eye_axe || ''}</td>
                <td>${order.left_eye_add || ''}</td>
              </tr>
            </tbody>
          </table>

          <table class="vision-table">
            <thead>
              <tr>
                <th colspan="3">Type de vision</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${order.vision_types && order.vision_types.includes('near') ? '<label><input type="checkbox" checked /> Vision de près</label>' : '<label><input type="checkbox" /> Vision de près</label>'}</td>
                <td>${order.vision_types && order.vision_types.includes('far') ? '<label><input type="checkbox" checked /> Vision de loin</label>' : '<label><input type="checkbox" /> Vision de loin</label>'}</td>
                <td>${order.vision_types && order.vision_types.includes('progressive') ? '<label><input type="checkbox" checked /> Progressive</label>' : '<label><input type="checkbox" /> Progressive</label>'}</td>
              </tr>
            </tbody>
          </table>
          
          <table class="treatments-table">
            <thead>
              <tr>
                <th colspan="3">Type de traitement</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${order.treatments && order.treatments.includes('white') ? '<label><input type="checkbox" checked />Blanc</label>' : '<label><input type="checkbox" />Blanc</label>'}</td>
                <td>${order.treatments && order.treatments.includes('anti_led') ? '<label><input type="checkbox" checked />Anti-LED</label>' : '<label><input type="checkbox" />Anti-LED</label>'}</td>
                <td>${order.treatments && order.treatments.includes('anti_reflet') ? '<label><input type="checkbox" checked />Anti-Reflet</label>' : '<label><input type="checkbox" />Anti-Reflet</label>'}</td>
              </tr>
              <tr>
                <td>${order.treatments && order.treatments.includes('transitions') ? '<label><input type="checkbox" checked />Transitions</label>' : '<label><input type="checkbox" />Transitions</label>'}</td>
                <td>${order.treatments && order.treatments.includes('uni_color') ? '<label><input type="checkbox" checked />Uni-couleur</label>' : '<label><input type="checkbox" />Uni-couleur</label>'}</td>
                <td>${order.treatments && order.treatments.includes('degrade') ? '<label><input type="checkbox" checked />Dégradé</label>' : '<label><input type="checkbox" />Dégradé</label>'}</td>
              </tr>
              <tr>
                <td>${order.treatments && order.treatments.includes('mirror') ? '<label><input type="checkbox" checked />Miroir</label>' : '<label><input type="checkbox" />Miroir</label>'}</td>
                <td>${order.treatments && order.treatments.includes('polarized') ? '<label><input type="checkbox" checked />Polarisé</label>' : '<label><input type="checkbox" />Polarisé</label>'}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Quantité</th>
                <th>Description</th>
                <th>Prix unitaire</th>
                <th>Montant TTC</th>
              </tr>
            </thead>
            <tbody>
              ${(order.products && order.products.map(product => `
                <tr>
                  <td>${product.quantity || 1}</td>
                  <td>${product.name || ''}</td>
                  <td>${product.price || 0} ${t('currency')}</td>
                  <td>${(product.quantity || 1) * (product.price || 0)} ${t('currency')}</td>
                </tr>
              `).join('')) || (
                `<tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>`
              )}
            </tbody>
          </table>
          
          <p class="total">Montant Total TTC : ${order.total_amount || 0} ${t('currency')}</p>
          
          <!-- Footer with contact and business info -->
          <div class="footer">
           <img src="${process.env.PUBLIC_URL}/invoice_footer.jpg" alt="Footer Image" class="footer-image">
          </div>
        </div>
      `;
    
      const style = document.createElement('style');
      style.innerHTML = `
        .invoice {
          font-family: Arial, sans-serif;
          position: relative;
          margin: 0 auto; 
          display: flex;
          flex-direction: column;
          height: 150vh;
        }
        .header {
          text-align: center;
          margin-bottom: 10px;
          margin-top: 10px;
          width: 100%;
        }
        .company-logo {
          width: 100%;
          height: auto;
          display: block;
        }
          
        .footer {
          position: absolute;
          bottom: 5px;
          width: 100%;
        }
        .footer-image {
          width: 100%;
          height: auto;
          display: block;
        }
        .invoice h3{
          text-align: right;
        }
        .invoice h1, .invoice h2, .invoice h3 {
          margin: 10px 0;
        }
        .invoice table {
          width: 100%;
          border-collapse: collapse;
        }
        .prescription-table {
          margin-top: 10px;
        }
        .invoice-title {
          text-align: center;
          font-size: 1.4em;
        }
        .client-name {
          font-size: 1.2em;
        }
        .invoice table, .invoice th, .invoice td {
          border: 1px solid #ddd;
        }
        .invoice th, .invoice td {
          padding: 8px;
          text-align: left;
        }
        .invoice .total {
          font-weight: bold;
          text-align: right;
          font-size: 1.2em;
          margin-top: 20px;
        }
        .vision-table th, .treatments-table th ,
        .items-table th, .prescription-table th,
        .prescription-table td:first-child{
          padding: 10px;
          text-align: center;
          font-weight: bold;
          background-color: #999999;
          font-size: 1.15em;
          vertical-align: middle;
          height: 15px;
        }
        .vision-table td, .treatments-table td {
          text-align: center;
          padding: 10px;
          vertical-align: middle;
          height: 30px;
          font-weight: bold;
        }
        .vision-table label, .treatments-table label {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        .vision-table input[type="checkbox"], .treatments-table input[type="checkbox"] {
          margin: 0;
        }
        .items-table {
          margin-top: 15px;
        }

      `;

      invoiceDiv.appendChild(style);
      
      document.body.appendChild(invoiceDiv);
      
      const canvas = await html2canvas(invoiceDiv);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a5');
      const imgWidth = 140; // A5 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      document.body.removeChild(invoiceDiv);
      
      window.open(pdf.output('bloburl'), '_blank');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleSubmitOrder = async (orderData, visionTypes, treatments, products) => {
    console.log(orderData);
    console.log(visionTypes);
    console.log(treatments);
    console.log(products);

    if (editingOrder) {
      console.log('Editing order:', editingOrder);
      /*const result = await updateOrder(editingOrder.id, orderData);
      if (result) 
        console.log('Order updated successfully:', result);*/
    } else {
      // Add new order
      const result = await insertOrder(orderData, products, treatments, visionTypes);
      if (result) 
        console.log('Order saved successfully:', result);
    }

    setCurrentPage(1);
    getOrders();
    setIsModalOpen(false);
    setEditingOrder(null);
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
        <div className="mt-8">
          <SearchBar
            placeholder={t('searchClients')}
            value={searchQuery}
            onChange={setSearchQuery}
          />
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
                              {order.client.first_name} {order.client.last_name}
                              <dl className="font-normal lg:hidden">
                                <dt className="sr-only">{t('date')}</dt>
                                <dd className="mt-1 truncate text-gray-500 dark:text-gray-400">
                                  {order.order_date}
                                </dd>
                                <dt className="sr-only sm:hidden">{t('total')}</dt>
                                <dd className="mt-1 truncate text-gray-500 dark:text-gray-400 sm:hidden">
                                  {order.total_amount} {t('currency')}
                                </dd>
                              </dl>
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                              {order.order_date}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                              <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                                order.status === 'delivered' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                              {order.total_amount} {t('currency')}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center space-x-4">
                                <button
                                  type="button"
                                  onClick={() => handleEditOrder(order.id)}
                                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                  <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                  <span className="sr-only">{t('edit')}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handlePrintOrder(order)}
                                  className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                >
                                  <PrinterIcon className="h-5 w-5" aria-hidden="true" />
                                  <span className="sr-only">${t('print_invoice')}</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order.id)}
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
        <div className="flex justify-end mt-2">
          <button 
            className="bg-indigo-600 text-white rounded px-4 py-2 mr-2 mt-2 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            {t('previous')}
          </button>
          <button 
            className="bg-indigo-600 text-white rounded px-4 py-2 mt-2 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={() => setCurrentPage(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            {t('next')}
          </button>
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
                  <ModalTitle title={editingOrder ? t('editorder') : t('neworder')} />
                  <div className="mt-4">
                    <OrderForm 
                    onSubmit={handleSubmitOrder} 
                    onCancel={handleCloseModal} 
                    initialData={editingOrder}
                    />
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
