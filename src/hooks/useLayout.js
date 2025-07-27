import { useMemo } from 'react';

export const useLayout = ({ isAuthenticated }) => {
  const layoutStyles = useMemo(() => ({
    container: {
      display: "flex",
      flexDirection: "row",
      height: "100vh",
      overflow: "hidden",
    },
    sidebar: {
      // Sidebar container styles
    },
    mainContent: {
      width: "100%",
      height: "100%"
    },
    topbar: {
      height: "8%"
    },
    content: {
      height: isAuthenticated ? "92%" : "100%",
      overflowY: "auto"
    }
  }), [isAuthenticated]);

  const shouldShowSidebar = isAuthenticated;
  const shouldShowTopbar = isAuthenticated;

  return {
    layoutStyles,
    shouldShowSidebar,
    shouldShowTopbar
  };
}; 