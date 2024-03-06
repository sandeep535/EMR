import React, { useEffect, useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import AppContext from '../../components/Context/AppContext';
import { useSidebarContext } from "../global/sidebar/sidebarContext";
import ErrorMessage from '../../components/ErrorMessage/Errormsg';
import LeftMenu from '../../common/LeftMenu';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Easy EMR
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function LoginPage(props) {
  const appContextValue = useContext(AppContext);
  const [showError, setShowError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    var obj = {
      username: data.get('username'),
      password: data.get('password'),
    }
    callLogin(obj);
  };
  async function fetchRolesTransData(roleid) {
    let roleidcopy = (roleid) ? roleid : '';
    var payLoad = {
      method: APIS.GET_ROLES_TASKS_TRANS_ROLEID.METHOD,
      url: APIS.GET_ROLES_TASKS_TRANS_ROLEID.URL,
      paramas: [roleidcopy]
    }
    let result = await sendRequest(payLoad);
    if (result && result.size != 0) {
      appContextValue.setLoggedInRolesTaks(result);
      debugger
      var obj = {}
      for(var i=0;i<result.length;i++){
        obj[result[i].actioncode] = result[i].ispermission;
      }
     
      setRolesTasksToLeftMenu(obj)
      //appContextValue.setLeftMenuList(LeftMenu);
    }
  }
  function setRolesTasksToLeftMenu(permissions){
    console.log(LeftMenu);
    let copyLeftMenu = [...LeftMenu];
    for(var i=0;i<copyLeftMenu.length;i++){
      var submentList = [];
      for(var j=0;j<copyLeftMenu[i].subMenu.length;j++){
        if(copyLeftMenu[i].subMenu[j].hasOwnProperty("screencode") && permissions[copyLeftMenu[i].subMenu[j].screencode] == 1){
          submentList.push(copyLeftMenu[i].subMenu[j]);
        }
      }
      copyLeftMenu[i].subMenu = submentList;
    }
    appContextValue.setLeftMenuList(copyLeftMenu);

  }
  async function callLogin(obj) {
    var payLoad = {
      method: APIS.LOGIN.METHOD,
      url: APIS.LOGIN.URL,
      paramas: [],
      data: obj
    }
    let result = await sendRequest(payLoad);
    debugger
    if (result && result.token != "false") {
      //  props.onSusccuss(true);
      setShowError(false);
      appContextValue.setIslogin(true);
      sessionStorage.setItem("token", result.token);
      appContextValue.setLoggedInUserDetails(result);
      fetchRolesTransData(result.role.id);
      console.log(result)
    }
    else {
      setShowError(true);
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="User Name"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              {showError ? <ErrorMessage type="error" message="Invalid User Name and Password !"></ErrorMessage> : null}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                {/* <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid> */}
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}