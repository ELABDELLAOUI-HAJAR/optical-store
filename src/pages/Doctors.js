import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import PageTitle from '../components/PageTitle';
import ModalTitle from '../components/ModalTitle';
import DoctorForm from '../components/DoctorForm';
import SearchBar from '../components/SearchBar';
import { saveDoctor, fetchDoctors, deleteDoctor, updateDoctor } from '../supabaseClient'; 
import ConfirmationModal from '../components/ConfirmationModal';
import NotificationModal from '../components/NotificationModal';

function Doctors() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [allDoctors, setAllDoctors] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 5;
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmDoctorId, setConfirmDoctorId] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('success');

  const getDoctors = useCallback(async () => {
    const doctorData = await fetchDoctors();
    setAllDoctors(doctorData); 
  }, []);

  useEffect(() => {
    getDoctors();
  }, [getDoctors]);


  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doctor) => {
      const searchTerm = searchQuery.toLowerCase();
      return (
        doctor.first_name.toLowerCase().includes(searchTerm) ||
        doctor.last_name.toLowerCase().includes(searchTerm) ||
        doctor.specialty.toLowerCase().includes(searchTerm) ||
        doctor.email.toLowerCase().includes(searchTerm) ||
        doctor.phone_number.toLowerCase().includes(searchTerm)
      );
    });
  }, [allDoctors, searchQuery]);

  // Calculate current doctors based on pagination
  const currentDoctors = useMemo(() => {
    const indexOfLastDoctor = currentPage * rowsPerPage;
    const indexOfFirstDoctor = indexOfLastDoctor - rowsPerPage;
    setTotalPages(Math.ceil(filteredDoctors.length / rowsPerPage));
    return filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor);
}, [filteredDoctors, currentPage, rowsPerPage]);

  useEffect(() => {
    setDoctors(currentDoctors);
  }, [currentDoctors]);

  const handleAddNewDoctor = () => {
    setEditingDoctor(null);
    setIsModalOpen(true);
  };

  const handleEditDoctor = (doctorId) => {
    const doctor = allDoctors.find(d => d.id === doctorId);
    setEditingDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleDeleteDoctor = async (doctorId) => {
    setConfirmDoctorId(doctorId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async() => {
    try {
      await deleteDoctor(confirmDoctorId);
      // Refresh the doctors list
      setCurrentPage(1);
      getDoctors();
      //alert(t('doctor_deleted_successfully'));
      setNotificationMessage(t('doctor_deleted_successfully'));
      setNotificationType('success');
      setIsNotificationOpen(true);
      setIsConfirmModalOpen(false);  // Close the modal after successful deletion
    } catch (error) {
      console.error('Error deleting doctor:', error);
      //alert(t('delete_doctor_error'));
      setNotificationMessage(t('delete_doctor_error'));
      setNotificationType('error');
      setIsNotificationOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
  };

  const handleSubmitDoctor = async (doctorData) => {
    if (editingDoctor) {
      // Update existing doctor
      const result = await updateDoctor(editingDoctor.id, doctorData);
      if (result) 
          console.log('Doctor updated successfully:', result);
    } else {
      // Add new doctor
      const result = await saveDoctor(doctorData);
      if (result) {
        console.log('Doctor saved successfully:', result);
      }
    }
    setCurrentPage(1);
    getDoctors();
    setIsModalOpen(false);
    setEditingDoctor(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <PageTitle title={t('doctors')} />
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddNewDoctor}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('addnewdoctor')}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <SearchBar
          placeholder={t('searchDoctors')}
          value={searchQuery}
          onChange={setSearchQuery}
        />
        
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white sm:pl-6">
                  {t('name')}
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  {t('specialty')}
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white">
                  {t('phone')}
                </th>
                <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white lg:table-cell">
                  {t('email')}
                </th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-white ">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                    Dr. {doctor.first_name} {doctor.last_name}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">{t('email')}</dt>
                      <dd className="mt-1 truncate text-gray-500 dark:text-gray-400">
                        {doctor.email}
                      </dd>
                    </dl>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {doctor.specialty}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {doctor.phone_number}
                  </td>
                  <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                    {doctor.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={() => handleEditDoctor(doctor.id)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="sr-only">{t('edit')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDoctor(doctor.id)}
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

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
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
                  <ModalTitle title={editingDoctor ? t('editdoctor') : t('newdoctor')} />
                  <div className="mt-4">
                    <DoctorForm
                      onSubmit={handleSubmitDoctor}
                      onCancel={handleCloseModal}
                      initialData={editingDoctor}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={t('delete_confirmation_doctor')}
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

export default Doctors;
