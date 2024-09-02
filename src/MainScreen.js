import React, { useEffect, useContext } from 'react';
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import Box from '@mui/material/Box';
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import Topbar from './pages/global/Topbar';
import LoginPage from "./pages/Login/LoginPage";
import AppContext from './components/Context/AppContext';
import ApplicationRoutes from './common/Routes';


export default function MainScreen(props) {
    const navigate = useNavigate();
    const params = useParams()
    useEffect(() => {
        if (!appContextValue.isLogin) {
            navigate("/login/emr2", { replace: true });
        }
    }, []);
    const appContextValue = useContext(AppContext);
    return (
        <>
            {!appContextValue.isLogin &&
                (<Routes>
                    <Route path='/login/:tenant' element={<LoginPage />} />
                </Routes>)}
            {appContextValue && appContextValue.isLogin &&
                <Box style={{ display: "flex", flexDirection: "row", }}>
                    <Box>
                        <MyProSidebarProvider />
                    </Box>
                    <Box style={{ width: '100%' }}>
                        <Box sx={{ height: '8%' }}>
                            <Topbar />
                        </Box>
                        <Box sx={{ height: '92%', overflowY: 'scroll' }}>
                            <Routes>
                                {ApplicationRoutes.map((route, index) => (
                                    <Route key={index} path={route.path} element={route.element} />
                                ))}
                            </Routes>
                        </Box>
                    </Box>
                </Box>
            }

        </>
    )
}