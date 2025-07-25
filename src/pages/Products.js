import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import AddProductModal from '../components/AddProductModal';
import PageTitle from '../components/PageTitle';
import SearchBar from '../components/SearchBar';
import { saveProduct, fetchProducts, deleteProduct, updateProduct } from '../supabaseClient';
import ConfirmationModal from '../components/ConfirmationModal';
import NotificationModal from '../components/NotificationModal';

function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 5;
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmProductId, setConfirmProductId] = useState(null);

  const getProducts = useCallback(async () => {
    const productsData = await fetchProducts();
    setAllProducts(productsData);
  }, []);

  useEffect(() => {
    getProducts();
  }, [currentPage, getProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        (product.name && product.name.toLowerCase().includes(searchTerm)) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm)) ||
        (product.reference && product.reference.toLowerCase().includes(searchTerm))
      );
    });
  }, [allProducts, searchQuery]);

  // Calculate current products based on pagination
  const currentProducts = useMemo(() => {
    const indexOfLastProduct = currentPage * rowsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - rowsPerPage;
    setTotalPages(Math.ceil(filteredProducts.length / rowsPerPage));
    return filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  }, [filteredProducts, currentPage, rowsPerPage]);

  useEffect(() => {
    setProducts(currentProducts);
  }, [currentProducts]);

  const handleSubmitProduct = async (productData) => {
    if(editingProduct){
      // Update product
      const result = await updateProduct(editingProduct.id, productData);
      if (result) 
        console.log('Product updated successfully:', result);
    } else {
      // Add new product
      const result = await saveProduct(productData);
      if (result) 
        console.log('Product saved successfully:', result);
    }
    setCurrentPage(1);
    getProducts();
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleEditProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleDeleteProduct = async(productId) => {
    setConfirmProductId(productId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async() => {
    try {
      await deleteProduct(confirmProductId);
      // Refresh the products list
      setCurrentPage(1);
      getProducts();
      //alert(t('product_deleted_successfully'));
      setNotificationMessage(t('product_deleted_successfully'));
      setNotificationType('success');
      setIsNotificationOpen(true);
      setIsConfirmModalOpen(false);  // Close the modal after successful deletion
    } catch (error) {
      console.error('Error deleting product:', error);
      //alert(t('delete_product_error'));
      setNotificationMessage(t('delete_product_error'));
      setNotificationType('error');
      setIsNotificationOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <PageTitle title={t('products')} />
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
            onClick={handleAddNewProduct}
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {t('addProduct')}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <SearchBar
          placeholder={t('searchProducts')}
          value={searchQuery}
          onChange={setSearchQuery}
        />
        
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-bold uppercase text-gray-900 dark:text-white sm:pl-6">
                        {t('reference')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase text-gray-900 dark:text-white">
                        {t('productName')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase text-gray-900 dark:text-white">
                        {t('brand')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase text-gray-900 dark:text-white">
                        {t('sellingPrice')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase text-gray-900 dark:text-white">
                        {t('purchasePrice')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase text-gray-900 dark:text-white">
                        {t('inStock')}
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase text-gray-900 dark:text-white">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                          {product.reference}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {product.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {product.brand}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {product.selling_price.toFixed(2)} {t('currency')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {product.purchase_price.toFixed(2)} {t('currency')}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {product.stock_quantity}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleEditProduct(product.id)}
                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              >
                                <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                <span className="sr-only">{t('edit')}</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
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
      <AddProductModal
        close={handleCloseModal}
        open={isAddModalOpen}
        onSubmit={handleSubmitProduct}
        initialData={editingProduct}
      />
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={t('delete_confirmation_product')}
        title={t('delete')}
      />
      {/* Notification Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        message={notificationMessage}
        type={notificationType}
      />
    </div>
  );
}

export default Products;
