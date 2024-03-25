import React from 'react';
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Loader from './components/Loader/Loader';
import AppProvider from "./components/Context/AppProvider";
import MainScreen from './MainScreen';

const App = () => {
  const [theme, colorMode] = useMode();
  return (
    <AppProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Loader />
          <MainScreen />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppProvider>
  );
};

export default App;
