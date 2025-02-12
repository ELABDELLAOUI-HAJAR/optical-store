import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import ModalTitle from './ModalTitle';

const productTypes = ['Frame', 'Glass', 'Lens', 'Glass product', 'lens product', 'other'];
const categories = ['Man', 'Woman', 'kid'];
const lensTypes = ['Rigid', 'flexible'];
const materials = ['Metal', 'Plastic'];
const glassTypes = ['Miniral', 'Organic', 'Polycarbonat'];
const visionTypes = ['Near-sightedness', 'Far-sightedness', 'Progressive', 'Solar'];

export default function AddProductModal({ open, setOpen, onSubmit, initialData }) {
  const { t } = useTranslation();
  const initialFormData = {
    // Product Information
    reference: '',
    name: '',
    product_type: '',
    brand: '',
    color: '',
    category: '',
    lens_type: '',
    frame_material: '',
    quantity: '',
    selling_price: '',
    purchase_price: '',

    // Glass Information
    glass_type: '',
    vision_type: '',
  };

  const [formData, setFormData] = useState(() => {
    console.log('Initial formData:', initialData);
    if (initialData) {
      return {
        reference: initialData.reference || '',
        name: initialData.name || '',
        product_type: initialData.product_type || '',
        brand: initialData.brand || '',
        color: initialData.color || '',
        category: initialData.category || '',
        lens_type: initialData.lens_type || '',
        frame_material: initialData.frame_material || '',
        quantity: initialData.quantity || '',
        selling_price: initialData.selling_price || '',
        purchase_price: initialData.purchase_price || '',
        glass_type: initialData.glass_type || '',
        vision_type: initialData.vision_type || '',
      };
    }
    return initialFormData;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(false);
    onSubmit(formData);
    setFormData(initialFormData);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white dark:bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <ModalTitle title={initialData ? t('editProduct') : t('addProduct')} />
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        {/* Product Information Section */}
                        <div>
                          <div className="border-l-4 border-indigo-500 pl-4 mb-6">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              {t('productInformation')}
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('reference')}
                              </label>
                              <input
                                type="text"
                                name="reference"
                                value={formData.reference}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('productType')}
                              </label>
                              <select
                                name="product_type"
                                value={formData.product_type}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              >
                                <option value="">{t('select')}</option>
                                {productTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {t(type.toLowerCase())}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('productName')}
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('brand')}
                              </label>
                              <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('color')}
                              </label>
                              <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('category')}
                              </label>
                              <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              >
                                <option value="">{t('select')}</option>
                                {categories.map((category) => (
                                  <option key={category} value={category}>
                                    {t(category.toLowerCase())}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('lensType')}
                              </label>
                              <select
                                name="lens_type"
                                value={formData.lens_type}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              >
                                <option value="">{t('select')}</option>
                                {lensTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {t(type.toLowerCase())}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('material')}
                              </label>
                              <select
                                name="frame_material"
                                value={formData.frame_material}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              >
                                <option value="">{t('select')}</option>
                                {materials.map((material) => (
                                  <option key={material} value={material}>
                                    {t(material.toLowerCase())}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('quantity')}
                              </label>
                              <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('sellingPrice')}
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                name="selling_price"
                                value={formData.selling_price}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('purchasePrice')}
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                name="purchase_price"
                                value={formData.purchase_price}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Glass Information Section */}
                        <div>
                          <div className="border-l-4 border-indigo-500 pl-4 mb-6">
                            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                              {t('glassInformation')}
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('glassType')}
                              </label>
                              <select
                                name="glass_type"
                                value={formData.glass_type}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              >
                                <option value="">{t('select')}</option>
                                {glassTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {t(type.toLowerCase())}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('visionType')}
                              </label>
                              <select
                                name="vision_type"
                                value={formData.vision_type}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                              >
                                <option value="">{t('select')}</option>
                                {visionTypes.map((type) => (
                                  <option key={type} value={type}>
                                    {t(type.toLowerCase())}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                        >
                          {t('save')}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
                          onClick={() => setOpen(false)}
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
