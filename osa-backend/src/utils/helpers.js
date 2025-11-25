const calculateSchoolYear = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    if (month >= 7) {
      return `${year}-${year + 1}`;
    }
    return `${year - 1}-${year}`;
  };
  
  const isPartnershipExpired = (expirationDate) => {
    return new Date(expirationDate) < new Date();
  };
  
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };
  
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const validatePhoneNumber = (phone) => {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };
  
  const sanitizePartnershipData = (data, isViewer = false) => {
    if (isViewer) {
      const { email, remarks, ...sanitized } = data;
      return sanitized;
    }
    return data;
  };
  
  module.exports = {
    calculateSchoolYear,
    isPartnershipExpired,
    formatDate,
    validateEmail,
    validatePhoneNumber,
    sanitizePartnershipData
  };