import React from 'react';
import { Building2, Calendar, Mail, Phone, User, Edit, Trash2, Eye } from 'lucide-react';
import { formatDate, getStatusColor, getDepartmentLabel } from '../../utils/helpers';

const PartnershipCard = ({ partnership, onEdit, onDelete, onView, canEdit, showFullDetails }) => {
  const statusColor = getStatusColor(partnership.status);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="bg-blue-50 p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-800" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900">{partnership.business_name}</h3>
            <p className="text-sm text-gray-500">{getDepartmentLabel(partnership.department)}</p>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {partnership.status.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-800">
          <User className="w-4 h-4 mr-2" />
          <span>{partnership.contact_person}</span>
        </div>

        {showFullDetails && partnership.email && (
          <div className="flex items-center text-sm text-gray-800">
            <Mail className="w-4 h-4 mr-2" />
            <span>{partnership.email}</span>
          </div>
        )}

        {showFullDetails && partnership.contact_number && (
          <div className="flex items-center text-sm text-gray-800">
            <Phone className="w-4 h-4 mr-2" />
            <span>{partnership.contact_number}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-800">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{formatDate(partnership.date_established)} - {formatDate(partnership.expiration_date)}</span>
        </div>

        {showFullDetails && partnership.remarks && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-medium text-gray-800 mb-1">Remarks:</p>
            <p className="text-sm text-gray-800">{partnership.remarks}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={() => onView(partnership)}
          className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>

        {canEdit && (
          <>
            <button
              onClick={() => onEdit(partnership)}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button
              onClick={() => onDelete(partnership)}
              className="flex items-center justify-center px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PartnershipCard;