import React, { forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CommonCard from '../../common/CommonCard';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';

const schema = yup
    .object({
        selectedLabOrder: yup.array().required("Select Lab Order")
    })
    .required()
const data111 = [{
    labname: 'lab1',
    labid: 1
}]
const LabOrder = forwardRef((props, ref) => {
    const [description, setDescription] = useState("");
    const data1 = props.data;
    const [labOrderMasterData, setLabOrderMasterData] = useState(data1 ? data1 : []);
    const [labinputValue, setLabinputValue] = useState("");
    const [removedItems, setRemovedItems] = useState([]);
    const { control, handleSubmit, reset,watch , setValue, formState: { errors } } = useForm({
        mode: 'onChange',
        defaultValues: { selectedLabOrder: [] },
        resolver: yupResolver(schema),
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
    const handleRemoveItem = (event, newValue) => {
        const localremovedItems = autocompleteValue.filter(item => !newValue.includes(item));
        if (localremovedItems.length > 0) {
            let copyRemovedItems = [...removedItems];
            localremovedItems[0].status=2;
            copyRemovedItems.push(localremovedItems[0]);
            setRemovedItems(copyRemovedItems);
          console.log('Removed item(s):', localremovedItems);
        }
        setValue('selectedLabOrder', newValue);
      };
    return (

        <>

            <CommonCard title={props.label}>
                <form onSubmit={handleSubmit(labOrderisHandle)}  >
                    <Grid container spacing={1}>
                        <Grid item xs={12} >
                            <FormControl variant="outlined" fullWidth>
                                <Controller
                                    name="selectedLabOrder"
                                    control={control}
                                    render={({ field: { onChange,value } }) =>
                                        <Autocomplete
                                            size="small"
                                            multiple
                                            options={labOrderMasterData}
                                            onChange={(event, item) => {
                                                onChange(item);
                                            }}
                                            value ={value}
                                            key={option => option.labid}
                                            getOptionLabel={option => option.labname}
                                            inputValue={labinputValue}
                                            onInputChange={(event, newInputValue) => {
                                                if (event != null) {
                                                    if (newInputValue && newInputValue.length > 1) {
                                                        getLabOrderMasterData(newInputValue)
                                                    }
                                                    setLabinputValue(newInputValue);
                                                }
                                            }}
                                            id="lab-controllable-states-demo"
                                            renderInput={(params) => <TextField {...params} error={errors.selectedLabOrder?.message}
                                                helperText={errors.selectedLabOrder?.message} label="Search Daignosis" />}
                                        />
                                    }
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