
import React, { useEffect, useContext } from 'react';
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
import UploadDocuments from "../pages/UploadDocuments/UploadDocuments";
import BedMaster from "../Masters/BedMaster/BedMaster";
import LabOrdersList from "../pages/LabOrders/LabOrdersList";
import DynamicFormBuilder from "./DynamicFormBuilder/DynamicFormBuilder";
import ReactCodeFormBuilder from "./ReactCodeGenerater/ReactCodeFormBuilder";
import SampleForm from "../Masters/ServiceMaster/SampleForm";
import BillsTabs from "../pages/Bills/BillsTabs";
import NotesList from "../pages/Notes/NotesList";
import LoginPage from '../pages/Login/LoginPage';
import BillsModuleScreen from '../pages/Bills/BillsModuleScreen';
import InstitutionMaster from '../pages/InstitutionMaster/InstitutionMaster';
import Admission from '../pages/Admission/Admission';

import AssignBed from '../pages/BedAssignment/AssignBed';

const ApplicationRoutes = [
    { path: "/login/:tenant", element: <LoginPage /> },
    { path: "/vist-dashboard", element: <VisitDasboard patienttype='INPATIENT'/> },
    { path: "/admission-dashboard", element: <VisitDasboard patienttype='OUTPATIENT' /> },
    { path: "/nurse-dashboard", element: <VisitDasboard isFrom='nursedashboard' /> },
    { path: "/registration", element: <Registration /> },
    { path: "/visit-creation", element: <VisitCreation patienttype='INPATIENT' /> },
    { path: "/admission", element: <VisitCreation patienttype='OUTPATIENT' /> },
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
    { path: "/uploadDocuments", element: <UploadDocuments /> },
    { path: "/bedMaster", element: <InstitutionMaster/> },
    { path: "/assign-bed", element: <AssignBed /> },
    { path: "/labordersList", element: <LabOrdersList /> },
    { path: "/bills", element: <BillsTabs /> },
    { path: "/notes", element: <NotesList /> },
    { path: "/dynamicFormBuilder", element: <DynamicFormBuilder /> },
    { path: "/billsScreen", element: <BillsModuleScreen /> },
    
    { path: "/reactCodeBuilder", element: <ReactCodeFormBuilder /> },
  
    
    { path: "/sampleForm", element: <SampleForm /> },
  ];
  
  export default ApplicationRoutes;


                               
                               
                               
                                
                              
                               
                            
                              