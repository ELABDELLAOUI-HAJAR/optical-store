import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchClients, fetchDoctors,fetchAvailableProducts } from '../supabaseClient'; 
import { TrashIcon } from '@heroicons/react/24/outline';

function OrderForm({ onSubmit, onCancel, initialData }) {
  const { t } = useTranslation();
  const [orderDate, setOrderDate] = useState(new Date());
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [customerName, setCustomerName] = useState('');
  const [orderState, setOrderState] = useState('inProgress');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [socialSecurity, setSocialSecurity] = useState(false);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      const clientsData = await fetchClients();
      setClients(clientsData);
    };

    const loadDoctors = async () => {
      const doctorsData = await fetchDoctors();
      setDoctors(doctorsData);
    };

    const loadAvailableProducts = async () => {
      const productsData = await fetchAvailableProducts();
      setAvailableProducts(productsData);
    };

    const initializeOrderData = () => {
      console.log(initialData);
      if (initialData) {
        setOrderDate(new Date(initialData.order_date)); 
        setDeliveryDate(new Date(initialData.delivery_date)); 
        setCustomerName(initialData.client_id || '');
        setOrderState(initialData.status || 'inProgress');
        setSelectedDoctor(initialData.doctor_id || '');
        setSocialSecurity(initialData.social_security || false);
        setGlassType(initialData.glass_type || 'mineral');
        setVisionTypes({
          nearSightedness: initialData.order_vision[0].nearSightedness || false,
          farSightedness: initialData.order_vision[0].farSightedness || false,
          progressive: initialData.order_vision[0].progressive || false,
          solar: initialData.order_vision[0].solar || false
        });
        setTreatments({
          white: initialData.order_treatment[0].white || false,
          antiBlueLight: initialData.order_treatment[0].antiBlueLight || false,
          antiReflexion: initialData.order_treatment[0].antiReflexion || false,
          mirrored: initialData.order_treatment[0].mirrored || false,
          transitions: initialData.order_treatment[0].transitions || false,
          uniColor: initialData.order_treatment[0].uniColor || false,
          degraded: initialData.order_treatment[0].degraded || false,
          polarized: initialData.order_treatment[0].polarized || false
        });
        setGlassIndex(initialData.glass_index || 0);
        
        setLeftEye({
          sph: initialData.left_sph || 0,
          cyl: initialData.left_cyl || 0,
          axis: initialData.left_axis || 0,
          add: initialData.left_add || 0,
          ep: initialData.left_ep || 0,
          hp: initialData.left_hp || 0,
          prism: initialData.left_prism || 0,
          prismAxis: initialData.left_prism_axis || 0,
        });
        setRightEye({
          sph: initialData.right_sph || 0,
          cyl: initialData.right_cyl || 0,
          axis: initialData.right_axis || 0,
          add: initialData.right_add || 0,
          ep: initialData.right_ep || 0,
          hp: initialData.right_hp || 0,
          prism: initialData.right_prism || 0,
          prismAxis: initialData.right_prism_axis || 0,
        });

        const enrichedProducts = initialData.order_product.map(orderProduct => ({
          id: orderProduct.product_id, 
          name: orderProduct.product.name || '', 
          quantity: orderProduct.quantity || 0,
          price: orderProduct.unit_price || 0,
          stock_quantity: orderProduct.product.stock_quantity || 0, 
          selling_price: orderProduct.product.selling_price || 0 
        }));

        setProducts(enrichedProducts);
      }
    };

    loadClients();
    loadDoctors();
    loadAvailableProducts();
    initializeOrderData();
  }, [initialData]);

  // Eye measurements
  const [leftEye, setLeftEye] = useState({
    sph: 0, cyl: 0, axis: 0, add: 0, ep: 0, hp: 0, prism: 0, prismAxis: 0
  });
  const [rightEye, setRightEye] = useState({
    sph: 0, cyl: 0, axis: 0, add: 0, ep: 0, hp: 0, prism: 0, prismAxis: 0
  });

  // Vision types
  const [visionTypes, setVisionTypes] = useState({
    nearSightedness: false,
    farSightedness: false,
    progressive: false,
    solar: false
  });

  // Glass specifications
  const [glassType, setGlassType] = useState('mineral');
  const [treatments, setTreatments] = useState({
    white: false,
    antiBlueLight: false,
    antiReflexion: false,
    mirrored: false,
    transitions: false,
    uniColor: false,
    degraded: false,
    polarized: false
  });
  const [glassIndex, setGlassIndex] = useState(0);

  const [showProductModal, setShowProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalAmount = products.reduce((total, product) => {
      return total + (product.quantity * product.price);
  }, 0);


  const filteredProducts = availableProducts.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEyeMeasurementChange = (eye, field, value) => {
    if (eye === 'left') {
      setLeftEye(prev => ({ ...prev, [field]: value }));
    } else {
      setRightEye(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleVisionTypeChange = (type) => {
    setVisionTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleTreatmentChange = (treatment) => {
    setTreatments(prev => ({ ...prev, [treatment]: !prev[treatment] }));
  };

  const handleQuantityChange = (index, value) => {
    const newQuantity = parseInt(value) || 0;
    setProducts(prev => prev.map((product, i) => i === index ? { ...product, quantity: newQuantity } : product));
  };

  const handleSellingPriceChange = (index, value) => {
    const newPrice = parseFloat(value) || 0;
    setProducts(prev => prev.map((product, i) => i === index ? { ...product, price: newPrice } : product));
  };

  const handleDeleteProduct = (index) => {
    setProducts(prev => prev.filter((product, i) => i !== index));
  };

  const handleProductSelection = (product, checked) => {
    if (checked) {
      setProducts(prev => [...prev, { ...product, quantity: 1, price: product.selling_price }]); // Initialize quantity to 1
    } else {
      setProducts(prev => prev.filter(p => p.id !== product.id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      orderDate,
      deliveryDate,
      customerName,
      orderState,
      selectedDoctor,
      socialSecurity,
      leftEye,
      rightEye,
      glassType,
      glassIndex,
      totalAmount,
    }, visionTypes, treatments, products);
  };

  const renderEyeMeasurements = (eye, values, onChange) => {
    const fields = ['sph', 'cyl', 'axis', 'add', 'ep', 'hp', 'prism', 'prismAxis'];
    
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(field => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t(field)}
            </label>
            <input
              type="number"
              step="0.01"
              value={values[field]}
              onChange={(e) => onChange(eye, field, e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Order Information */}
        <div>
          <div className="border-l-4 border-indigo-500 pl-4 mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('orderInformation')}
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('orderDate')}
              </label>
              <DatePicker
                required
                selected={orderDate}
                onChange={date => setOrderDate(date)}
                dateFormat="dd/MM/yyyy"
                disabled={!!initialData}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('deliveryDate')}
              </label>
              <DatePicker
                selected={deliveryDate}
                onChange={date => setDeliveryDate(date)}
                dateFormat="dd/MM/yyyy"
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('customerName')}
              </label>
              <select
                required
                name="customerName"
                value={customerName}
                disabled={!!initialData}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.first_name} {client.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('orderState')}
              </label>
              <select
                required
                name="orderState"
                value={orderState}
                onChange={(e) => setOrderState(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
              >
                <option value="inProgress">{t('inProgress')}</option>
                <option value="delivered">{t('delivered')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('examinedBy')}
              </label>
              <select
                name="doctorName"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.first_name} {doctor.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={socialSecurity}
                onChange={(e) => setSocialSecurity(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('socialSecurity')}
              </label>
            </div>
          </div>
        </div>

        {/* Eye Measurements */}
        <div>
          <div className="border-l-4 border-indigo-500 pl-4 mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('eyeMeasurements')}
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                {t('leftEye')}
              </h5>
              {renderEyeMeasurements('left', leftEye, handleEyeMeasurementChange)}
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                {t('rightEye')}
              </h5>
              {renderEyeMeasurements('right', rightEye, handleEyeMeasurementChange)}
            </div>
          </div>
        </div>

        {/* Vision Types */}
        <div>
          <div className="border-l-4 border-indigo-500 pl-4 mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('visionType')}
            </h4>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.keys(visionTypes).map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={visionTypes[type]}
                  onChange={() => handleVisionTypeChange(type)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                />
                <label className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t(type)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Glass Specifications */}
        <div>
          <div className="border-l-4 border-indigo-500 pl-4 mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('glassSpecifications')}
            </h4>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Glass Type */}
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('glassType')}
              </label>
              <div className="mt-2 flex flex-wrap gap-4">
                {['mineral', 'organic', 'polycarbonate'].map((type) => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="glassType"
                      value={type}
                      checked={glassType === type}
                      onChange={(e) => setGlassType(e.target.value)}
                      className="form-radio h-4 w-4 text-indigo-600 dark:text-indigo-400"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      {t(type)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Glass Index */}
            <div className="sm:col-span-2">
              <label htmlFor="glassIndex" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('index')}
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  id="glassIndex"
                  name="glassIndex"
                  value={glassIndex}
                  onChange={(e) => setGlassIndex(e.target.value)}
                  step="0.01"
                  //min="1"
                  //max="2"
                  className="block w-32 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Treatments */}
        <div>
          <div className="border-l-4 border-indigo-500 pl-4 mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('treatment')}
            </h4>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.keys(treatments).map((treatment) => (
              <label key={treatment} className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={treatments[treatment]}
                  onChange={() => handleTreatmentChange(treatment)}
                  className="form-checkbox h-4 w-4 text-indigo-600 dark:text-indigo-400"
                />
                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  {t(treatment)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <div className="border-l-4 border-indigo-500 pl-4 mb-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">
              {t('products')}
            </h4>
          </div>
          <button onClick={() => setShowProductModal(true)} type="button" className="mt-4 mb-4 bg-blue-500 text-white px-4 py-2 rounded">{t('addProduct')}</button>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('productName')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('quantity')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('sellingPrice')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('unitPrice')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('stockQuantity')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('subtotal')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('delete')}</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><input type="number" min="1" max={product.stock_quantity} value={product.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} /></td>
                  <td className="px-6 py-4 whitespace-nowrap"><input type="number" value={product.price} onChange={(e) => handleSellingPriceChange(index, e.target.value)} /></td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.selling_price}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{(product.quantity * product.price).toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      type="button"
                      onClick={() => handleDeleteProduct(index)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">{t('delete')}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end ">
              <div className="flex items-center border border-gray-300 p-2 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mr-4">
                      {t('totalAmount')} :
                  </h4>
                  <p className="text-xl font-bold">
                      {totalAmount.toFixed(2)} {t('currency')}
                  </p>
              </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
          >
            {t('save')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto"
          >
            {t('cancel')}
          </button>
        </div>
      </form>

      {/* Modal for product selection */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-lg font-semibold">{t('selectProducts')}</h2>
            <input
              type="text"
              placeholder={t('searchProducts')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-2 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm dark:text-white"
            />
            <div className="mt-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex justify-between items-center py-2">
                  <div>
                    <input
                      type="checkbox"
                      onChange={(e) => handleProductSelection(product, e.target.checked)}
                    />
                    <span> {product.name} - {product.selling_price} {t('currency')} (<b>Ref:</b> {product.reference}, <b>Brand:</b> {product.brand}, <b>Color:</b> {product.color})</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowProductModal(false)} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">{t('close')}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderForm;
