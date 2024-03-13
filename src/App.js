import React, { useEffect, useState, useContext } from 'react';
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
import RoleAndTasks from "./pages/RoleAndTaks/RoleAndTasks";
import LoginPage from "./pages/Login/LoginPage";
import AppContext from './components/Context/AppContext';
import MainScreen from './MainScreen';


const App = () => {
  const [theme, colorMode] = useMode();
 
  return (
    <AppProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Loader />
          <MainScreen/>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppProvider>
  );
};

export default App;
