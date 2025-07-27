import React from "react";
import { useContext } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import AppContext from '../../components/Context/AppContext';
import { tokens } from "../../theme";
import ModelPopUp from "../../common/ModelPopup/ModelPopUp";

const Topbar = () => {
  const loggedUser = sessionStorage.logged_user;
  const colors = tokens().themecolor.color;
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const appContextValue = useContext(AppContext);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const doLogout = () => {
    setOpen(false);
    appContextValue.setIslogin(false);
    sessionStorage.setItem("token","");
    sessionStorage.setItem("LoggedInUserDetails","");
    sessionStorage.setItem("leftMenu","");
    navigate("/login/" + sessionStorage.getItem("tenant"), { replace: true });
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: '250px',
        right: 0,
        zIndex: 1201,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 2,
        background: colors,
        minHeight: 50,
        width: 'calc(100% - 250px)',
        flexWrap: 'wrap',
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
        Login User: <span style={{ fontWeight: 700 }}>{loggedUser}</span>
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton sx={{ color: '#fff' }}>
          <AccountCircle />
        </IconButton>
        <IconButton sx={{ color: '#fff' }} onClick={handleClickOpen}>
          <LogoutIcon />
        </IconButton>
      </Box>
      <ModelPopUp open={open} handleClose={handleClose} handleConfirm={doLogout} />
    </Box>
  );
};

export default Topbar;
