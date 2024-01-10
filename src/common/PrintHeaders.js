const PrintHeaders = {
    "VITALS": [{
        label: "Date",
        isSingleValue: true,
        dataValue:"date"
    }, {
        label: "Height",
        isSingleValue: true,
        dataValue:"height"
    },
    {
        label: "Weight",
        isSingleValue: true,
        dataValue:"weight"
    }, {
        label: "Pulse",
        isSingleValue: true,
        dataValue:"pulse"
    },
    {
        label: "Respiratory Rate",
        isSingleValue: true,
        dataValue:"respiratoryrate"
    },
    {
        label: "Temperature",
        isSingleValue: true,
        dataValue:"temperature"
    }, {
        label: "BP",
        isSingleValue: false,
        values: ["systolic", "diastolic"],
        dataValue:["systolic", "diastolic"],
    }],
    "PRESCRIPTIONS":[{
        label: "Date",
        isSingleValue: true,
        dataValue:"date"
    },{
        label: "Drug Name",
        isSingleValue: true,
        dataValue:"drugname"
    },{
        label: "Dose",
        isSingleValue: false,
        dataValue:["dose","doseunit"]
    },{
        label: "SIG",
        isSingleValue: true,
        dataValue:"sig"
    },{
        label: "Start Date",
        isSingleValue: true,
        dataValue:"startdate"
    },{
        label: "End Date",
        isSingleValue: true,
        dataValue:"endate"
    }],
    "ALLERIGIES":[{
        label: "Date",
        isSingleValue: true,
        dataValue:"date"
    },{
        label: "Allergy",
        isSingleValue: true,
        dataValue:"allergy"
    },{
        label: "Severity",
        isSingleValue: true,
        dataValue:"severity.lookupvalue"
    },{
        label: "Indications",
        isSingleValue: true,
        dataValue:"indications"
    }],
    "NOTES":[{
        label: "Notes",
        isSingleValue: true,
        dataValue:"description",
        width:12
    }],
    "Diagnosis":[{
        label: "Diagnosis",
        isSingleValue: true,
        dataValue:"description",
        width:12
    }]
};
export default PrintHeaders;