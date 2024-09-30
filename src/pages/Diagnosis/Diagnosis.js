import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import CommonCard from '../../common/CommonCard';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormControl from '@mui/material/FormControl';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import Translations from '../../resources/translations';
import { DiagnosisSchema } from '../../common/YupSchema/formSchema';


const Diagnosis = forwardRef((props, ref) => {
    const [description, setDescription] = useState("");
    const data1 = props.data && props.data.dignosismasterid;
    const [diagnosisMasterData, setDiagnosisMasterData] = useState(data1 ? data1 : []);

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: { selectedDiagnosisValues: "" },
        resolver: yupResolver(DiagnosisSchema),
    });

    useEffect(() => {
        if (data1) {
            setDiagnosisMasterData([data1]);
        }
    }, [props.data]);

    async function getDiagnosisMasterData(newInputValue) {
        var obj = {
            pagenumber: 0,
            pagesize: 100,
            totalcount: 0,
            diagnosisMasterModel: [{
                dignosiscodeset: null,
                dignosiscode: null,
                dignosisname: newInputValue,
                status: 1
            }]
        }
        var payLoad = {
            method: APIS.GET_DIADNOSIS_MASTER.METHOD,
            url: APIS.GET_DIADNOSIS_MASTER.URL,
            paramas: [],
            data: obj
        }
        let result = await sendRequest(payLoad);
        if (result && result.diagnosisMasterModel) {
            setDiagnosisMasterData(result.diagnosisMasterModel)
        } else {
            setDiagnosisMasterData([])
        }
    }
    useImperativeHandle(
        ref,
        () => {
            return {
                getFormData: () => {
                    return {
                        description
                    }
                },
                setFormData: (data) => {
                    if (data) {
                        setValue("selectedDiagnosisValues", data, { shouldTouch: true, shouldDirty: true });
                    }

                },
                submitFormmData: () => {
                    handleSubmit(diagnosisHandle)();
                }
            }
        },
        [description],
    );
    const diagnosisHandle = async (data) => {
        setDescription(data.selectedDiagnosisValues);
    }

    return (
        <>
            <CommonCard title={props.label}>
                <form onSubmit={handleSubmit(diagnosisHandle)}  >
                    <Grid container spacing={1}>
                        <Grid item xs={12} >
                            <FormControl variant="outlined" fullWidth>
                                <AutocompleteField
                                    name="selectedDiagnosisValues"
                                    label={Translations.LAB_ORDER.DID_TITLE}
                                    control={control}
                                    isMultiSelect={false}
                                    options={diagnosisMasterData}
                                    placeholder={Translations.LAB_ORDER.DID_TITLE}
                                    mapvalues={{ id: "dignosisid", value: 'dignosisname' }}
                                    id={"diagnosis-controllable-states-demo"}
                                    onInputChange={(data) => {
                                        if (data && data.length > 1) {
                                            getDiagnosisMasterData(data)
                                        }
                                    }}
                                />
                            </FormControl>
                        </Grid>

                    </Grid>
                </form>
            </CommonCard>

        </>
    )
});
Diagnosis.displayName ="Diagnosis";
export default Diagnosis;