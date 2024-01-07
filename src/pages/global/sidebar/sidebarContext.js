import React, { useState, createContext, useContext } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import MyProSidebar from "./MyProSidebar";
import LoginPage from "../../Login/LoginPage";
import AppContext from '../../../components/Context/AppContext';

const SidebarContext = createContext({});

export const MyProSidebarProvider = ({ children }) => {
  const [sidebarRTL, setSidebarRTL] = useState(false);
  const [sidebarBackgroundColor, setSidebarBackgroundColor] =
    useState(undefined);
  const [sidebarImage, setSidebarImage] = useState(undefined);
  const appContextValue = useContext(AppContext);
  //const [isLogin ,setIslogin] = useState(false)
  return (
    <ProSidebarProvider>
      {!appContextValue.isLogin && <LoginPage />}
      {appContextValue.isLogin  && 
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
          <MyProSidebar />
          {children}
        </div>
      </SidebarContext.Provider>}
    </ProSidebarProvider>
  );
};

export const useSidebarContext = () => useContext(SidebarContext);
