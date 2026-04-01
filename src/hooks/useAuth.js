import { useEffect, useState, useRef } from 'react';
import { sessionManager } from '../Utils/sessionManager';

const DEFAULT_TENANT = 'emr2';

export const useAuth = ({ location, params, appContextValue, navigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isRefresh = useRef(true);

  useEffect(() => {
    const performAuthCheck = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (location.pathname.startsWith('/login/')) {
          isRefresh.current = false;
          setIsLoading(false);
          return;
        }

        const sessionToken = sessionManager.getToken();
        const sessionLoggedInUserDetails = sessionManager.getUserDetails();

        if (sessionToken && sessionLoggedInUserDetails) {
          appContextValue.setIslogin(true);
          appContextValue.setLoggedInUserDetails(sessionLoggedInUserDetails);

          const leftmenu = appContextValue.leftMenuList?.length
            ? appContextValue.leftMenuList
            : sessionManager.getLeftMenu();

          if (leftmenu) {
            if (isRefresh.current) {
              // Only on page refresh — reset patient state and navigate to default
              isRefresh.current = false;
              const resetMenu = leftmenu.map((menu) => ({
                ...menu,
                isOpen: false,
                ...(Object.prototype.hasOwnProperty.call(menu, 'isPatientSpecific') && { isPatientSpecific: false }),
                subMenu: (menu.subMenu || []).map((sub) => ({
                  ...sub,
                  ...(Object.prototype.hasOwnProperty.call(sub, 'isPatientSpecific') && { isPatientSpecific: false }),
                })),
              }));
              appContextValue.setLeftMenuList(resetMenu);
              sessionManager.setLeftMenu(resetMenu);
              const roles = sessionManager.getRolesTasks();
              if (roles) appContextValue.setLoggedInRolesTaks(roles);
              const defaultItem = findDefaultMenuItem(resetMenu, roles);
              navigate(defaultItem ? defaultItem.to : '/nurse-dashboard', { replace: true });
            } else {
              appContextValue.setLeftMenuList(leftmenu);
            }
          }

        } else if (!appContextValue.isLogin) {
          const currentTenant = params.tenant || DEFAULT_TENANT;
          navigate(`/login/${currentTenant}`, { replace: true });
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setError('Failed to authenticate user');
        sessionManager.clearAll();
        navigate(`/login/${params.tenant || DEFAULT_TENANT}`, { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    performAuthCheck();
  }, [appContextValue.isLogin]);

  // Navigate away from login page once authenticated
  useEffect(() => {
    if (appContextValue.isLogin && location.pathname.startsWith('/login/')) {
      navigate('/nurse-dashboard', { replace: true });
    }
  }, [appContextValue.isLogin, location.pathname]);

  const isAuthenticated = appContextValue.isLogin;

  return { isAuthenticated, isLoading, error };
};

// Find default screen from leftMenu using role's defaultoptionvalue
function findDefaultMenuItem(leftMenu, roles) {
  if (roles && Array.isArray(roles)) {
    const defaultRole = roles.find(r => r.defaultoptionvalue);
    if (defaultRole) {
      for (const menu of leftMenu) {
        for (const submenu of menu.subMenu || []) {
          if (submenu.screencode === defaultRole.actioncode) return submenu;
        }
      }
    }
  }
  // fallback — first available submenu item
  for (const menu of leftMenu) {
    if (menu.subMenu?.length) return menu.subMenu[0];
  }
  return null;
}