import React from 'react';
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Loader from './components/Loader/Loader';
import AppProvider from "./components/Context/AppProvider";
import MainScreen from './MainScreen';
import ErrorBoundary from './common/ErrorBoundary/ErrorBoundary';

const App = () => {
  const [theme, colorMode] = useMode();
  try{
    return (
      // <ErrorBoundary>
      <AppProvider>
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Loader />
            <MainScreen />
          </ThemeProvider>
        </ColorModeContext.Provider>
      </AppProvider>
      // </ErrorBoundary>
    );
  }catch(r){
    console.log(r);
  }
  
};

export default App;
