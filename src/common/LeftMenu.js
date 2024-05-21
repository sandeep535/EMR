 const LeftMenu = [{
    title:"Dashboard",
    to:"/",
    icon:"dashboard",
    isOpen:false,
    isRefreshMenu:false,
    subMenu:[{
        title:"Visit Dashboard",
        to:"/vist-dashboard",
        icon:"dashboard_customize",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_DAHSBOARD_SCREEN_VIEW'
    },{
        title:"Visits Statistics",
        to:"/vist-statistics",
        icon:"dashboard_customize",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_DAHSBOARD_SCREEN_VIEW'
    }]
},{
    title:"Clinical Data",
    icon:"favorite",
    isPatientSpecific :false,
    isOpen:false,
    isRefreshMenu:false,
    subMenu:[{
        title:"Visit",
        to:"/vist-activity",
        icon:"favorite",
        isPatientSpecific :false,
        isOpen:false,
        isRefreshMenu:false,
        screencode:'VITALS_SCREEN_VIEW'
    },{
        title:"Allergies",
        to:"/allergy",
        icon:"favorite",
        isPatientSpecific :true,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    },{
        title:"Vitals",
        to:"/vitalsList",
        icon:"favorite",
        isPatientSpecific :false,
        isOpen:false,
        isRefreshMenu:false,
        screencode:'VITALS_SCREEN_VIEW'
    },{
        title:"Prescriptions",
        to:"/prescriptionsList",
        icon:"favorite",
        isPatientSpecific :false,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    }]
},
{
    title:"Registration",
    to:"",
    icon:"app_registration",
    isOpen:false,
    isRefreshMenu:false,
    subMenu:[{
        title:"Registration",
        to:"/registration",
        icon:"how_to_reg",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'REGISTRATION_SCREEN_VIEW'
    },{
        title:"Visit Creation",
        to:"/visit-creation",
        icon:"design_services",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_CREATION_SCREEN_VIEW'
    }]
},{
    title:"Masters",
    to:"/employeeMaster",
    icon:"sync",
    isOpen:false,
    isRefreshMenu:false,
    subMenu:[{
        title:"Employee Master",
        to:"/employeeMaster",
        icon:"manage_accounts",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'EMPLOYE_MASTER_SCREEN_VIEW'
    },{
        title:"Service Master",
        to:"/serviceMaster",
        icon:"lan",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'SERVICE_MASTER_SCREEN_VIEW'
    },{
        title:"Roles",
        to:"/rolesAnsTasks",
        icon:"supervisor_account",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'ROLES_MASTER_SCREEN_VIEW'
    },{
        title:"Drug Master",
        to:"/drugMaster",
        icon:"medication",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
    },{
        title:"Allergy Master",
        to:"/allergyMaster",
        icon:"medication",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
    }]
}];
export default LeftMenu