import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { DEPARTMENTS, PARTNERSHIP_STATUS } from '../../utils/constants';
import { validateRequired, validateEmail } from '../../utils/validation';

const PartnershipForm = ({ isOpen, onClose, onSubmit, partnership, loading, userDepartment }) => {
  const [formData, setFormData] = useState({
    business_name: '',
    department: userDepartment || '',
    address: '',
    contact_person: '',
    manager_supervisor_1: '',
    manager_supervisor_2: '',
    email: '',
    contact_number: '',
    date_established: '',
    expiration_date: '',
    status: 'active',
    remarks: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (partnership) {
      setFormData({
        business_name: partnership.business_name || '',
        department: partnership.department || userDepartment || '',
        address: partnership.address || '',
        contact_person: partnership.contact_person || '',
        manager_supervisor_1: partnership.manager_supervisor_1 || '',
        manager_supervisor_2: partnership.manager_supervisor_2 || '',
        email: partnership.email || '',
        contact_number: partnership.contact_number || '',
        date_established: partnership.date_established || '',
        expiration_date: partnership.expiration_date || '',
        status: partnership.status || 'active',
        remarks: partnership.remarks || ''
      });
    }
  }, [partnership, userDepartment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!validateRequired(formData.business_name)) {
      newErrors.business_name = 'Business name is required';
    }
    if (!validateRequired(formData.department)) {
      newErrors.department = 'Department is required';
    }
    if (!validateRequired(formData.address)) {
      newErrors.address = 'Address is required';
    }
    if (!validateRequired(formData.contact_person)) {
      newErrors.contact_person = 'Contact person is required';
    }
    if (!validateRequired(formData.manager_supervisor_1)) {
      newErrors.manager_supervisor_1 = 'At least one manager/supervisor is required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!validateRequired(formData.contact_number)) {
      newErrors.contact_number = 'Contact number is required';
    }
    if (!validateRequired(formData.date_established)) {
      newErrors.date_established = 'Establishment date is required';
    }
    if (!validateRequired(formData.expiration_date)) {
      newErrors.expiration_date = 'Expiration date is required';
    }

    if (formData.date_established && formData.expiration_date) {
      if (new Date(formData.expiration_date) <= new Date(formData.date_established)) {
        newErrors.expiration_date = 'Expiration date must be after establishment date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {partnership ? 'Edit Partnership' : 'Create New Partnership'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Name <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent ${
                  errors.business_name ? 'border-red-700' : 'border-gray-300'
                }`}
                placeholder="Enter business name"
              />
              {errors.business_name && (
                <p className="text-red-700 text-xs mt-1">{errors.business_name}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department <span className="text-red-700">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled={!!userDepartment}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent ${
                  errors.department ? 'border-red-700' : 'border-gray-300'
                } ${userDepartment ? 'bg-gray-100' : ''}`}
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(dept => (
                  <option key={dept.value} value={dept.value}>{dept.value} - {dept.label}</option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-700 text-xs mt-1">{errors.department}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-700">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent"
              >
                {PARTNERSHIP_STATUS.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent ${
                  errors.contact_person ? 'border-red-700' : 'border-gray-300'
                }`}
                placeholder="Enter contact person name"
              />
              {errors.contact_person && (
                <p className="text-red-700 text-xs mt-1">{errors.contact_person}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-700">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent ${
                  errors.email ? 'border-red-700' : 'border-gray-300'
                }`}
                placeholder="email@example.com"
              />
              {errors.email && (
                <p className="text-red-700 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="contact_number"
                value={formData.contact_number}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent ${
                  errors.contact_number ? 'border-red-700' : 'border-gray-300'
                }`}
                placeholder="+63 912 345 6789"
              />
              {errors.contact_number && (
                <p className="text-red-700 text-xs mt-1">{errors.contact_number}</p>
              )}
            </div>

            {/* Manager/Supervisor 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manager/Supervisor 1 <span className="text-red-700">*</span>
              </label>
              <input
                type="text"
                name="manager_supervisor_1"
                value={formData.manager_supervisor_1}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent ${
                  errors.manager_supervisor_1 ? 'border-red-700' : 'border-gray-300'
                }`}
                placeholder="Enter manager/supervisor name"
              />
              {errors.manager_supervisor_1 && (
                <p className="text-red-700 text-xs mt-1">{errors.manager_supervisor_1}</p>
              )}
            </div>

            {/* Manager/Supervisor 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Manager/Supervisor 2 (Optional)
              </label>
              <input
                type="text"
                name="manager_supervisor_2"
                value={formData.manager_supervisor_2}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                placeholder="Enter second manager/supervisor name"
              />
            </div>

            {/* Date Established */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Established <span className="text-red-700">*</span>
              </label>
              <input
                type="date"
                name="date_established"
                value={formData.date_established}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent ${
                  errors.date_established ? 'border-red-700' : 'border-gray-300'
                }`}
              />
              {errors.date_established && (
                <p className="text-red-700 text-xs mt-1">{errors.date_established}</p>
              )}
            </div>

            {/* Expiration Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date <span className="text-red-700">*</span>
              </label>
              <input
                type="date"
                name="expiration_date"
                value={formData.expiration_date}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent ${
                  errors.expiration_date ? 'border-red-700' : 'border-gray-300'
                }`}
              />
              {errors.expiration_date && (
                <p className="text-red-700 text-xs mt-1">{errors.expiration_date}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-700">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent ${
                  errors.address ? 'border-red-700' : 'border-gray-300'
                }`}
                placeholder="Enter complete address"
              />
              {errors.address && (
                <p className="text-red-700 text-xs mt-1">{errors.address}</p>
              )}
            </div>

            {/* Remarks */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks (Optional)
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-700 focus:border-transparent"
                placeholder="Enter any additional remarks or notes"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Saving...' : (partnership ? 'Update Partnership' : 'Create Partnership')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnershipForm;