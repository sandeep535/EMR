import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SLTextField from '../../CoreComponents/SLTextField';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import { DisplayFiledProperiesSchema } from '../YupSchema/formSchema';
import CommonCard from '../CommonCard';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import SLSelectDropDown from '../../CoreComponents/SLSelectDropDown';

export default function DisplayFiledProperies(props) {
    const { displyItems } = props;
    const [propItems, setPropItems] = useState(displyItems);
    const defaultobj = {


    }
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: defaultobj,
        resolver: yupResolver(DisplayFiledProperiesSchema),
        
    });
    function getDataFromListInEditMode(){
        let obj ={};
        propItems.forEach(item=>{
            obj[item.key]=item.value
        });
        reset(obj)
    }
    getDataFromListInEditMode();
     
    const DisplayFiledProperieshandleSubmit = async (data) => {
        props.returnedDisplayPropItems(data)
    }

    return (
        <>
            <CommonCard title={Translations.DISPLAY_PROP_ITEMS.TITLE}>
                <form onSubmit={handleSubmit(DisplayFiledProperieshandleSubmit)} >
                    {propItems.map(item => (

                        <>
                            {item.isDisplay !='no' && item.options && <SLSelectDropDown
                                name={item.key}
                                label={item.displaylabel}
                                control={control}
                                options={item.options}
                                error={errors[item.key]}
                                mapvalues={{ id: "id", value: 'value' }}
                                onchangeEventCallBack={(item) => {
                                    //getStateData(item.countryid);
                                }}
                            />}
                            {item.isDisplay !='no' && (!item.options) && <SLTextField
                                key={Math.random().toString()}
                                name={item.key}
                                label={item.displaylabel}
                                control={control}
                                placeholder={item.displaylabel}
                            />}


                        </>

                    ))}
                    <FormButtonComponent button1={"ADD"} clearFormEvent={() => {

                    }} />
                </form>

            </CommonCard>
        </>
    )
}