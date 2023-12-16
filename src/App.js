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
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/registration" element={<Registration />} />
                  <Route path='/visit-creation' element={<VisitCreation />} />
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
