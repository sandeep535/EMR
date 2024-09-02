
import Registration from "../pages/registration-form/ClientRegistration";
import VisitDasboard from "../pages/VisistDashboard/VisitDashboard";
import VisitActivity from "../pages/VisitActivites/VisitActivity";
import EmployeeMaster from "../Masters/EmpployeMaster/EmployeeMatser";
import ServiceMaster from "../Masters/ServiceMaster/ServiceMaster";
import VitalsList from "../pages/Vitals/VitalsList";
import PrescriptionsList from "../pages/Prescriptions/PrescriptionsList";
import RoleAndTasks from "../pages/RoleAndTaks/RoleAndTasks";
import DrugMaster from '../Masters/DrugMaster/DrugMaster';
import AllergyMaster from '../Masters/AllergyMaster/AllergyMaster';
import VistStatistics from '../pages/DashBoards/VistStatistics';
import Allergies from '../pages/Allergies/Allergies';
import DiagnosisMaster from '../Masters/DiagnosisMaster/DiagnosisMaster';
import LabMaster from '../Masters/LabMaster/LabMaster';
import LabOrder from '../pages/LabOrders/LabOrder';
import VisitSummary from '../pages/VisitSummary/VisitSummary';
import VisitCreation from "../pages/visit-creation/VisitCreation";
import FavoriteMatser from "../Masters/Favorite/FavoriteMatser";


const ApplicationRoutes = [
    { path: "/vist-dashboard", element: <VisitDasboard /> },
    { path: "/nurse-dashboard", element: <VisitDasboard isFrom='nursedashboard' /> },
    { path: "/registration", element: <Registration /> },
    { path: "/visit-creation", element: <VisitCreation /> },
    { path: "/visit-activity", element: <VisitActivity /> },
    { path: "/employeeMaster", element: <EmployeeMaster /> },
    { path: "/serviceMaster", element: <ServiceMaster /> },
    { path: "/vitalsList", element: <VitalsList /> },
    { path: "/prescriptionsList", element: <PrescriptionsList /> },
    { path: "/rolesAnsTasks", element: <RoleAndTasks /> },
    { path: "/drugMaster", element: <DrugMaster /> },
    { path: "/allergyMaster", element: <AllergyMaster /> },
    { path: "/vist-statistics", element: <VistStatistics /> },
    { path: "/allergy", element: <Allergies isSaveDirect={true} /> },
    { path: "/diagnosismaster", element: <DiagnosisMaster /> },
    { path: "/labMaster", element: <LabMaster /> },
    { path: "/LabOrder", element: <LabOrder /> },
    { path: "/visitSummary", element: <VisitSummary /> },
    { path: "/favorites", element: <FavoriteMatser /> },
  ];
  
  export default ApplicationRoutes;


                               
                               
                               
                                
                              
                               
                            
                              