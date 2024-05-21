import React from "react";
import { useContext } from "react";
import {  Box, IconButton } from "@mui/material";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import { useProSidebar } from "react-pro-sidebar";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useNavigate } from "react-router-dom";
import AppContext from '../../components/Context/AppContext';

const Transition = React.forwardRef(function Transition(
  props,
  ref,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Topbar = () => {
  const loggedUser = sessionStorage.logged_user;
  const { toggleSidebar, broken, rtl } = useProSidebar();

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

    navigate("/login/"+sessionStorage.getItem("tenant"), { replace: true });
  }

  return (
    <Box className="top-header" position="fixed" style={{width:'100%'}}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        // onClose={handleClose}
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
      <Box display="flex">
        
      </Box>
      <Box display="flex">
        <p style={{marginLeft:'68%',marginRight:"1%",color:'#fff'}}>Login User : <b>{loggedUser}</b></p>
        <IconButton onClick={() => {
          handleClickOpen()
        }}>
          <LogoutIcon  sx={{color:'white'}}/>
        </IconButton>
        {broken && rtl && (
          <IconButton
            sx={{ margin: "0 6 0 2" ,color:'white'}}
            onClick={() => toggleSidebar()}
          >
            <MenuOutlinedIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default Topbar;
