import * as Yup from 'yup';
import RegularExp from '../../Utils/RegularExp';

export const DiagnosisMasterSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    code: Yup.string().required("Code is required"),
    codeset: Yup.object().required("CodeSet is required"),
}).required()

export const AllergySearchMasterSchema = Yup.object({

    status: Yup.string().required("Status is required"),
}).required()
export const AllergyNewMasterSchema = Yup.object({
    allergytype: Yup.object().nullable().required('Allergy is required'),
    allergycode: Yup.string().required("Code is required"),
    allergyname: Yup.string().required("Allergy Name is required"),
    status: Yup.string().required("Status is required"),
}).required()

export const AllergiesScreenSchema = Yup.object({
    allergy: Yup.object().nullable().required('Allergy is required'),
    indications: Yup.string().required("Indications is required"),
    severity: Yup.object().nullable().required("Severity is required"),
    status: Yup.string().required("Status is required"),
}).required()

export const PrescriptionSchema = Yup
    .object({
        selectedDrugValues: Yup.object().required("Select Drug"),
        dose: Yup.string().required("Select Dose"),
        doseunit: Yup.string().required("Select Unit"),
        sig: Yup.string().required("Select SIG"),
    })
    .required()
export const LabordersSchema = Yup
    .object({
        selectedLabOrder: Yup.array().required("Select Lab Order")
    })
    .required()
export const DiagnosisSchema = Yup
    .object({
        selectedDiagnosisValues: Yup.object().required("Select Diagnosis")
    })
    .required()
export const DrugMasterSchema = Yup
    .object({
        drugtype: Yup.object().nullable().required("Select Drug"),
        drugname: Yup.string().required("Select Drug Name"),
        drugcode: Yup.string().required("Select Drug Code")
    })
    .required()
export const VisitCreationSchema = Yup
    .object({
        title: Yup.object().nullable().required("Title Required"),
        firstname: Yup.string().required("Select First Name"),
        lastname: Yup.string().required("Select Last Name"),
        gender: Yup.object().nullable().required("Select Gender"),
        dob: Yup.object().nullable().required("Select DOB"),
        age: Yup.string().required("Select Age"),
        contact: Yup.string().required("Select contact"),
        specility: Yup.object().nullable().required("Specility Required"),
        doctor: Yup.object().nullable().required("Doctor Required"),
        visitType: Yup.object().nullable().required("Visit Type Required"),
        visitdate: Yup.object().nullable().required("Visit Date Required")
    })
    .required()
export const PatientCreationSchema = Yup
    .object({
        title: Yup.object().nullable().required("Title Required"),
        firstname: Yup.string().required("Select First Name"),
        lastname: Yup.string().required("Select Last Name"),
        gender: Yup.object().nullable().required("Select Gender"),
        dob: Yup.object().nullable().required("Select DOB"),
        age: Yup.string().required("Select Age"),
        contact: Yup.string().required("Select contact"),

    })
    .required()

export const EmployeeCreationSchema = Yup
    .object({
        title: Yup.object().nullable().required("Title Required"),
        firstname: Yup.string().required("Select First Name"),
        lastname: Yup.string().required("Select Last Name"),
        gender: Yup.object().nullable().required("Select Gender"),
        dob: Yup.object().nullable().required("Select DOB"),
        age: Yup.string().required("Select Age"),
        contact: Yup.string().required("Select contact"),
        username: Yup.string().required("Enter User Name"),
        password: Yup.string().required("Enter Password"),
        role: Yup.object().nullable().required("Select role"),

    })
    .required()
export const ServiceCreationSchema = Yup
    .object({
        servicename: Yup.string().required("Enter Service Name"),
        price: Yup.string().required("Enter Price"),
        active: Yup.string().nullable().required("Select Status")
    })
    .required()
export const VitalsSchema = Yup
    .object().shape({
        height: Yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(RegularExp.ALLOW_ONLY_NUMBERS_WITH_DICIMALS, "This field allow only numbers")
        }),
        weight: Yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(RegularExp.ALLOW_ONLY_NUMBERS_WITH_DICIMALS, "This field allow only numbers")
        }),
        bmi: Yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(RegularExp.ALLOW_ONLY_NUMBERS_WITH_DICIMALS, "This field allow only numbers")
        }),
        systolic: Yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(RegularExp.ALLOW_ONLY_NUMBERS_WITH_DICIMALS, "This field allow only numbers")
        }),
        diastolic: Yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(RegularExp.ALLOW_ONLY_NUMBERS_WITH_DICIMALS, "This field allow only numbers")
        }),
        pulse: Yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(RegularExp.ALLOW_ONLY_NUMBERS_WITH_DICIMALS, "This field allow only numbers")
        }),
        respiratoryrate: Yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(RegularExp.ALLOW_ONLY_NUMBERS_WITH_DICIMALS, "This field allow only numbers")
        }),
        temperature: Yup.string().when({
            is: (exists) => !!exists,
            then: (rule) =>
                rule.matches(RegularExp.ALLOW_ONLY_NUMBERS_WITH_DICIMALS, "This field allow only numbers")
        }),
    })
export const BedMasterAdd = Yup
    .object({
        name: Yup.string().required("Enter Name"),
        isBed: Yup.string().required("Select Is Bed")
    })
    .required()

export const DisplayFiledProperiesSchema = Yup.object({
       
    }).required()