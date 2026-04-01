import React, { useState, createContext, useContext, useMemo } from "react";
import MyProSidebar from "./MyProSidebar";
import AppContext from '../../../components/Context/AppContext';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

const SidebarContext = createContext({});

export const MyProSidebarProvider = ({ children }) => {
  const [sidebarRTL, setSidebarRTL] = useState(false);
  const [sidebarBackgroundColor, setSidebarBackgroundColor] =
    useState(undefined);
  const [sidebarImage, setSidebarImage] = useState(undefined);
  const appContextValue = useContext(AppContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!appContextValue.isLogin) return;
    if (!appContextValue.loggedInRolesTaks || Object.keys(appContextValue.loggedInRolesTaks).length === 0) return;

    let copyRoles = [...appContextValue.loggedInRolesTaks];
    let defaultScreenData = copyRoles.find(role => role.defaultoptionvalue);

    if (defaultScreenData) {
      let leftmenuScreen = null;
      appContextValue.leftMenuList.forEach(mainMenu => {
        mainMenu.subMenu.forEach(submenu => {
          if (submenu.screencode === defaultScreenData.actioncode) {
            leftmenuScreen = submenu;
          }
        });
      });
      appContextValue.setSelectedLeftMenuItem(leftmenuScreen || null);
      navigate(leftmenuScreen ? leftmenuScreen.to : '/registration', { replace: true });
    }
  }, [appContextValue.loggedInRolesTaks, appContextValue.isLogin]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    sidebarBackgroundColor,
    setSidebarBackgroundColor,
    sidebarImage,
    setSidebarImage,
    sidebarRTL,
    setSidebarRTL,
  }), [sidebarBackgroundColor, sidebarImage, sidebarRTL]);

  return (
    <>
      {appContextValue.isLogin && (
        <SidebarContext.Provider value={contextValue}>
          <Box
            sx={{
              display: "flex",
              flexDirection: sidebarRTL ? "row-reverse" : "row",
              height: "100%",
            }}
          >
            <MyProSidebar />
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              {children}
            </Box>
          </Box>
        </SidebarContext.Provider>
      )}
      {!appContextValue.isLogin && children}
    </>
  );
};

export const useSidebarContext = () => useContext(SidebarContext);
