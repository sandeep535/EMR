import React, { useEffect, useState, useContext } from 'react';
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";

import VisitCreation from "./pages/visit-creation/VisitCreation";
import Registration from "./pages/registration-form/ClientRegistration";
import Topbar from './pages/global/Topbar';
import VisitDasboard from "./pages/VisistDashboard/VisitDashboard";
import VisitActivity from "./pages/VisitActivites/VisitActivity";
import EmployeeMaster from "./pages/EmpployeMaster/EmployeeMatser";
import ServiceMaster from "./pages/ServiceMaster/ServiceMaster";
import VitalsList from "./pages/Vitals/VitalsList";
import PrescriptionsList from "./pages/Prescriptions/PrescriptionsList";
import RoleAndTasks from "./pages/RoleAndTaks/RoleAndTasks";
import LoginPage from "./pages/Login/LoginPage";
import AppContext from './components/Context/AppContext';

import DrugMaster from './Masters/DrugMaster/DrugMaster';
import AllergyMaster from './Masters/AllergyMaster/AllergyMaster';
import VistStatistics from './pages/DashBoards/VistStatistics';
import Allergies from './pages/Allergies/Allergies';
import DiagnosisMaster from './Masters/DiagnosisMaster/DiagnosisMaster';
import { useTheme, Box, Typography } from "@mui/material";
// import LeftMenu from './common/LeftMenu';

export default function MainScreen(props) {
    const navigate = useNavigate();
    const params = useParams()
    console.log("ssss----------", params)
    useEffect(() => {

        debugger
        // if (!appContextValue.isLogin) {
        //     navigate("/login/emr", { replace: true });
        // }

    }, []);
    const appContextValue = useContext(AppContext);
    return (
        <>
            {!appContextValue.isLogin &&
                (<Routes>
                    <Route path='/login/:tenant' element={<LoginPage />} />
                </Routes>)}
            {appContextValue && appContextValue.isLogin &&
                <Box style={{ display: "flex", flexDirection: "row",  }}>
                    <Box>
                        <MyProSidebarProvider/>
                    </Box>
                    <Box style={{width:'100%'}}>
                         <Topbar/>
                        <main >
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
                                <Route path='/vist-statistics' element={<VistStatistics />} />
                                <Route path='/allergy' element={<Allergies isSaveDirect={true} />} />
                                <Route path='/diagnosismaster' element={<DiagnosisMaster />} />

                            </Routes>
                        </main>

                    </Box>
                </Box>
            }

        </>
    )
}