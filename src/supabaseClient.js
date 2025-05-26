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
    `)
    .order('order_date', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
  return orders;
};

export const updateOrder = async (orderId, orderData, orderProducts, orderTreatments, orderVision) => {
  //Fetch existing order and products
  const {data: existingOrder, error: fetchError } = await supabase
    .from('orders')
    .select('*, products: order_product (*, product: product(stock_quantity))')
    .eq('id', orderId)
    .single();

  if (fetchError) {
    console.error('Error fetching order:', fetchError);
    return null;
  }

  //Identify deleted Products
  const deletedProducts = existingOrder.products.filter(product => 
    !orderProducts.some(orderProduct => orderProduct.id === product.product_id)
  );

  //Identify updated Products
  const updatedProducts = existingOrder.products.filter(product => 
    orderProducts.some(orderProduct => orderProduct.id === product.product_id)
  );

  //Identify added Products
  const addedProducts = orderProducts.filter(orderProduct=> 
    !existingOrder.products.some(product => orderProduct.id === product.product_id)
  );

  //Update stock for deleted products
  for (const product of deletedProducts) {
    const product_id = product.product_id;
    const stock_quantity = product.product.stock_quantity;
    const newQuantity = stock_quantity + product.quantity;
    const { error: updateError } = await supabase
      .from('product')
      .update({ stock_quantity: newQuantity })
      .eq('id', product_id);
    if (updateError) {
      console.error(`Error updating product quantity for deleted products: ${updateError.message}`);
      return null;
    }

    const { error: deleteError } = await supabase
        .from('order_product')
        .delete()
        .eq('order_id', orderId)
        .eq('product_id', product_id);
    if (deleteError) {
      console.error(`Error deleting order product for deleted products: ${deleteError.message}`);
      return null;
    }
  }

  //Update updated products
  for (const updatedProduct of updatedProducts) {
    const existingProduct = existingOrder.products.find(p => p.product_id === updatedProduct.product_id);
    const newProductData = orderProducts.find(p => p.id === updatedProduct.product_id);
    
    if (existingOrder && newProductData) {
      const quantityDiff = existingProduct.quantity - newProductData.quantity;

      const { error: updateError } = await supabase
        .from('product')
        .update({ stock_quantity: newProductData.stock_quantity + quantityDiff
         })
        .eq('id', existingProduct.product_id);
      if (updateError) {
        console.error(`Error updating product quantity for updated products: ${updateError.message}`);
        return null;
      }

      const { error: updateOrderProductError } = await supabase
        .from('order_product')
        .update({ quantity: newProductData.quantity,
          unit_price: newProductData.price,
          sub_total: (newProductData.price * newProductData.quantity).toFixed(2)
         })
        .eq('order_id', orderId)
        .eq('product_id', existingProduct.product_id);
      if (updateOrderProductError) {
        console.error(`Error updating order product quantity for updated products: ${updateOrderProductError.message}`);
        return null;
      }
    }
  }

  //Update added products
  for (const addedProduct of addedProducts) {
    const { id, stock_quantity } = addedProduct;
    const newQuantity = stock_quantity - addedProduct.quantity;
    const { error: updateError } = await supabase
      .from('product')
        .update({ stock_quantity: newQuantity })
        .eq('id', id);
    if (updateError) {
      console.error(`Error updating product quantity for added products: ${updateError.message}`);  
      return null;
    }

    const { error: insertError } = await supabase
      .from('order_product')
      .insert({
            order_id: orderId,
            product_id: id,
            quantity: addedProduct.quantity,
            unit_price: addedProduct.price,
            sub_total: (addedProduct.price * addedProduct.quantity).toFixed(2)
          });
    if (insertError) {
      console.error(`Error inserting order product for added products: ${insertError.message}`);
      return null;
    }
  }

  //Update order
  const { error: updateOrderError } = await supabase
      .from('orders')
      .update({
        delivery_date: orderData.deliveryDate,
        doctor_id: orderData.selectedDoctor,
        social_security: orderData.socialSecurity,
        left_add:orderData.leftEye.add,
        left_axis:orderData.leftEye.axis,
        left_cyl:orderData.leftEye.cyl,
        left_ep:orderData.leftEye.ep,
        left_hp:orderData.leftEye.hp,
        left_prism:orderData.leftEye.prism,
        left_prism_axis:orderData.leftEye.prismAxis,
        left_sph:orderData.leftEye.sph,
        right_add:orderData.rightEye.add,
        right_axis:orderData.rightEye.axis,
        right_cyl:orderData.rightEye.cyl,
        right_ep:orderData.rightEye.ep,
        right_hp:orderData.rightEye.hp,
        right_prism:orderData.rightEye.prism,
        right_prism_axis:orderData.rightEye.prismAxis,
        right_sph:orderData.rightEye.sph,
        glass_type:orderData.glassType,
        glass_index:orderData.glassIndex,
        total_amount: orderData.totalAmount,
        status: orderData.orderState,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);
  if (updateOrderError) {
    console.error(`Error updating order: ${updateOrderError.message}`);
    return null;
  }

  //Update order vision
  const { error: updateOrderVisionError } = await supabase
    .from('order_vision')
    .update({
      farSightedness:orderVision.farSightedness,
      nearSightedness:orderVision.nearSightedness,
      progressive:orderVision.progressive,
      solar:orderVision.solar,
    })
    .eq('order_id', orderId);
  if (updateOrderVisionError) {
    console.error(`Error updating order vision: ${updateOrderVisionError.message}`);
    return null;
  }

  //Update order treatment
  const { error: updateOrderTreatmentError } = await supabase
    .from('order_treatment')
    .update({
      white:orderTreatments.white,
      antiBlueLight:orderTreatments.antiBlueLight,
      antiReflexion:orderTreatments.antiReflexion,
      degraded:orderTreatments.degraded,
      polarized:orderTreatments.polarized,
      mirrored:orderTreatments.mirrored,
      transitions:orderTreatments.transitions,
      uniColor:orderTreatments.uniColor,
    })
    .eq('order_id', orderId);
  if (updateOrderTreatmentError) {
    console.error(`Error updating order treatment: ${updateOrderTreatmentError.message}`);
    return null;
  }

  return true;

};

export { fetchClients , fetchDoctors};