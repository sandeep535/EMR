import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import EMRAlert from '../../Utils/CustomAlert';
import ServiceMasterList from './ServiceMasterList';
import CommonCard from '../../common/CommonCard';
import { ServiceCreationSchema } from '../../common/YupSchema/formSchema';
import SLTextField from '../../CoreComponents/SLTextField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CommonConst from '../../Utils/CommonConst';

const activeRadioButtonOptions = [
    { label: 'Active', value: '1' },
    { label: 'In-active', value: '2' }
];
export default function ServiceMaster() {
    const [listRefresh, setListRefresh] = useState(false);
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            active: '1',
            gst: 0
        },
        resolver: yupResolver(ServiceCreationSchema),
    });
    useEffect(() => {
        setListRefresh(true)
    }, []);
    const serviceMasterCreationhandleSubmit = async (data) => {
        setListRefresh(false);
        var sendingobj = {
            serviceid: data.serviceid ? data.serviceid : null,
            servicename: data.servicename,
            price: data.price,
            active: data.active,
            gst: data.gst
        }
        var payLoad = {
            method: APIS.SAVE_MASTER_DATA.METHOD,
            url: APIS.SAVE_MASTER_DATA.URL,
            paramas: [],
            data: sendingobj
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Service Saved Succussfully");
            reset({
                active: '1'
            });
            setListRefresh(true);
        } else {
            EMRAlert.alertifyError("Not created");
        }
    }
    function openServiceEditmode(row, action) {
        reset(row);
    }

    return (
        <>
            <CommonCard title={Translations.SERVICE_MASTER.SERVICE_MASTER}>
                <form onSubmit={handleSubmit(serviceMasterCreationhandleSubmit)} >
                    <Box display="grid" >
                        <Grid container spacing={1}>
                            <Grid item xs={3} spacing={1}>
                                <SLTextField
                                    name="servicename"
                                    label={Translations.SERVICE_MASTER.SERVICE_NAME}
                                    control={control}
                                    placeholder={Translations.SERVICE_MASTER.SERVICE_NAME}
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1}>
                                <SLTextField
                                    name="price"
                                    label={Translations.SERVICE_MASTER.PRICE}
                                    control={control}
                                    placeholder={Translations.SERVICE_MASTER.PRICE}
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1}>
                                <SLTextField
                                    name="gst"
                                    label={Translations.SERVICE_MASTER.GST}
                                    control={control}
                                    placeholder={Translations.SERVICE_MASTER.GST}
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1}>
                                <SLRadioButton
                                    name="active"
                                    label="Status"
                                    control={control}
                                    options={CommonConst.activeRadioButtonOptions}
                                    error={errors.status}
                                />
                            </Grid>
                            <Grid item xs={3} spacing={1}>
                                <FormButtonComponent button1={"Save"} button2={"Clear"} clearFormEvent={() => {
                                    reset({
                                        active: '1',
                                        gst: 0
                                    })
                                }} />
                            </Grid>
                        </Grid>
                    </Box>

                </form>
            </CommonCard>
            {listRefresh && <ServiceMasterList openServiceEditmode={(row, action) => { openServiceEditmode(row, action) }} />}
        </>
    )
}

