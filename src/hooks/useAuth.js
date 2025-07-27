import { useEffect, useState, useRef } from 'react';
import { sessionManager } from '../Utils/sessionManager';

// Constants
const DEFAULT_TENANT = 'emr2';

export const useAuth = ({ location, params, appContextValue, navigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const initialAuthCheckDone = useRef(false);

  useEffect(() => {
    const performAuthCheck = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Skip if already on login page
        if (location.pathname.startsWith('/login/')) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const sessionToken = sessionManager.getToken();
        const sessionLoggedInUserDetails = sessionManager.getUserDetails();
        const leftmenu = sessionManager.getLeftMenu();

        if (sessionToken && sessionLoggedInUserDetails) {
          // Set context values
          appContextValue.setIslogin(true);
          appContextValue.setLoggedInUserDetails(sessionLoggedInUserDetails);
          
          if (leftmenu) {
            appContextValue.setLeftMenuList(leftmenu);
          }

          setIsAuthenticated(true);

          // Only navigate if not on dashboard
         // if (!location.pathname.includes('dashboard')) {
          //  navigate("/nurse-dashboard", { replace: true });
         // }
        } else if (!appContextValue.isLogin) {
          const currentTenant = params.tenant || DEFAULT_TENANT;
          navigate(`/login/${currentTenant}`, { replace: true });
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error processing session data:", error);
        setError("Failed to authenticate user");
        sessionManager.clearAll();
        const currentTenant = params.tenant || DEFAULT_TENANT;
        navigate(`/login/${currentTenant}`, { replace: true });
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    performAuthCheck();
  }, [ params.tenant, appContextValue.isLogin, navigate]);

  // Additional effect to handle authentication state changes
  useEffect(() => {
    if (appContextValue.isLogin && location.pathname.startsWith('/login/')) {
      // User just logged in, navigate to dashboard
      navigate("/nurse-dashboard", { replace: true });
    }
  }, [appContextValue.isLogin, location.pathname, navigate]);

  return {
    isAuthenticated,
    isLoading,
    error
  };
}; 