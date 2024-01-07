 const LeftMenu = [{
    title:"Dashboard",
    to:"/",
    icon:"star",
    isPatientSpecific :false,
    isOpen:false,
    subMenu:[{
        title:"Sub-1",
        to:"/",
        icon:"star",
        isPatientSpecific :false,
    },{
        title:"Sub-2",
        to:"/",
        icon:"star",
        isPatientSpecific :false,
    }]
},{
    title:"Registration",
    to:"/registration",
    icon:"PersonOutlinedIcon",
    isPatientSpecific :false,
    isOpen:false,
},{
    title:"Visit Creation",
    to:"/visit-creation",
    icon:"HomeOutlinedIcon",
    isPatientSpecific :false,
    isOpen:false,
},{
    title:"Visit Dashboard",
    to:"/vist-dashboard",
    icon:"HomeOutlinedIcon",
    isPatientSpecific :false,
    isOpen:false,
},{
    title:"Employee Master",
    to:"/employeeMaster",
    icon:"HomeOutlinedIcon",
    isPatientSpecific :false,
    isOpen:false,
},{
    title:"Service Master",
    to:"/serviceMaster",
    icon:"HomeOutlinedIcon",
    isPatientSpecific :false,
    isOpen:false,
},{
    title:"Vitals",
    to:"/vitalsList",
    icon:"HomeOutlinedIcon",
    isPatientSpecific :true,
    isOpen:false,
},{
    title:"Prescriptions",
    to:"/prescriptionsList",
    icon:"HomeOutlinedIcon",
    isPatientSpecific :true,
    isOpen:false,
}];
export default LeftMenu