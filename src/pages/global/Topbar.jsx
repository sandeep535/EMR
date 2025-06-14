import React from "react";
import { useContext } from "react";
import { Box, IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import { useNavigate } from "react-router-dom";
import AppContext from '../../components/Context/AppContext';
import { tokens } from "../../theme";
import ModelPopUp from "../../common/ModelPopup/ModelPopUp";
import Stack from '@mui/material/Stack';

const Transition = React.forwardRef(function Transition(
  props,
  ref,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    // setIslogin(false);

    navigate("/login/" + sessionStorage.getItem("tenant"), { replace: true });
  }

  return (
    <Box position="fixed" style={{ background: colors, width: '80%', height: '8%', borderRadius: "5px" }}>

      <ModelPopUp size={'sm'} isOpen={open} title="Signout" handleClose={() => { setOpen(false) }} >
        <Stack spacing={3} direction="column" >
          <Stack spacing={2} direction="row">
            <Box component="div" sx={{ fontSize: 18 }}>Do you want logout?</Box>
          </Stack>
          <Stack spacing={2} direction="row">
            <Button onClick={doLogout} variant="contained">Yes</Button>
            <Button onClick={handleClose} variant="outlined">No</Button>
          </Stack>
        </Stack>
      </ModelPopUp>

      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
        <p style={{ color: '#fff' }}>Login User: <b>{loggedUser}</b></p>
        <IconButton onClick={handleClickOpen}>
          <LogoutIcon sx={{ color: 'white' }} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
