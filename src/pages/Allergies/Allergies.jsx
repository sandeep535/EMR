import React, { useState, useEffect, forwardRef, useImperativeHandle, useContext } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../global/DataManager';
import Translations from '../../resources/translations';
import FormControl from '@mui/material/FormControl';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ClearIcon from '@mui/icons-material/Clear';
import AppContext from '../../components/Context/AppContext';
import EMRAlert from '../../Utils/CustomAlert';
import AllergiesList from './AllergiesList';
import CommonCard from '../../common/CommonCard';
import ClientBanner from '../../components/ClientBanner/ClientBanner';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLTextField from '../../CoreComponents/SLTextField';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import SLSelectDropDown from '../../CoreComponents/SLSelectDropDown';
import { AllergiesScreenSchema } from '../../common/YupSchema/formSchema';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';

const allergiesColumns = [{
    name: 'Allergy',
    width: '30%'
}, {
    name: 'Severity',
    width: '10%'
}, {
    name: 'Status',
    width: '10%'
}, {
    name: 'Indications',
    width: '40%'
}, {
    name: 'Actions',
    width: '10%'
}]
const activeRadioButtonOptions = [
    { label: 'Active', value: '1' },
    { label: 'In-active', value: '2' }
];
const defaultobj = {
    allergy: "",
    indications: "",
    severity: {},
    status: "1"
}
const Allergies = forwardRef((props, ref) => {
    const [severityList, setSeverityList] = useState([]);
    const [allergiesList, setAllergiesList] = useState([]);
    const [allergyTypeOptions, setAllergyTypeOptions] = useState([]);

    const appContextValue = useContext(AppContext);
    const [mode, setMode] = useState("");
    const [selectedRow, setSelectedRow] = useState("");

    const [isRefreshData, setisRefreshData] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: defaultobj,
        resolver: yupResolver(AllergiesScreenSchema),
    })

    useEffect(() => {
        getLookUpDetails();
        getAllergiesMasterList();
        setMode("new")
    }, []);

    async function getAllergiesMasterList(name) {
        let data = {
            allergyid: "",
            allergyname: name,
            status: 1,
            allergycode: null,
            allergytype: null
        }
        var mainDTO = {
            pagenumber: 0,
            pagesize: 1000,
            allergieslist: [data]
        }
        var payLoad = {
            method: APIS.GET_ALLERIES_MASTER_LIST.METHOD,
            url: APIS.GET_ALLERIES_MASTER_LIST.URL,
            paramas: [],
            data: mainDTO
        }
        let result = await sendRequest(payLoad);
        if (result && result.allergieslist.length != 0) {
            setAllergyTypeOptions(result.allergieslist);
        } 

    }

    useImperativeHandle(
        ref,
        () => {
            // the return object will pass to parent ref.current, so you can add anything what you want.
            return {
                getFormData: () => {
                    return {
                        allergiesList
                    }
                },
                setFormData1: (data) => {
                    setAllergiesList(data)
                }
            }
        },
        [allergiesList],
    );


    async function getLookUpDetails() {
        var payLoad = {
            method: APIS.LOOKUP.METHOD,
            url: APIS.LOOKUP.URL,
            paramas: ["ALLERGY_SEVERITY"]
        }
        let result = await sendRequest(payLoad);
        if (result && result.ALLERGY_SEVERITY) {
            setSeverityList(result.ALLERGY_SEVERITY);
        }
    }
    async function addAllergiestoGrid(data) {
        var obj = {
            allergy: data.allergy.allergyname,
            status: data.status,
            indications: data.indications,
            severity: data.severity,
            visitid: appContextValue.selectedVisitDeatils.visitid,
            clientid: appContextValue.selectedVisitDeatils.clientid.seqid,
            allergymaster: {
                allergyid: data.allergy.allergyid,
                allergyname: data.allergy.allergyname
            }
        }
        if (mode == "edit") {
            obj["allergyid"] = selectedRow.allergyid;
            obj["visitid"] = selectedRow.visitid;
        }

        if (props.isSaveDirect) {
            setisRefreshData(false);
            var payLoad = {
                method: APIS.SAVE_ALLERIES.METHOD,
                url: APIS.SAVE_ALLERIES.URL,
                paramas: [],
                data: [obj]
            }
            let result = await sendRequest(payLoad);
            if (result) {
                setisRefreshData(true);
                EMRAlert.alertifySuccess("Allergy Saved Succussfully");
            } else {
                EMRAlert.alertifyError("Not Saved");
            }
        } else {
            var copyObj = [...allergiesList];
            copyObj.push(obj);
            setAllergiesList(copyObj);
        }

    }
    function setDatatoForm(row) {
        var obj = {
            allergy: row.allergymaster,
            severity: row.severity,
            status: row.status,
            indications: row.indications
        }
        reset(obj);
        setMode("edit");
        setSelectedRow(row);
    }

    const diagnosisMasterhandleSubmit = async (data) => {
        addAllergiestoGrid(data);
    }
    return (
        <Box sx={{ m: 1 }}>
            <Grid xs={12} container>
                <ClientBanner clientData={appContextValue.selectedVisitDeatils.clientid} visitData={appContextValue.selectedVisitDeatils} />
            </Grid>
            <CommonCard title={"Add Allergies"}>
                <Box >
                    <form onSubmit={handleSubmit(diagnosisMasterhandleSubmit)} >
                        <Grid container spacing={1}>
                            <Grid item xs={2} spacing={1}>
                                <FormControl variant="outlined" fullWidth>
                                    <AutocompleteField
                                        name="allergy"
                                        label={Translations.ALLERGY.ALLERGYNAME}
                                        control={control}
                                        options={allergyTypeOptions}
                                        placeholder={Translations.ALLERGY.ALLERGYNAME}
                                        mapvalues={{ id: "allergyid", value: 'allergyname' }}
                                        isMultiSelect={false}
                                        id={"Allergy-combo-box-demo"}
                                        onInputChange={(data) => {
                                            if (data.length > 1) {
                                                getAllergiesMasterList(data)
                                            }
                                        }}
                                        error={errors.allergy}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={2} >
                                <SLSelectDropDown
                                    name="severity"
                                    label={Translations.ALLERGY.SERVERITY}
                                    control={control}
                                    options={severityList}
                                    error={errors.severity}
                                    mapvalues={{ id: "lookupid", value: 'lookupvalue' }}
                                />
                            </Grid>
                            <Grid item xs={3} spacing={1}>
                                <SLTextField
                                    name="indications"
                                    label={Translations.ALLERGY.INDICATIONS}
                                    control={control}
                                    placeholder={Translations.ALLERGY.INDICATIONS}
                                />

                            </Grid>

                            <Grid item xs={3}>
                                <SLRadioButton
                                    name="status"
                                    label="Status"
                                    control={control}
                                    options={activeRadioButtonOptions}
                                    error={errors.status}
                                />
                            </Grid>
                            <FormButtonComponent button1={"Save"} clearFormEvent={() => {
                                reset(defaultobj,
                                    {
                                        keepErrors: true,
                                        keepDirty: true,
                                    });
                            }} />
                        </Grid>
                    </form>
                    {props && !props.isSaveDirect &&
                        <Grid xs={12} container spacing={1}>
                            <TableContainer component={Paper} >
                                <Table stickyHeader aria-label="simple table">
                                    <TableHead style={{ backgroundColor: '#1976d2', color: '#ffffff', padding: '8px', fontSize: '14px' }}>
                                        <TableRow>
                                            {allergiesColumns.map((header, index) => (
                                                <TableCell key={index} style={{ minWidth: header.width }}>{header.name}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody className='grid-height'>
                                        {allergiesList && allergiesList.map((callergy, index) => (
                                            <TableRow key={callergy.id} >
                                                <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.allergy) ? callergy.allergy : ""}</TableCell>
                                                <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.severity) ? callergy.severity.lookupvalue : ""}</TableCell>
                                                <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.status === 1) ? "Active" : "In-Active"}</TableCell>
                                                <TableCell style={{ padding: '6px', fontSize: '12px' }}>{(callergy && callergy.indications) ? callergy.indications : ""}</TableCell>
                                                <TableCell style={{ padding: '6px', fontSize: '12px' }}><ClearIcon fontSize='small' style={{ cursor: 'pointer' }} onClick={() => {
                                                    //removePrescriptionFromList(index);
                                                }} /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    }
                </Box>
            </CommonCard>
            <AllergiesList isRefresh={isRefreshData} selectedRecord={(row, action) => { setDatatoForm(row) }} />
        </Box>
    )
});
Allergies.displayName ="Allergies";
export default Allergies;

