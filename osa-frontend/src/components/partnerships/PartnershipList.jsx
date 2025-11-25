import React from 'react';
import PartnershipCard from './PartnershipCard';
import { Building2 } from 'lucide-react';
import { usePagination } from '../../hooks/usePagination';

const PartnershipList = ({ partnerships, onEdit, onDelete, onView, canEdit, showFullDetails, groupByDepartment = false, userDepartment = null, pagination = null, itemsPerPage = 3 }) => {
  if (partnerships.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No partnerships found</h3>
        <p className="text-gray-500">Try adjusting your filters or create a new partnership.</p>
      </div>
    );
  }

  if (groupByDepartment) {
    const grouped = partnerships.reduce((acc, partnership) => {
      const dept = partnership.department;
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(partnership);
      return acc;
    }, {});

    return (
      <div className="space-y-8">
        {Object.entries(grouped).map(([dept, deptPartnerships]) => {
          
          const DepartmentSection = () => {
            const deptPagination = usePagination(deptPartnerships, itemsPerPage);
            
            return (
              <div key={dept}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{dept}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {deptPagination.currentItems.map(partnership => (
                    <PartnershipCard
                      key={partnership.id}
                      partnership={partnership}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onView={onView}
                      canEdit={canEdit}
                      showFullDetails={showFullDetails}
                      isOwnDepartment={userDepartment ? partnership.department === userDepartment : true}
                    />
                  ))}
                </div>
               
                {deptPartnerships.length > itemsPerPage && pagination && (
                  <div className="mt-6">
                    {React.cloneElement(pagination, {
                      currentPage: deptPagination.currentPage,
                      totalPages: deptPagination.totalPages,
                      totalItems: deptPagination.totalItems,
                      itemsPerPage: deptPagination.itemsPerPage,
                      onPageChange: deptPagination.handlePageChange,
                      onItemsPerPageChange: deptPagination.handleItemsPerPageChange
                    })}
                  </div>
                )}
              </div>
            );
          };
          
          return <DepartmentSection key={dept} />;
        })}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partnerships.map(partnership => (
          <PartnershipCard
            key={partnership.id}
            partnership={partnership}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
            canEdit={canEdit}
            showFullDetails={showFullDetails}
            isOwnDepartment={userDepartment ? partnership.department === userDepartment : true}
          />
        ))}
      </div>
      {pagination && (
        <div className="mt-6">
          {pagination}
        </div>
      )}
    </>
  );
};

export default PartnershipList;