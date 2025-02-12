import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ClientForm from '../components/ClientForm';
import PageTitle from '../components/PageTitle';
import ModalTitle from '../components/ModalTitle';
import SearchBar from '../components/SearchBar';
import { saveClient, fetchClients, deleteClient, updateClient } from '../supabaseClient'; 

function Clients() {
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const getClients = useCallback(async () => {
    const clientData = await fetchClients();
    setAllClients(clientData); 
  }, []);

  useEffect(() => {
    getClients();
  }, [currentPage, getClients]);

  const filteredClients = useMemo(() => {
    return allClients.filter((client) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        (client.first_name && client.first_name.toLowerCase().includes(searchTerm)) ||
        (client.last_name && client.last_name && client.last_name.toLowerCase().includes(searchTerm)) ||
        (client.phone_number && client.phone_number && client.phone_number.toLowerCase().includes(searchTerm))
      );
    });
  }, [allClients, searchQuery]);

  // Calculate current clients based on pagination
  const currentClients = useMemo(() => {
    const indexOfLastClient = currentPage * rowsPerPage;
    const indexOfFirstClient = indexOfLastClient - rowsPerPage;
    return filteredClients.slice(indexOfFirstClient, indexOfLastClient);
}, [filteredClients, currentPage, rowsPerPage]);

  useEffect(() => {
    setClients(currentClients);
  }, [currentClients]);

  const handleAddNewClient = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleEditClient = (clientId) => {
    const client = allClients.find(c => c.id === clientId);
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleDeleteClient = async(clientId) => {
    if (window.confirm(t('delete_confirmation_client'))) {
      await deleteClient(clientId);
      setCurrentPage(1);
      getClients();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleSubmitClient = async (clientData) => {
    if (editingClient) {
      const result = await updateClient(editingClient.id, clientData);
      if (result) 
          console.log('Client updated successfully:', result);
    } else {
      // Add new client
      const result = await saveClient(clientData);
      if (result) 
        console.log('Client saved successfully:', result);
    }
    setCurrentPage(1);
    getClients(); 
    setIsModalOpen(false);
    setEditingClient(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <PageTitle title={t('clients')} />
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddNewClient}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('addnewclient')}
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
                          {t('firstname')}
                        </th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white sm:table-cell">
                          {t('lastname')}
                        </th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white lg:table-cell">
                          {t('gender')}
                        </th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white lg:table-cell">
                          {t('profession')}
                        </th>
                        <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white sm:table-cell">
                          {t('phone')}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                          {t('debit')}
                        </th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                          {t('actions')}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                      {clients.map((client) => (
                        <tr key={client.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                            {client.first_name}
                            <dl className="font-normal lg:hidden">
                              <dt className="sr-only">{t('lastname')}</dt>
                              <dd className="mt-1 truncate text-gray-500 dark:text-gray-400">
                                {client.last_name}
                              </dd>
                              <dt className="sr-only sm:hidden">{t('phone')}</dt>
                              <dd className="mt-1 truncate text-gray-500 dark:text-gray-400 sm:hidden">
                                {client.phone_number}
                              </dd>
                            </dl>
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                            {client.last_name}
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                            {t(client.gender)}
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                            {client.profession}
                          </td>
                          <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 sm:table-cell">
                            {client.phone_number}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            ${client.debit.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={() => handleEditClient(client.id)}
                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteClient(client.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <TrashIcon className="h-5 w-5" />
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
            disabled={allClients.length <= rowsPerPage}
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

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
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
                  <ModalTitle title={editingClient ? t('editclient') : t('newclient')} />
                  <div className="mt-4">
                    <ClientForm 
                      onSubmit={handleSubmitClient} 
                      onCancel={handleCloseModal}
                      initialData={editingClient}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;
