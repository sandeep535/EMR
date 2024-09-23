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
import { LabordersSchema } from '../../common/YupSchema/formSchema';

const LabOrder = forwardRef((props, ref) => {
    const [description, setDescription] = useState("");
    const data1 = props.data;
    const [labOrderMasterData, setLabOrderMasterData] = useState(data1 ? data1 : []);
    const [removedItems, setRemovedItems] = useState([]);
    const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: { selectedLabOrder: [] },
        resolver: yupResolver(LabordersSchema),
    });

    useEffect(() => {
        if (data1) {
            setLabOrderMasterData(data1);
        }
    }, [props.data]);

    async function getLabOrderMasterData(newInputValue) {
        var obj = {
            pagenumber: 0,
            pagesize: 100,
            totalcount: 0,
            labMasterModel: [{
                labname: "",
                status: 1,
            }]
        }
        var payLoad = {
            method: APIS.GET_LAB_MASTER_LIST.METHOD,
            url: APIS.GET_LAB_MASTER_LIST.URL,
            paramas: [],
            data: obj
        }
        let result = await sendRequest(payLoad);
        if (result && result.labMasterModel) {
            setLabOrderMasterData(result.labMasterModel)
        } else {
            setLabOrderMasterData([])
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
                    setLabOrderMasterData(data);;
                    setValue("selectedLabOrder", data, { shouldTouch: true, shouldDirty: true });
                },
                submitFormmData: () => {
                    handleSubmit(labOrderisHandle)();
                }
            }
        },
        [description],
    );
    const labOrderisHandle = async (data) => {
        //let totalRecords = [...data.selectedLabOrder,...removedItems];
        setDescription(data.selectedLabOrder);
    }
    const autocompleteValue = watch('selectedLabOrder');
    // const handleRemoveItem = (event, newValue) => {
    //     const localremovedItems = autocompleteValue.filter(item => !newValue.includes(item));
    //     if (localremovedItems.length > 0) {
    //         let copyRemovedItems = [...removedItems];
    //         localremovedItems[0].status = 2;
    //         copyRemovedItems.push(localremovedItems[0]);
    //         setRemovedItems(copyRemovedItems);
    //         console.log('Removed item(s):', localremovedItems);
    //     }
    //     setValue('selectedLabOrder', newValue);
    // };
    return (

        <>

            <CommonCard title={props.label}>
                <form onSubmit={handleSubmit(labOrderisHandle)}  >
                    <Grid container spacing={1}>
                        <Grid item xs={12} >
                            <FormControl variant="outlined" fullWidth>
                                <AutocompleteField
                                    name="selectedLabOrder"
                                    label={Translations.LAB_ORDER.TITLE}
                                    control={control}
                                    isMultiSelect={true}
                                    options={labOrderMasterData}
                                    placeholder={Translations.LAB_ORDER.TITLE}
                                    mapvalues={{ id: "labid", value: 'labname' }}
                                    id={"lab-controllable-states-demo"}
                                    onInputChange={(data) => {
                                        if (data && data.length > 1) {
                                            getLabOrderMasterData(data)
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
export default LabOrder;