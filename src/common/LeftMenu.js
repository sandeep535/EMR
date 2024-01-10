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
    },{
        title:"Prescriptions",
        to:"/prescriptionsList",
        icon:"HomeOutlinedIcon",
        isPatientSpecific :false,
        isRefreshMenu:false,
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
    },{
        title:"Visit Creation",
        to:"/visit-creation",
        icon:"HomeOutlinedIcon",
        isOpen:false,
        isRefreshMenu:true,
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
    },{
        title:"Service Master",
        to:"/serviceMaster",
        icon:"HomeOutlinedIcon",
        isOpen:false,
        isRefreshMenu:true,
    },]
}];
export default LeftMenu