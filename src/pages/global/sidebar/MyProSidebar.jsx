import { useState, useContext } from "react";
import { Menu, Sidebar } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";
import { useSidebarContext } from "./sidebarContext";
import { Link } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme, Box, Typography, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SwitchRightOutlinedIcon from "@mui/icons-material/SwitchRightOutlined";
import SwitchLeftOutlinedIcon from "@mui/icons-material/SwitchLeftOutlined";
import AppContext from '../../../components/Context/AppContext';
import LeftMenu from '../../../common/LeftMenu';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Icon from '@mui/material/Icon';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
      routerLink={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const MyProSidebar = () => {
  const appContextValue = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { sidebarRTL, setSidebarRTL, sidebarImage } = useSidebarContext();
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();

  const removePatientSpecific = (copyData)=>{
    copyData.map(item => {
      if (item.hasOwnProperty("isPatientSpecific")) {
        item.isPatientSpecific = false;
      }
    });
    return copyData;
  }
  const handleClick = (item, menuType,index) => {
    if (menuType) {
      var copyData = [...appContextValue.leftMenuList];
      if (item.isRefreshMenu) {
        copyData = removePatientSpecific(copyData);
        appContextValue.setLeftMenuList(copyData);
        appContextValue.setSelectedVisitDeatils([]);
      }
      navigate(item.to);
    } else {
      var copyData = [...appContextValue.leftMenuList];
      copyData[index].isOpen = !copyData[index].isOpen;
      if (item.isRefreshMenu) {
        copyData = removePatientSpecific(copyData);
        appContextValue.setSelectedVisitDeatils([]);
      }
      appContextValue.setLeftMenuList(copyData);
    }

  };

  const navigate = useNavigate();
  return (
    <Box
      sx={{
        position: "sticky",
        display: "flex",
        height: "100vh",
        top: 0,
        bottom: 0,
        zIndex: 10000,
        "& .sidebar": {
          border: "none",
        },
        "& .menu-icon": {
          backgroundColor: "transparent !important",
        },
        "& .menu-item": {
          // padding: "5px 35px 5px 20px !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-anchor": {
          color: "inherit !important",
          backgroundColor: "transparent !important",
        },
        "& .menu-item:hover": {
          color: `${colors.blueAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
        "& .menu-item.active": {
          color: `${colors.greenAccent[500]} !important`,
          backgroundColor: "transparent !important",
        },
      }}
    >
      <Sidebar
        breakPoint="md"
        rtl={sidebarRTL}
        backgroundColor={colors.primary[400]}
        image={sidebarImage}
      >
        <Menu iconshape="square">
          {/* {!collapsed && (
            <Box mb="25px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  "& .avater-image": {
                    backgroundColor: colors.primary[500],
                  },
                }}
              >
                <img
                  className="avater-image"
                  alt="profile user"
                  width="100px"
                  height="100px"
                  src={"../../assets/user.png"}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {appContextValue && appContextValue.loggedInUserDetails && appContextValue.loggedInUserDetails.firstname}
                </Typography>
              </Box>
            </Box>
          )} */}
          <Box>
            <List
              sx={{ width: '100%', maxWidth: 360 }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              {appContextValue && appContextValue.leftMenuList && appContextValue.leftMenuList.map((menu, index) => {
                if (menu.hasOwnProperty("isPatientSpecific") == false && menu.subMenu.length!=0) {
                  return (
                    <>
                      <ListItemButton onClick={() => handleClick(menu,"",index)}>
                        <ListItemIcon>
                         <Icon>{menu.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText primary={menu.title} />
                        {menu.isOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={menu.isOpen} timeout="auto" unmountOnExit>
                        {menu.subMenu && menu.subMenu.map(submenu => {
                          return (
                            <List component="div" disablePadding>
                              <ListItemButton sx={{ pl: 4 }} onClick={() => handleClick(submenu, "submenu",index)}>
                                <ListItemIcon>
                                  <Icon>{submenu.icon}</Icon>
                                </ListItemIcon>
                                <ListItemText primary={submenu.title} />
                              </ListItemButton>
                            </List>
                          )
                        })}
                      </Collapse>
                    </>
                  )
                }
                if (menu.hasOwnProperty("isPatientSpecific") == true && menu.isPatientSpecific == true && menu.subMenu.length!=0) {
                  return (
                    <>
                      <ListItemButton onClick={() => handleClick(menu,"",index)}>
                        <ListItemIcon>
                          <Icon>{menu.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText primary={menu.title} />
                        {menu.isOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={menu.isOpen} timeout="auto" unmountOnExit>
                        {menu.subMenu && menu.subMenu.map(submenu => {
                          return (
                            <List component="div" disablePadding>
                              <ListItemButton sx={{ pl: 4 }} onClick={() => handleClick(submenu, "submenu",index)}>
                                <ListItemIcon>
                                  <Icon>{submenu.icon}</Icon>
                                </ListItemIcon>
                                <ListItemText primary={submenu.title} />
                              </ListItemButton>
                            </List>
                          )
                        })}
                      </Collapse>
                    </>
                  )
                }

              })}
            </List>

          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default MyProSidebar;
