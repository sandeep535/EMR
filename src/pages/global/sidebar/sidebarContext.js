import React, { useState, createContext, useContext } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import MyProSidebar from "./MyProSidebar";
import AppContext from '../../../components/Context/AppContext';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../../resources/LeafSpring_Logo1.jpeg';
import { useTheme, Box, Typography } from "@mui/material";

const SidebarContext = createContext({});

export const MyProSidebarProvider = ({ children }) => {
  const [sidebarRTL, setSidebarRTL] = useState(false);
  const [sidebarBackgroundColor, setSidebarBackgroundColor] =
    useState(undefined);
  const [sidebarImage, setSidebarImage] = useState(undefined);
  const appContextValue = useContext(AppContext);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("-----------------------------------side bar", appContextValue)
    if (appContextValue.loggedInRolesTaks && Object.keys(appContextValue.loggedInRolesTaks).length != 0) {
      let copyRoles = [...appContextValue.loggedInRolesTaks];
      let defaultScreenData = "";
      copyRoles.forEach(role => {
        if (role.defaultoptionvalue) {
          defaultScreenData = role;
        }
      });
      if (defaultScreenData) {
        var leftmenuScreen = ""
        let copyleftMenuList = [...appContextValue.leftMenuList];
        copyleftMenuList.forEach(mainMenu => {
          mainMenu.subMenu.forEach(submenu => {
            if (submenu.screencode == defaultScreenData.actioncode) {
              leftmenuScreen = submenu;
            }
          })
        });
        if (leftmenuScreen) {
          navigate(leftmenuScreen.to, { replace: true });
        } else {
          navigate('/registration', { replace: true });
        }

      }

    }
  }, [appContextValue.loggedInRolesTaks]);
  return (
    <ProSidebarProvider>
      {appContextValue.isLogin &&
        <SidebarContext.Provider
          value={{
            sidebarBackgroundColor,
            setSidebarBackgroundColor,

            sidebarImage,
            setSidebarImage,

            sidebarRTL,
            setSidebarRTL,


          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: sidebarRTL ? "row-reverse" : "row",
            }}
          >
            <div style={{
              display: "flex",
              flexDirection: sidebarRTL ? "row-reverse" : "column",
            }}>

              <Box style={{ zIndex: 100000 }} >
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                  <Box sx={{ width: '100%', height: '100%' }}>
                    <img
                      src={logo}
                      height={50}
                      width={'100%'}
                      alt={"Logo"}
                      loading="lazy"
                    />
                  </Box>
                </Box>
              </Box>
              <Box style={{overflowY:'scroll'}}>
                <MyProSidebar/>
              </Box>

              <Box style={{ zIndex: 10000 }} >
                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                  <Box sx={{ width: '100%', height: '100%' }}>
                    <img
                      src={logo}
                      height={50}
                      width={'100%'}
                      alt={"Logo"}
                      loading="lazy"
                    />
                  </Box>
                </Box>
              </Box>
            </div>

            {children}
          </div>
        </SidebarContext.Provider>}
    </ProSidebarProvider>
  );
};

export const useSidebarContext = () => useContext(SidebarContext);
