import { useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useSidebarContext } from "./sidebarContext";
import { tokens } from "../../../theme";
import { useTheme, Box, Drawer } from "@mui/material";
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

const drawerWidth = 250;

const MyProSidebar = () => {
  const appContextValue = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { sidebarRTL } = useSidebarContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [localMenuState, setLocalMenuState] = useState({});

  useEffect(() => {
    if (appContextValue.leftMenuList) {
      const initialState = {};
      appContextValue.leftMenuList.forEach((menu, index) => {
        initialState[index] = menu.isOpen || false;
      });
      setLocalMenuState(initialState);
    }
  }, [appContextValue.leftMenuList]);

  const handleClick = useCallback(
    (item, menuType, index) => {
      if (menuType) {
        appContextValue.setSelectedLeftMenuItem(item);

        // Only update isPatientSpecific when clicking outside Clinical Data group
        // i.e. when the clicked submenu has NO isPatientSpecific property at all
        if (!Object.prototype.hasOwnProperty.call(item, 'isPatientSpecific')) {
          // clicked Dashboard / Masters / Billing / Registration — hide Clinical Data
          appContextValue.setLeftMenuList((prev) =>
            prev.map((menu) =>
              Object.prototype.hasOwnProperty.call(menu, 'isPatientSpecific')
                ? { ...menu, isPatientSpecific: false }
                : menu
            )
          );
          appContextValue.setSelectedVisitDeatils([]);
        }
        // if item has isPatientSpecific property — it's inside Clinical Data, don't touch the parent

        navigate(item.to, { replace: false });
      } else {
        // parent menu header toggle
        setLocalMenuState((prev) => ({ ...prev, [index]: !prev[index] }));
        appContextValue.setLeftMenuList((prev) => {
          const copy = [...prev];
          copy[index] = { ...copy[index], isOpen: !copy[index].isOpen };
          return copy;
        });
      }
    },
    [appContextValue, navigate]
  );

  const renderMenuGroup = useCallback(
    (menu, index) => {
      if (!menu.subMenu || menu.subMenu.length === 0) return null;
      // Hide Clinical Data group when isPatientSpecific is false
      if (
        Object.prototype.hasOwnProperty.call(menu, "isPatientSpecific") &&
        !menu.isPatientSpecific
      )
        return null;

      return (
        <Box key={index}>
          <ListItemButton
            onClick={() => handleClick(menu, "", index)}
            sx={{
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              "&:last-child": { borderBottom: "none" },
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
            {menu.subMenu.map((submenu, subIndex) => {
              const isActive = location.pathname === submenu.to;
              return (
                <List key={`${index}-${subIndex}`} component="div" disablePadding>
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
    },
    [localMenuState, handleClick, location.pathname]
  );

  const menuList = useMemo(() => {
    if (!appContextValue.leftMenuList) return [];
    return appContextValue.leftMenuList.map((menu, index) =>
      renderMenuGroup(menu, index)
    );
  }, [appContextValue.leftMenuList, renderMenuGroup]);

  const logoSectionHeight = "5vh";

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
      open
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
        {/* Top Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: logoSectionHeight,
            minHeight: 48,
            maxHeight: 80,
            width: "100%",
            background: "#fff",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            zIndex: 100000,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "80%", width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </Box>

        {/* Menu */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            "&::-webkit-scrollbar": { width: "6px" },
            "&::-webkit-scrollbar-track": { background: "rgba(255,255,255,0.1)" },
            "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.3)", borderRadius: "3px" },
          }}
        >
          <List
            sx={{
              width: "100%",
              padding: 0,
              "& .MuiListItemButton-root": {
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                "&.Mui-selected": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.25)" },
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              },
              "& .MuiListItemIcon-root": { color: "white", minWidth: 40 },
              "& .MuiListItemText-primary": { fontSize: "14px", fontWeight: 500 },
            }}
            component="nav"
          >
            {menuList}
          </List>
        </Box>

        {/* Bottom Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: logoSectionHeight,
            minHeight: 48,
            maxHeight: 80,
            width: "100%",
            background: "#fff",
            borderTop: "1px solid rgba(255,255,255,0.1)",
            zIndex: 10000,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "80%", width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default MyProSidebar;
