import React, { useState, useEffect } from 'react';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Clients from './pages/Clients';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Users from './pages/Users';
import Doctors from './pages/Doctors';
import Home from './pages/Home';
import Layout from './components/Layout';
import './i18n';


function ProtectedRoute({ element, darkMode, toggleDarkMode }) {
  const isAuthenticated = () => {
    return localStorage.getItem('isAuthenticated') === 'true';
  };

  return isAuthenticated() ? (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      {element}
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
}


function AppWrapper() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
      if (darkMode) {
          document.documentElement.classList.add('dark');
      } else {
          document.documentElement.classList.remove('dark');
      }
  }, [darkMode]);

  const toggleDarkMode = () => {
      setDarkMode(!darkMode);
  };

  return (
      <RouterProvider router={createHashRouter([
          { path: "/login", element: <Login /> },
          { path: "/", element: <ProtectedRoute element={<Home />} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> },
          { path: "/clients", element: <ProtectedRoute element={<Clients />} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> },
          { path: "/orders", element: <ProtectedRoute element={<Orders />} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> },
          { path: "/products", element: <ProtectedRoute element={<Products />} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> },
          //{ path: "/suppliers", element: <ProtectedRoute element={<Suppliers />} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> },
          { path: "/users", element: <ProtectedRoute element={<Users />} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> },
          { path: "/doctors", element: <ProtectedRoute element={<Doctors />} darkMode={darkMode} toggleDarkMode={toggleDarkMode} /> },
      ],
      {
        future: {
          v7_relativeSplatPath: true,
          v7_startTransition: true, 
        },})} />
  );
}

function App() {
  return <AppWrapper />;
}

export default App;
