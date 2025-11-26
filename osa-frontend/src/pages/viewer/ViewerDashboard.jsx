import React, { useState } from 'react';
import { Building2, Eye, Info } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { usePartnerships } from '../../hooks/usePartnerships';
import Navbar from '../../components/common/Navbar';
import StatsCard from '../../components/dashboard/StatsCard';
import PartnershipFilters from '../../components/partnerships/PartnershipFilters';
import PartnershipList from '../../components/partnerships/PartnershipList';
import PartnershipModal from '../../components/partnerships/PartnershipModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ViewerDashboard = () => {
  useAuth();
  const {
    partnerships,
    loading,
    filters,
    updateFilters,
    clearFilters
  } = usePartnerships();

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPartnership, setSelectedPartnership] = useState(null);

  const stats = {
    total: partnerships.length,
    active: partnerships.filter(p => p.status === 'active').length,
    for_renewal: partnerships.filter(p => p.status === 'for_renewal').length,
    terminated: partnerships.filter(p => p.status === 'terminated').length
  };

  const handleView = (partnership) => {
    setSelectedPartnership(partnership);
    setIsViewModalOpen(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Partnership Directory</h1>
          <p className="text-gray-600">Browse institutional partnerships</p>
        </div>

        {/* Limited Access Notice */}
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-900 font-medium mb-1">Limited Access - Viewer Mode</p>
              <p className="text-sm text-yellow-800">
                As a viewer, you have read-only access to basic partnership information:
              </p>
              <ul className="text-sm text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                <li>Partnership name</li>
                <li>Department affiliation</li>
                <li>Partnership duration (start and end dates)</li>
                <li>Status (Active, For Renewal, etc.)</li>
              </ul>
              <p className="text-xs text-yellow-700 mt-2 italic">
                Contact details, manager information, and additional notes are restricted for privacy and security.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Partnerships"
            value={stats.total}
            icon={Building2}
            color="blue"
          />
          <StatsCard
            title="Active"
            value={stats.active}
            icon={Eye}
            color="green"
          />
          <StatsCard
            title="For Renewal"
            value={stats.for_renewal}
            icon={Eye}
            color="yellow"
          />
          <StatsCard
            title="Terminated"
            value={stats.terminated}
            icon={Eye}
            color="red"
          />
        </div>

        {/* Filters */}
        <PartnershipFilters
          filters={filters}
          onFilterChange={updateFilters}
          onClearFilters={clearFilters}
          showDepartmentFilter={true}
        />

        {/* Partnerships List - Internal pagination */}
        <PartnershipList
          partnerships={partnerships}
          onEdit={() => {}}
          onDelete={() => {}}
          onView={handleView}
          canEdit={false}
          showFullDetails={false}
          groupByDepartment={true}
          userDepartment={null}
          userRole="viewer"
          itemsPerPage={6}
        />

        {/* View Modal (Limited info) */}
        <PartnershipModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedPartnership(null);
          }}
          partnership={selectedPartnership}
          isLimitedAccess={true}
        />
      </main>
    </div>
  );
};

export default ViewerDashboard;