 const LeftMenu = [{
    title:"Dashboard",
    to:"/",
    icon:"star",
    isOpen:false,
    isRefreshMenu:true,
    subMenu:[{
        title:"Visit Dashboard",
        to:"/vist-dashboard",
        icon:"HomeOutlinedIcon",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_DAHSBOARD_SCREEN_VIEW'
    }]
},{
    title:"Clinical Data",
    to:"/employeeMaster",
    icon:"star",
    isPatientSpecific :false,
    isOpen:false,
    isRefreshMenu:false,
    subMenu:[{
        title:"Vitals",
        to:"/vitalsList",
        icon:"HomeOutlinedIcon",
        isPatientSpecific :false,
        isOpen:false,
        isRefreshMenu:false,
        screencode:'VITALS_SCREEN_VIEW'
    },{
        title:"Prescriptions",
        to:"/prescriptionsList",
        icon:"HomeOutlinedIcon",
        isPatientSpecific :false,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    }]
},
{
    title:"Registration",
    to:"",
    icon:"star",
    isOpen:false,
    isRefreshMenu:true,
    subMenu:[{
        title:"Registration",
        to:"/registration",
        icon:"PersonOutlinedIcon",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'REGISTRATION_SCREEN_VIEW'
    },{
        title:"Visit Creation",
        to:"/visit-creation",
        icon:"HomeOutlinedIcon",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_CREATION_SCREEN_VIEW'
    }]
},{
    title:"Masters",
    to:"/employeeMaster",
    icon:"star",
    isOpen:false,
    isRefreshMenu:true,
    subMenu:[{
        title:"Employee Master",
        to:"/employeeMaster",
        icon:"HomeOutlinedIcon",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'EMPLOYE_MASTER_SCREEN_VIEW'
    },{
        title:"Service Master",
        to:"/serviceMaster",
        icon:"HomeOutlinedIcon",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'SERVICE_MASTER_SCREEN_VIEW'
    },{
        title:"Roles",
        to:"/rolesAnsTasks",
        icon:"HomeOutlinedIcon",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'ROLES_MASTER_SCREEN_VIEW'
    },]
}];
export default LeftMenu