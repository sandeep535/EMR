import { useContext } from "react";
import { Menu, Sidebar } from "react-pro-sidebar";
import { useSidebarContext } from "./sidebarContext";
import { Link } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme, Box, Typography } from "@mui/material";
import AppContext from '../../../components/Context/AppContext';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from "react-router-dom";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Icon from '@mui/material/Icon';
import logo from '../../../resources/LeafSpring_Logo1.jpeg';

// const Item = ({ title, to, icon, selected, setSelected }) => {
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);
//   return (
//     <MenuItem
//       active={selected === title}
//       style={{ color: colors.grey[100] }}
//       onClick={() => setSelected(title)}
//       icon={icon}
//       routerLink={<Link to={to} />}
//     >
//       <Typography>{title}</Typography>
//     </MenuItem>
//   );
// };

const MyProSidebar = () => {
  const appContextValue = useContext(AppContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { sidebarRTL, setSidebarRTL, sidebarImage } = useSidebarContext();

  const removePatientSpecific = (copyData) => {
    copyData.map(item => {
      if (item.hasOwnProperty("isPatientSpecific")) {
        item.isPatientSpecific = false;
      }
    });
    return copyData;
  }
  const handleClick = (item, menuType, index) => {
    if (menuType) {
      var copyData = [...appContextValue.leftMenuList];
      if (item.isRefreshMenu) {
        copyData = removePatientSpecific(copyData);
        appContextValue.setLeftMenuList(copyData);
        appContextValue.setSelectedVisitDeatils([]);
      }
      appContextValue.setSelectedLeftMenuItem(item);
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
        top: 0,
        bottom: 0,
        zIndex: 10000,
        height:'100%',
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
        backgroundColor={colors.themecolor.color}
        borderRaduis={'3px'}
        image={sidebarImage}
      >
        <Menu iconshape="square">
          <Box sx={{ color: 'white' }}>
            <List
              sx={{ width: '100%', maxWidth: 360 ,height:'83vh',paddingBottom:0}}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              {appContextValue && appContextValue.leftMenuList && appContextValue.leftMenuList.map((menu, index) => {
                if (menu.hasOwnProperty("isPatientSpecific") === false && menu.subMenu.length !== 0) {
                  return (
                    <Box key={index}>
                      <ListItemButton onClick={() => handleClick(menu, "", index)}>
                        <ListItemIcon>
                          <Icon style={{ color: 'white' }}>{menu.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText primary={menu.title} />
                        {menu.isOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={menu.isOpen} timeout="auto" unmountOnExit>
                        {menu.subMenu && menu.subMenu.map(submenu => {
                          return (
                            <List component="div" disablePadding className = { appContextValue && appContextValue.selectedLeftMenuItem.title == submenu.title && 'is-active' }>
                              {appContextValue.title}
                              <ListItemButton sx={{ pl: 4 }} onClick={() => handleClick(submenu, "submenu", index)}>
                                <ListItemIcon>
                                  <Icon style={{ color: 'white' }}>{submenu.icon}</Icon>
                                </ListItemIcon>
                                <ListItemText primary={submenu.title} />
                              </ListItemButton>
                            </List>
                          )
                        })}
                      </Collapse>
                    </Box>
                  )
                }
                if (menu.hasOwnProperty("isPatientSpecific") === true && menu.isPatientSpecific === true && menu.subMenu.length !== 0) {
                  return (
                    <>
                      <ListItemButton onClick={() => handleClick(menu, "", index)}>
                        <ListItemIcon>
                          <Icon style={{ color: 'white' }}>{menu.icon}</Icon>
                        </ListItemIcon>
                        <ListItemText primary={menu.title} />
                        {menu.isOpen ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={menu.isOpen} timeout="auto" unmountOnExit>
                        {menu.subMenu && menu.subMenu.map((submenu, index) => {
                          return (
                            <List component="div" key={index} disablePadding className = { appContextValue && appContextValue.selectedLeftMenuItem.title == submenu.title && 'is-active' }>
                              <ListItemButton sx={{ pl: 4 }} onClick={() => handleClick(submenu, "submenu", index)}>
                                <ListItemIcon>
                                  <Icon style={{ color: 'white' }}>{submenu.icon}</Icon>
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
