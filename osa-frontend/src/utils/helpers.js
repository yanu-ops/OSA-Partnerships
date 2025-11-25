export const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  export const calculateDaysUntilExpiry = (expirationDate) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  export const isExpiringSoon = (expirationDate, days = 30) => {
    const daysUntilExpiry = calculateDaysUntilExpiry(expirationDate);
    return daysUntilExpiry <= days && daysUntilExpiry >= 0;
  };
  
  export const isExpired = (expirationDate) => {
    return calculateDaysUntilExpiry(expirationDate) < 0;
  };
  
  export const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      terminated: 'bg-red-100 text-red-800',
      for_renewal: 'bg-yellow-100 text-yellow-800',
      non_renewal: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.active;
  };
  
  export const getDepartmentLabel = (value) => {
    const departments = {
      'STE': 'Science, Technology, Engineering',
      'CET': 'Computer Engineering Technology',
      'CCJE': 'Criminology and Criminal Justice Education',
      'HousoCom': 'Hotel and Restaurant Services Community',
      'BSMT': 'Marine Transportation',
      'SBME': 'Marine Engineering',
      'CHATME': 'Teaching and Maritime Education'
    };
    return departments[value] || value;
  };
  
  export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  
  export const groupByDepartment = (partnerships) => {
    return partnerships.reduce((acc, partnership) => {
      const dept = partnership.department;
      if (!acc[dept]) {
        acc[dept] = [];
      }
      acc[dept].push(partnership);
      return acc;
    }, {});
  };
  
  export const filterPartnerships = (partnerships, filters) => {
    return partnerships.filter(p => {
      if (filters.department && p.department !== filters.department) return false;
      if (filters.status && p.status !== filters.status) return false;
      if (filters.school_year && p.school_year !== filters.school_year) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          p.business_name.toLowerCase().includes(search) ||
          p.contact_person.toLowerCase().includes(search)
        );
      }
      return true;
    });
  };