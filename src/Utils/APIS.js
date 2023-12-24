const APIS={
    LOOKUP:{
        URL:"common/lookupdata/{0}",
        METHOD:"GET",
        ACTION:"GET LOOKUPS"
    },
    GET_COUNTRIESLIST:{
        URL:"common/getCountries",
        METHOD:"GET",
        ACTION:""
    },
    GET_STATES:{
        URL:"common/getStates/{0}",
        METHOD:"GET",
        ACTION:""
    },
    GET_CITIES:{
        URL:"common/getCities/{0}",
        METHOD:"GET",
        ACTION:""
    },
    CLIENT_REGISTRATION:{
        URL:"registration",
        METHOD:"POST",
        ACTION:""
    },
    CLIENT_DATA_BASED_ON_PHONENUMBER:{
        URL:"registration/getDatabasedonmobilenumber/{0}",
        METHOD:"GET",
        ACTION:""
    },
    GET_EMPLOYES_BASED_ON_NAME:{
        URL:"common/getEmployeesBasedOnName/{0}",
        METHOD:"GET",
        ACTION:""
    },
    GET_SERVICE_MASTER_DATA_BASED_SERVICENAME:{
        URL:"common/getServiceMasterData/{0}",
        METHOD:"GET",
        ACTION:""
    },
    SAVE_VISIT:{
        URL:"visit",
        METHOD:"POST",
        ACTION:"Save Visist"
    },
    GET_VISITS:{
        URL:"visit/getVisits/{0}/{1}/{2}/{3}",
        METHOD:"GET",
        ACTION:"Get Visist"
    },
    UPDATE_VISIT_STATUS:{
        URL:"visit/updateVisitStatus/{0}/{1}",
        METHOD:"GET",
        ACTION:"Update Visist"
    },
    SAVE_VITALS:{
        URL:"visit/vitals",
        METHOD:"POST",
        ACTION:"Save Vitals"
    },
    GET_DRUG_MASTER_DATA:{
        URL:"drugs/getDrugMasterData/{0}",
        METHOD:"GET",
        ACTION:""
    },
    SAVE_VISIT_DATA:{
        URL:"visit/saveVisitData",
        METHOD:"POST",
        ACTION:"SAVE VISIT DATA"
    }
}
export default APIS;