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

export default function MainScreen() {

    useEffect(() => {
        console.log("MainScreen ------------------->", appContextValue);
        
    }, []);
    const appContextValue = useContext(AppContext);
    
    return (
        <>

            {!appContextValue.isLogin &&
                (<Routes>
                    
                    <Route path='/login' element={<LoginPage />} />
                </Routes>)}
            {appContextValue && appContextValue.isLogin &&
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
                                <Route path='/rolesAnsTasks' element={<RoleAndTasks />} />
                            </Routes>
                        </main>
                    </div>
                </MyProSidebarProvider>
            }

        </>
    )
}