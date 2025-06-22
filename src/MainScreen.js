import React, { useEffect, useContext, useRef } from "react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import Topbar from "./pages/global/Topbar";
import LoginPage from "./pages/Login/LoginPage";
import AppContext from "./components/Context/AppContext";
import ApplicationRoutes from "./common/Routes";

export default function MainScreen(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const appContextValue = useContext(AppContext);
  const initialAuthCheckDone = useRef(false);

  useEffect(() => {
    // Skip if we've already done the initial auth check
    if (initialAuthCheckDone.current) {
      return;
    }

    const sessionToken = sessionStorage.getItem("token");
    const sessionLoggedInUserDetails = sessionStorage.getItem("LoggedInUserDetails");
    const leftmenu = sessionStorage.getItem("leftMenu");

    // Skip if already on login page
    if (location.pathname.startsWith('/login/')) {
      initialAuthCheckDone.current = true;
      return;
    }

    try {
      if (sessionToken && sessionLoggedInUserDetails) {
        // Set context values
        appContextValue.setIslogin(true);
        appContextValue.setLoggedInUserDetails(JSON.parse(sessionLoggedInUserDetails));
        
        if (leftmenu) {
          appContextValue.setLeftMenuList(JSON.parse(leftmenu));
        }

        // Only navigate if not on dashboard
        if (!location.pathname.includes('dashboard')) {
          navigate("/nurse-dashboard", { replace: true });
        }
      } else if (!appContextValue.isLogin) {
        const currentTenant = params.tenant || 'emr2';
        navigate(`/login/${currentTenant}`, { replace: true });
      }
    } catch (error) {
      console.error("Error processing session data:", error);
      sessionStorage.clear();
      const currentTenant = params.tenant || 'emr2';
      navigate(`/login/${currentTenant}`, { replace: true });
    }

    initialAuthCheckDone.current = true;
  }, []); // Empty dependency array - only run on mount

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {appContextValue.isLogin && (
        <Box>
          <MyProSidebarProvider />
        </Box>
      )}
      <Box sx={{ width: "100%", height: "100%" }}>
        {appContextValue.isLogin && (
          <Box sx={{ height: "8%" }}>
            <Topbar />
          </Box>
        )}
        <Box sx={{ height: appContextValue.isLogin ? "92%" : "100%", overflowY: "auto" }}>
          <Routes>
            {ApplicationRoutes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
