import React from 'react';
import { X, User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { formatDate, getStatusColor, getDepartmentLabel } from '../../utils/helpers';

const PartnershipModal = ({ isOpen, onClose, partnership }) => {
  if (!isOpen || !partnership) return null;

  const statusColor = getStatusColor(partnership.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{partnership.business_name}</h2>
            <p className="text-sm text-gray-500 mt-1">{getDepartmentLabel(partnership.department)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {partnership.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Contact Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start">
                <User className="w-4 h-4 text-gray-400 mt-1 mr-3" />
                <div>
                  <p className="text-xs text-gray-500">Contact Person</p>
                  <p className="text-sm font-medium text-gray-900">{partnership.contact_person}</p>
                </div>
              </div>

              {partnership.email && (
                <div className="flex items-start">
                  <Mail className="w-4 h-4 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{partnership.email}</p>
                  </div>
                </div>
              )}

              {partnership.contact_number && (
                <div className="flex items-start">
                  <Phone className="w-4 h-4 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{partnership.contact_number}</p>
                  </div>
                </div>
              )}

              {partnership.address && (
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-3" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-medium text-gray-900">{partnership.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Management */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Management</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div>
                <p className="text-xs text-gray-500">Manager/Supervisor 1</p>
                <p className="text-sm font-medium text-gray-900">{partnership.manager_supervisor_1}</p>
              </div>
              {partnership.manager_supervisor_2 && (
                <div>
                  <p className="text-xs text-gray-500">Manager/Supervisor 2</p>
                  <p className="text-sm font-medium text-gray-900">{partnership.manager_supervisor_2}</p>
                </div>
              )}
            </div>
          </div>

          {/* Partnership Duration */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Partnership Duration
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Date Established</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(partnership.date_established)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Expiration Date</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(partnership.expiration_date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">School Year</span>
                <span className="text-sm font-medium text-gray-900">{partnership.school_year}</span>
              </div>
            </div>
          </div>

          {/* Remarks */}
          {partnership.remarks && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Remarks
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">{partnership.remarks}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PartnershipModal;