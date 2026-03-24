import React, { useEffect, useContext, useRef, useState } from "react";
import { Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import Topbar from "./pages/global/Topbar";
import AppContext from "./components/Context/AppContext";
import ApplicationRoutes from "./common/Routes";
import { useAuth } from "./hooks/useAuth";
import { useLayout } from "./hooks/useLayout";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import ClientBanner from "./components/ClientBanner/ClientBanner";
import { sendRequest } from "./pages/global/DataManager";
import APIS from "./Utils/APIS";

export default function MainScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const appContextValue = useContext(AppContext);
  
  // Custom hooks for better separation of concerns
  const { isAuthenticated, isLoading, error } = useAuth({
    location,
    params,
    appContextValue,
    navigate
  });
  
  const isPatientSpecificScreen = appContextValue.leftMenuList
    ?.some(menu =>
      menu.isPatientSpecific === true &&
      menu.subMenu?.some(item => item.to === location.pathname)
    );

  const showBanner = isPatientSpecificScreen && appContextValue.selectedVisitDeatils?.clientid;
  const [bedInfo, setBedInfo] = useState(null);

  useEffect(() => {
    if (!showBanner) { setBedInfo(null); return; }
    const patientId = appContextValue.selectedVisitDeatils?.clientid?.seqid;
    if (!patientId) return;
    const url = APIS.GET_PATIENT_ACTIVE_BED.URL.replace('{patientId}', patientId);
    sendRequest({ method: APIS.GET_PATIENT_ACTIVE_BED.METHOD, url })
      .then(result => {
        if (result && result.length > 0) {
          const bed = result[0];
          setBedInfo(bed.bedPath|| null);
        } else {
          setBedInfo(null);
        }
      });
  }, [showBanner, appContextValue.selectedVisitDeatils?.clientid?.seqid]);

  const routes = (
    <Routes>
      {ApplicationRoutes.map((route, index) => (
        <Route
          key={`${route.path}-${index}`}
          path={route.path}
          element={React.cloneElement(route.element, { key: location.pathname })}
        />
      ))}
    </Routes>
  );

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner message="Checking authentication..." />;
  }

  // Show error state if authentication failed
  if (error) {
    return <ErrorBoundary error={error} />;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar - 20% width */}
      {isAuthenticated && (<Box sx={{ minWidth: 100, maxWidth: 400, height: '100vh', bgcolor: 'sidebar.main', display: 'flex', flexDirection: 'column' }}>
        <MyProSidebarProvider />
      </Box>)}
      {/* Main Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
        {/* Topbar - 5% height */}
        {isAuthenticated && (
          <Box sx={{ height: '5vh', minHeight: 48, maxHeight: 80 }}>
            <Topbar />
          </Box>
        )}
        {/* Main Content */}
        <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default' }}>
          {showBanner && (
            <Box sx={{ px: 1, pt: 1 }}>
              <ClientBanner
                clientData={appContextValue.selectedVisitDeatils.clientid}
                visitData={appContextValue.selectedVisitDeatils}
                bedInfo={bedInfo}
              />
            </Box>
          )}
          {routes}
        </Box>
      </Box>
    </Box>
  );
}
