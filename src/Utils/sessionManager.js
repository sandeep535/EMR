// Session storage keys
export const SESSION_KEYS = {
  TOKEN: 'token',
  USER_DETAILS: 'LoggedInUserDetails',
  LEFT_MENU: 'leftMenu',
  TENANT: 'tenant',
  LOGGED_USER: 'logged_user',
  ROLES_TASKS: 'rolesTasks'
};

// Session management utilities
export const sessionManager = {
  // Get session data
  getToken: () => sessionStorage.getItem(SESSION_KEYS.TOKEN),
  getUserDetails: () => {
    const details = sessionStorage.getItem(SESSION_KEYS.USER_DETAILS);
    return details ? JSON.parse(details) : null;
  },
  getLeftMenu: () => {
    const menu = sessionStorage.getItem(SESSION_KEYS.LEFT_MENU);
    return menu ? JSON.parse(menu) : null;
  },
  getTenant: () => sessionStorage.getItem(SESSION_KEYS.TENANT),
  getLoggedUser: () => sessionStorage.getItem(SESSION_KEYS.LOGGED_USER),
  getRolesTasks: () => {
    const roles = sessionStorage.getItem(SESSION_KEYS.ROLES_TASKS);
    return roles ? JSON.parse(roles) : null;
  },

  // Set session data
  setToken: (token) => sessionStorage.setItem(SESSION_KEYS.TOKEN, token),
  setUserDetails: (details) => sessionStorage.setItem(SESSION_KEYS.USER_DETAILS, JSON.stringify(details)),
  setLeftMenu: (menu) => sessionStorage.setItem(SESSION_KEYS.LEFT_MENU, JSON.stringify(menu)),
  setTenant: (tenant) => sessionStorage.setItem(SESSION_KEYS.TENANT, tenant),
  setLoggedUser: (user) => sessionStorage.setItem(SESSION_KEYS.LOGGED_USER, user),
  setRolesTasks: (roles) => sessionStorage.setItem(SESSION_KEYS.ROLES_TASKS, JSON.stringify(roles)),

  // Clear session data
  clearToken: () => sessionStorage.removeItem(SESSION_KEYS.TOKEN),
  clearUserDetails: () => sessionStorage.removeItem(SESSION_KEYS.USER_DETAILS),
  clearLeftMenu: () => sessionStorage.removeItem(SESSION_KEYS.LEFT_MENU),
  clearAll: () => sessionStorage.clear(),

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = sessionStorage.getItem(SESSION_KEYS.TOKEN);
    const userDetails = sessionStorage.getItem(SESSION_KEYS.USER_DETAILS);
    return !!(token && userDetails);
  },

  // Get current tenant or default
  getCurrentTenant: (defaultTenant = 'emr2') => {
    return sessionStorage.getItem(SESSION_KEYS.TENANT) || defaultTenant;
  }
}; 