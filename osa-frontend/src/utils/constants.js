export const DEPARTMENTS = [
  { value: 'STE', label: 'School of Teacher Education' },
  { value: 'CET', label: 'College of Engineering and Technology' },
  { value: 'CCJE', label: 'College of Criminal Justice Education' },
  { value: 'HuSoCom', label: 'Humanities, Social Sciences and Communication' },
  { value: 'BSMT', label: 'Bachelor of Science in Marine Transportation' },
  { value: 'SBME', label: 'School of Business and Management Education' },
  { value: 'CHATME', label: 'College of Hospitality and Tourism Management Education' }
];

export const PARTNERSHIP_STATUS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'terminated', label: 'Terminated', color: 'red' },
  { value: 'for_renewal', label: 'For Renewal', color: 'yellow' },
  { value: 'non_renewal', label: 'Non-Renewal', color: 'gray' }
];

export const USER_ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'department', label: 'Department' },
  { value: 'viewer', label: 'Viewer' }
];

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  PARTNERSHIPS: {
    BASE: '/partnerships',
    STATISTICS: '/partnerships/statistics',
    BY_ID: (id) => `/partnerships/${id}`
  },
  ADMIN: {
    USERS: '/admin/users',
    USER_BY_ID: (id) => `/admin/users/${id}`,
    CHANGE_USER_PASSWORD: (id) => `/admin/users/${id}/change-password`,
    AUDIT_LOGS: '/admin/audit-logs',
    DASHBOARD_STATS: '/admin/dashboard-stats'
  }
};

export const STORAGE_KEYS = {
  TOKEN: 'osa_token',
  USER: 'osa_user'
};