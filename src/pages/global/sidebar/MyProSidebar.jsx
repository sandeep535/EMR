import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useSidebarContext } from "./sidebarContext";
import { tokens } from "../../../theme";
import { useTheme, Box, Typography, Drawer } from "@mui/material";
import AppContext from "../../../components/Context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Icon from "@mui/material/Icon";
import logo from "../../../resources/LeafSpring_Logo1.jpeg";

const MyProSidebar = () => {
  const appContextValue = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { sidebarRTL, setSidebarRTL, sidebarImage } = useSidebarContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [localMenuState, setLocalMenuState] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(true);

  // Initialize local menu state from context
  useEffect(() => {
    if (appContextValue.leftMenuList) {
      const initialState = {};
      appContextValue.leftMenuList.forEach((menu, index) => {
        initialState[index] = menu.isOpen || false;
      });
      setLocalMenuState(initialState);
    }
  }, [appContextValue.leftMenuList]);

  const removePatientSpecific = useCallback((copyData) => {
    return copyData.map((item) => {
      if (Object.prototype.hasOwnProperty.call(item, "isPatientSpecific")) {
        item.isPatientSpecific = false;
      }
      return item;
    });
  }, []);

  // Memoize the context setters to prevent unnecessary re-renders
  const contextSetters = useMemo(
    () => ({
      setSelectedLeftMenuItem: appContextValue.setSelectedLeftMenuItem,
      setLeftMenuList: appContextValue.setLeftMenuList,
      setSelectedVisitDeatils: appContextValue.setSelectedVisitDeatils,
    }),
    [
      appContextValue.setSelectedLeftMenuItem,
      appContextValue.setLeftMenuList,
      appContextValue.setSelectedVisitDeatils,
    ]
  );

  const handleClick = useCallback(
    (item, menuType, index) => {
      console.log(
        "Clicked item:",
        item,
        "MenuType:",
        menuType,
        "Index:",
        index
      );
      if (menuType) {
        // Handle submenu item click - don't update context to prevent re-render
        contextSetters.setSelectedLeftMenuItem(item);

        // Only update context if it's a refresh menu and not patient-specific
        if (item.isRefreshMenu && !item.isPatientSpecific) {
          var copyData = [...appContextValue.leftMenuList];
          copyData = removePatientSpecific(copyData);
          contextSetters.setLeftMenuList(copyData);
          contextSetters.setSelectedVisitDeatils([]);
        }

        // Navigate without closing the drawer
        navigate(item.to, { replace: false });
      } else {
        // Handle main menu toggle
        setLocalMenuState((prev) => ({
          ...prev,
          [index]: !prev[index],
        }));

        let copyData = [...appContextValue.leftMenuList];
        copyData[index].isOpen = !copyData[index].isOpen;
        if (item.isRefreshMenu && !item.isPatientSpecific) {
          copyData = removePatientSpecific(copyData);
          contextSetters.setSelectedVisitDeatils([]);
        }
        contextSetters.setLeftMenuList(copyData);
      }
    },
    [contextSetters, navigate, removePatientSpecific]
  );

  const drawerWidth = 250;

  // Memoize the menu list to prevent unnecessary re-renders
  const menuList = useMemo(() => {
    if (!appContextValue.leftMenuList) return [];

    return appContextValue.leftMenuList.map((menu, index) => {
      if (
        Object.prototype.hasOwnProperty.call(menu, "isPatientSpecific") ===
          false &&
        menu.subMenu.length !== 0
      ) {
        return (
          <Box key={index}>
            <ListItemButton
              onClick={() => handleClick(menu, "", index)}
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ListItemIcon>
                  <Icon>{menu.icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={menu.title} />
              </Box>
              {localMenuState[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={localMenuState[index]} timeout="auto" unmountOnExit>
              {menu.subMenu &&
                menu.subMenu.map((submenu, subIndex) => {
                  const isActive =
                    appContextValue.selectedLeftMenuItem &&
                    appContextValue.selectedLeftMenuItem.title ===
                      submenu.title;
                  return (
                    <List
                      key={`${index}-${subIndex}`}
                      component="div"
                      disablePadding
                    >
                      <ListItemButton
                        sx={{
                          pl: 4,
                          backgroundColor: isActive
                            ? "rgba(255,255,255,0.15)"
                            : "transparent",
                          "&:hover": {
                            backgroundColor: isActive
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(255,255,255,0.1)",
                          },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        selected={isActive}
                        onClick={() => handleClick(submenu, "submenu", index)}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ListItemIcon>
                            <Icon>{submenu.icon}</Icon>
                          </ListItemIcon>
                          <ListItemText primary={submenu.title} />
                        </Box>
                      </ListItemButton>
                    </List>
                  );
                })}
            </Collapse>
          </Box>
        );
      }
      if (
        Object.prototype.hasOwnProperty.call(menu, "isPatientSpecific") ===
          true &&
        menu.isPatientSpecific === true &&
        menu.subMenu.length !== 0
      ) {
        return (
          <Box key={index}>
            <ListItemButton
              onClick={() => handleClick(menu, "", index)}
              sx={{
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                "&:last-child": {
                  borderBottom: "none",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ListItemIcon>
                  <Icon>{menu.icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={menu.title} />
              </Box>
              {localMenuState[index] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={localMenuState[index]} timeout="auto" unmountOnExit>
              {menu.subMenu &&
                menu.subMenu.map((submenu, subIndex) => {
                  const isActive =
                    appContextValue.selectedLeftMenuItem &&
                    appContextValue.selectedLeftMenuItem.title ===
                      submenu.title;
                  return (
                    <List
                      key={`${index}-${subIndex}`}
                      component="div"
                      disablePadding
                    >
                      <ListItemButton
                        sx={{
                          pl: 4,
                          backgroundColor: isActive
                            ? "rgba(255,255,255,0.15)"
                            : "transparent",
                          "&:hover": {
                            backgroundColor: isActive
                              ? "rgba(255,255,255,0.2)"
                              : "rgba(255,255,255,0.1)",
                          },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        selected={isActive}
                        onClick={() => handleClick(submenu, "submenu", index)}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <ListItemIcon>
                            <Icon>{submenu.icon}</Icon>
                          </ListItemIcon>
                          <ListItemText primary={submenu.title} />
                        </Box>
                      </ListItemButton>
                    </List>
                  );
                })}
            </Collapse>
          </Box>
        );
      }
      //return null;
    });
  }, [localMenuState, handleClick]);

  const logoSectionHeight = "5vh"; // or '64px' if you want a fixed height

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: colors.themecolor.color,
          border: "none",
          position: "relative",
          height: "100%",
          overflow: "hidden",
        },
      }}
      open={drawerOpen}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          color: "white",
          overflow: "hidden",
        }}
      >
        {/* Top Logo Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: logoSectionHeight,
            minHeight: 48, // match topbar minHeight
            maxHeight: 80, // match topbar maxHeight
            width: "100%",
            background: "#fff",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            zIndex: 100000,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: "80%",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>

        {/* Menu Section */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(255,255,255,0.1)",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255,255,255,0.3)",
              borderRadius: "3px",
            },
          }}
        >
          <List
            sx={{
              width: "100%",
              padding: 0,
              "& .MuiListItemButton-root": {
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.25)",
                  },
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
              "& .MuiListItemIcon-root": {
                color: "white",
                minWidth: 40,
              },
              "& .MuiListItemText-primary": {
                fontSize: "14px",
                fontWeight: 500,
              },
            }}
            component="nav"
          >
            {menuList}
          </List>
        </Box>

        {/* Bottom Logo Section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: logoSectionHeight,
            minHeight: 48, // match topbar minHeight
            maxHeight: 80, // match topbar maxHeight
            width: "100%",
            background: "#fff",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            zIndex: 10000,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: "80%",
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default MyProSidebar;
