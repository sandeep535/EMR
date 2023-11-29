import {Box,useTheme,useMediaQuery,Typography} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const Dashboard = () => {
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const colors = tokens(theme.palette.mode);
  function HandleMenuClick(e) {
    console.log(e.target.innerText);
  }
  const DashboardMenuItems =[
    {
      name:'Frontdesk',
      value:'FrontDesk',
      id:1
    },
    {
      name:'nurse',
      value:'Nurse Room',
      id:2
    },
    {
      name:'doctor',
      value:'Doctor Room',
      id:3
    },
    {
      name:'Pharma',
      value:'Pharmacy',
      id:4
    },
    {
      name:'radiology',
      value:'Radiology',
      id:5
    },
  ]
  return (
    <Box m="20px">
      {/* <Box
        display={smScreen ? "flex" : "block"}
        flexDirection={smScreen ? "row" : "column"}
        justifyContent={smScreen ? "space-between" : "start"}
        alignItems={smScreen ? "center" : "start"}
        m="10px 0"
      >
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box> */}

      {/* <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
      {DashboardMenuItems.map((menus) => 
        <Grid xs={12} sm={12} md={6} lg={3} xl={3} key={menus.id}>
          <Box
            width="100%"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{padding:'5%',borderRadius:7}}
            onClick={HandleMenuClick}
          >
          <Typography   value={menus.value} variant="h5" color={colors.greenAccent[400]} style={{padding:'5%'}}>
            {menus.value}
          </Typography>
            
          </Box>
        </Grid>
          )}
      </Grid> */}
    </Box>
  );
};

export default Dashboard;
