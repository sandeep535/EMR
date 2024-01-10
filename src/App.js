import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";

import Topbar from "./pages/global/Topbar";
import VisitCreation from "./pages/visit-creation/VisitCreation";
import Dashboard from "./pages/dashboard";
import Registration from "./pages/registration-form/ClientRegistration";
import Loader from './components/Loader/Loader';
import AppProvider from "./components/Context/AppProvider";
import VisitDasboard from "./pages/VisistDashboard/VisitDashboard";
import VisitActivity from "./pages/VisitActivites/VisitActivity";
import EmployeeMaster from "./pages/EmpployeMaster/EmployeeMatser";
import ServiceMaster from "./pages/ServiceMaster/ServiceMaster";
import VitalsList from "./pages/Vitals/VitalsList";
import PrescriptionsList from "./pages/Prescriptions/PrescriptionsList";

const App = () => {
  const [theme, colorMode] = useMode();
  return (
    <AppProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Loader />
          <MyProSidebarProvider>
            <div style={{ height: "100%", width: "100%" }}>
              <main>
                <Topbar />
                <Routes>
                  <Route path='/vist-dashboard' element={<VisitDasboard />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path='/visit-creation' element={<VisitCreation />} />
                  <Route path='/vist-activity' element={<VisitActivity />} />
                  <Route path='/employeeMaster' element={<EmployeeMaster />} />
                  <Route path='/serviceMaster' element={<ServiceMaster />} />
                  <Route path='/vitalsList' element={<VitalsList />} />
                  <Route path='/prescriptionsList' element={<PrescriptionsList />} />
                </Routes>
              </main>
            </div>
          </MyProSidebarProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppProvider>
  );
};

export default App;
