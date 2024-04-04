import React, { useEffect, useState, useContext } from 'react';
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";

import VisitCreation from "./pages/visit-creation/VisitCreation";
import Dashboard from "./pages/dashboard";
import Registration from "./pages/registration-form/ClientRegistration";
import Topbar from './pages/global/Topbar';
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
import { useNavigate } from "react-router-dom";
import DrugMaster from './Masters/DrugMaster/DrugMaster';
import AllergyMaster from './Masters/AllergyMaster/AllergyMaster';

export default function MainScreen() {
    const navigate = useNavigate();
    useEffect(() => {
        if (!appContextValue.isLogin) {
            navigate("/login", { replace: true });
        }

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
                    <Topbar/>
                        <main>
                        
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
                                <Route path='/drugMaster' element={<DrugMaster />} />
                                <Route path='/allergyMaster' element={<AllergyMaster />} />
                            </Routes>
                        </main>
                    </div>
                </MyProSidebarProvider>
            }

        </>
    )
}