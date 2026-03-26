 const LeftMenu = [{
    title:"Dashboard",
    to:"/",
    icon:"dashboard",
    isOpen:false,
    isRefreshMenu:false,
    subMenu:[{
        title:"OP Doctor Dashboard",
        to:"/vist-dashboard",
        icon:"medical_services",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_DAHSBOARD_SCREEN_VIEW'
    },
    {
        title:"IP Doctor Dashboard",
        to:"/admission-dashboard",
        icon:"local_hospital",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_DAHSBOARD_SCREEN_VIEW'
    },{
        title:"OP Nurse Dashboard",
        to:"/nurse-dashboard",
        icon:"health_and_safety",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_DAHSBOARD_SCREEN_VIEW'
    },{
        title:"Visits Statistics",
        to:"/vist-statistics",
        icon:"bar_chart",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_DAHSBOARD_SCREEN_VIEW'
    }]
},{
    title:"Clinical Data",
    icon:"monitor_heart",
    isPatientSpecific :false,
    isOpen:false,
    isRefreshMenu:false,
    subMenu:[{
        title:"Visit",
        to:"/visit-activity",
        icon:"event_note",
        isPatientSpecific :false,
        isOpen:false,
        isRefreshMenu:false,
        screencode:'VITALS_SCREEN_VIEW'
    },{
        title:"Allergies",
        to:"/allergy",
        icon:"coronavirus",
        isPatientSpecific :false,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    },{
        title:"Notes",
        to:"/notes",
        icon:"sticky_note_2",
        isPatientSpecific :false,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    },{
        title:"Visit Summaries",
        to:"/visitSummary",
        icon:"summarize",
        isPatientSpecific :false,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    },{
        title:"Vitals",
        to:"/vitalsList",
        icon:"monitor_heart",
        isPatientSpecific :true,
        isOpen:false,
        isRefreshMenu:false,
        screencode:'VITALS_SCREEN_VIEW'
    },{
        title:"Prescriptions",
        to:"/prescriptionsList",
        icon:"medication",
        isPatientSpecific :false,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    },{
        title:"Lab Orders",
        to:"/labordersList",
        icon:"biotech",
        isPatientSpecific :false,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    },{
        title:"Upload Documents",
        to:"/uploadDocuments",
        icon:"upload_file",
        isPatientSpecific :false,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    },{
        title:"Bills",
        to:"/bills",
        icon:"receipt_long",
        isPatientSpecific :false,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    },{
        title:"Services",
        to:"/services",
        icon:"medical_services",
        isPatientSpecific :true,
        isRefreshMenu:false,
        screencode:'PRESCRIPTIONS_SCREEN_VIEW'
    },{
        title:"Assign Bed",
        to:"/assign-bed",
        icon:"hotel",
        isPatientSpecific :false,
        isRefreshMenu:false,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
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
        icon:"add_circle_outline",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_CREATION_SCREEN_VIEW'
    },{
        title:"Admission",
        to:"/admission",
        icon:"transfer_within_a_station",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'VISIT_CREATION_SCREEN_VIEW'
    }]
},{
    title:"Masters",
    to:"/employeeMaster",
    icon:"settings",
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
        icon:"miscellaneous_services",
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
        icon:"coronavirus",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
    },{
        title:"Diagnosis Master",
        to:"/diagnosismaster",
        icon:"search",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
    },{
        title:"Lab Master",
        to:"/labmaster",
        icon:"science",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
    },{
        title:"Favorates",
        to:"/favorites",
        icon:"star",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
    },{
        title:"Bed Master",
        to:"/bedMaster",
        icon:"king_bed",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
    },{
        title:"Form Builder",
        to:"/dynamicFormBuilder",
        icon:"dynamic_form",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
    },{
        title:"React Code Builder",
        to:"/reactCodeBuilder",
        icon:"code",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
    },{
        title:"SampleForm",
        to:"/sampleForm",
        icon:"article",
        isOpen:false,
        isRefreshMenu:true,
        screencode:'DRUG_MASTER_SCREEN_VIEW'
    }] 
},{
    title:"Billing",
    to:"/bills",
    icon:"payments",
    isOpen:false,
    isRefreshMenu:false,
    subMenu:[{
            title:"Bills",
            to:"/billsScreen",
            icon:"receipt_long",
            isOpen:false,
            isRefreshMenu:true,
            screencode:'EMPLOYE_MASTER_SCREEN_VIEW'
        }]
}];
export default LeftMenu
