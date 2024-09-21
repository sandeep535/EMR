import * as Yup from 'yup';

export const DiagnosisMasterSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        code: Yup.string().required("Code is required"),
        codeset: Yup.object().required("CodeSet is required"),
    }).required()

export const AllergiesScreenSchema = Yup.object({
        allergy: Yup.object().nullable().required('Allergy is required'),
        indications: Yup.string().required("Indications is required"),
        severity: Yup.object().nullable().required("Severity is required"),
        status:Yup.string().required("Status is required"),
    }).required()
