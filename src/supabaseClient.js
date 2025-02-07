import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export { fetchClients , fetchDoctors};