import { createClient } from '@supabase/supabase-js';

// Default values (fallback if Electron doesn't send the variables)
let supabaseUrl = '';
let supabaseAnonKey = '';

// Variable to hold the Supabase client
let supabase = null;

// Function to initialize Supabase
const initializeSupabase = (url, key) => {
  supabaseUrl = url;
  supabaseAnonKey = key;
  supabase = createClient(supabaseUrl, supabaseAnonKey);
};

// Listen for environment variables from Electron
if (window.require) {
  const { ipcRenderer } = window.require('electron');
  ipcRenderer.on('env-vars', (event, { supabaseUrl: url, supabaseKey: key }) => {
    initializeSupabase(url, key); // Initialize Supabase when variables are received
  });
}

// Export a function to get the Supabase client
export const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized yet.');
  }
  return supabase;
};

// Function to save a new client
export const saveClient = async (clientData) => {
    const { data, error } = await supabase
      .from('client') 
      .insert([clientData]);
  
    if (error) {
      console.error('Error saving client:', error);
      return null; 
    }
  
    return data; 
  };

// Function to fetch all clients
async function fetchClients() {
    const { data, error } = await supabase
        .from('client')
        .select('*');

    if (error) {
        console.error('Error fetching clients:', error);
        return [];
    }
    return data;
}

// Function to delete a client
export const deleteClient = async (clientId) => {
  const { error } = await supabase
      .from('client')
      .delete()
      .eq('id', clientId); 

  if (error) {
      console.error('Error deleting client:', error);
  } 
};

// Function to update a client
export const updateClient = async (clientId, clientData) => {
  const { data, error } = await supabase
      .from('client') 
      .update(clientData)
      .eq('id', clientId); 

  if (error) {
      console.error('Error updating client:', error);
      return null; 
  }
  return data; 
};

// Function to save a new doctor
export const saveDoctor = async (doctorData) => {
  const { data, error } = await supabase
    .from('doctor') 
    .insert([doctorData]);

  if (error) {
    console.error('Error saving doctor:', error);
    return null; 
  }

  return data; 
};

// Function to fetch all doctors
async function fetchDoctors() {
    const { data, error } = await supabase
        .from('doctor')
        .select('*');

    if (error) {
        console.error('Error fetching doctors:', error);
        return [];
    }
    return data;
}

// Function to delete a doctor
export const deleteDoctor = async (doctorId) => {
  const { error } = await supabase
      .from('doctor')
      .delete()
      .eq('id', doctorId); 

  if (error) {
      console.error('Error deleting doctor:', error);
  } 
};

// Function to update a doctor
export const updateDoctor = async (doctorId, doctorData) => {
  const { data, error } = await supabase
      .from('doctor') 
      .update(doctorData)
      .eq('id', doctorId); 

  if (error) {
      console.error('Error updating doctor:', error);
      return null; 
  }
  return data; 
};

// Function to save a new product
export const saveProduct = async (productData) => {
  const { data, error } = await supabase
    .from('product') 
    .insert([productData]);

  if (error) {
    console.error('Error saving product:', error);
    return null; 
  }

  return data; 
};

// Function to fetch available products
export const fetchProducts = async () => {
  const { data, error } = await supabase
      .from('product') 
      .select('*');

  if (error) {
      console.error('Error fetching products:', error);
      return [];
  }
  return data;
};

// Function to delete a product
export const deleteProduct = async (productId) => {
  const { error } = await supabase
      .from('product')
      .delete()
      .eq('id', productId); 

  if (error) {
      console.error('Error deleting product:', error);
  } 
};

// Function to update a product
export const updateProduct = async (productId, productData) => {
  const { data, error } = await supabase
      .from('product') 
      .update(productData)
      .eq('id', productId); 

  if (error) {
      console.error('Error updating product:', error);
      return null; 
  }
  return data; 
};

export const fetchAvailableProducts = async () => {
  const { data, error } = await supabase
    .from('product') 
    .select('*')
    .gt('stock_quantity', 0); 

  if (error) {
    console.error('Error fetching available products:', error);
    return [];
  }
  return data;
};

// Function to insert an order
export const insertOrder = async (orderData, orderProducts, orderTreatments, orderVision) => {
  const { data: orderDataResponse, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        order_date: orderData.orderDate,
        delivery_date: orderData.deliveryDate,
        client_id: orderData.customerName,
        doctor_id: orderData.selectedDoctor,
        social_security: orderData.socialSecurity,
        left_sph: orderData.leftEye.sph,
        left_cyl: orderData.leftEye.cyl,
        left_axis: orderData.leftEye.axis,
        left_add: orderData.leftEye.add,
        left_ep: orderData.leftEye.ep,
        left_hp: orderData.leftEye.hp,
        left_prism: orderData.leftEye.prism,
        left_prism_axis: orderData.leftEye.prismAxis,
        right_sph: orderData.rightEye.sph,
        right_cyl: orderData.rightEye.cyl,
        right_axis: orderData.rightEye.axis,
        right_add: orderData.rightEye.add,
        right_ep: orderData.rightEye.ep,
        right_hp: orderData.rightEye.hp,
        right_prism: orderData.rightEye.prism,
        right_prism_axis: orderData.rightEye.prismAxis,
        total_amount: orderData.totalAmount,
        glass_type: orderData.glassType,
        glass_index: orderData.glassIndex,
        status: orderData.orderState
      },
    ])
    .select('*')
    .single();

  if (orderError) {
    console.error(`Error inserting order: ${orderError.message}`);
    return null; 
  }

  // Get the generated order ID
  const orderId = orderDataResponse.id;

  // Prepare related data with the order ID
  const productsWithOrderId = orderProducts.map(product => ({ 
    order_id: orderId,
    product_id: product.id,
    quantity: product.quantity,
    unit_price: product.price,
    sub_total: (product.quantity * product.price).toFixed(2)
  }));
  
  const treatmentsWithOrderId = {
    ...orderTreatments, 
    order_id: orderId 
  };
 
  
  const visionWithOrderId = {
    ...orderVision, 
    order_id: orderId 
  };

  // Insert related data
  const { error: productsError } = await supabase
    .from('order_product')
    .insert(productsWithOrderId);

  // Update product quantities
  for (const product of orderProducts) {
    const { id, quantity, stock_quantity } = product;
    const newQuantity = stock_quantity - quantity;
    const { error: updateError } = await supabase
      .from('product')
      .update({ stock_quantity: newQuantity })
      .eq('id', id);
    if (updateError) {
      console.error(`Error updating product quantity: ${updateError.message}`);
    }
  }

  const { error: treatmentsError } = await supabase
    .from('order_treatment')
    .insert(treatmentsWithOrderId);

  const { error: visionError } = await supabase
    .from('order_vision')
    .insert(visionWithOrderId);

  if (productsError || treatmentsError || visionError) {
    console.error(`Error inserting related data: ${productsError?.message} ${treatmentsError?.message} ${visionError?.message}`);
    return null; 
  }

  return orderDataResponse; 
};

export const fetchOrders = async () => {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      *,
      client (
        first_name,
        last_name
      ),
      doctor (
        first_name,
        last_name
      ),
      order_vision (
        *
      ),
      order_product (
        *,
        product (
          name,
          stock_quantity,
          selling_price
        )

      ),
      order_treatment (
        *
      )
    `);

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return orders;
};

export { fetchClients , fetchDoctors};