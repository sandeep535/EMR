import React from "react";
import { useContext } from "react";
import { Box, IconButton } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useNavigate } from "react-router-dom";
import AppContext from '../../components/Context/AppContext';
import { tokens } from "../../theme";

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
    // setIslogin(false);

    navigate("/login/" + sessionStorage.getItem("tenant"), { replace: true });
  }

  return (
    <Box position="fixed" style={{ background: colors, width: '100%', height: '8%',borderRadius:"5px" }}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Logout"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Do you want logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={doLogout}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>

      <Box display="flex" >
        <p style={{ marginLeft: '68%', marginRight: "1%", color: '#fff' }}>Login User : <b>{loggedUser}</b></p>
        <IconButton onClick={() => {
          handleClickOpen()
        }}>
          <LogoutIcon sx={{ color: 'white' }} />
        </IconButton>

      </Box>
    </Box>
  );
};

export default Topbar;
