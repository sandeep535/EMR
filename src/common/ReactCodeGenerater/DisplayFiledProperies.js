import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SLTextField from '../../CoreComponents/SLTextField';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import { DisplayFiledProperiesSchema } from '../YupSchema/formSchema';
import CommonCard from '../CommonCard';
import Translations from '../../resources/translations';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import SLSelectDropDown from '../../CoreComponents/SLSelectDropDown';
import { Typography } from '@mui/material';
import { Button } from '@mui/base';
import Icon from '@mui/material/Icon';

export default function DisplayFiledProperies(props) {
    const { displyItems } = props;
    const [propItems, setPropItems] = useState(displyItems);
    const defaultobj = {
    }
    const filedWitObjects = {};
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: defaultobj,
        resolver: yupResolver(DisplayFiledProperiesSchema),

    });


    useEffect(() => {
        getDataFromListInEditMode();
        return () => console.log("Cleanup..");
    }, []);
    function getDataFromListInEditMode() {
        let obj = {};
        propItems.forEach(item => {
            obj[item.key] = item.value
        });
        reset(obj);
        // setPropItems(displyItems);
    }


    const DisplayFiledProperieshandleSubmit = async (data) => {
        props.returnedDisplayPropItems(data)
    }
    function getAPIDDOM(item) {
        if (item.isStateValue && item.apiCallForState) {
            let numberOfKeys = Object.keys(item.apiCallForState.value);
            return (<div>
                <span>API:</span>
                <SLTextField
                    key={Math.random().toString()}
                    name={`${item.key}.value`}
                    label={item.displaylabel}
                    control={control}
                    placeholder={item.displaylabel}
                />
                {numberOfKeys.map((objectKey, index) => (
                    <SLTextField
                        key={index}
                        name={`${item.key}.apiCallForState.${objectKey}`}
                        label={`${objectKey}`}
                        control={control}
                        placeholder={`${objectKey}`}
                    />
                ))}
            </div>)
        }
    }
    return (
        <>
            <CommonCard title={Translations.DISPLAY_PROP_ITEMS.TITLE}>
                <form onSubmit={handleSubmit(DisplayFiledProperieshandleSubmit)} >
                    {propItems.map(item => {
                        if (item.isDynamicArray) {
                            const { fields, append, remove } = useFieldArray({
                                control,
                                name: item.key,
                            });
                            let numberOfKeys = Object.keys(item.value[0]);
                            return (<div key="dynamic-fields">
                                <span>{item.displaylabel}:</span>

                                {fields.map((field, index) => (
                                    <div key={field.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                        {numberOfKeys.map((objectKey, indexob) => {
                                            return (<div key={indexob} style={{ marginRight: 8 }}>
                                                <SLTextField
                                                    name={`${item.key}[${index}].${objectKey}`}
                                                    label={`${objectKey}`}
                                                    control={control}
                                                    placeholder="Name"
                                                />
                                            </div>)
                                        })}
                                        <Icon onClick={() => remove(index)}>{'close'}</Icon>
                                    </div>
                                ))}
                                <Icon onClick={() => append(item.value[0])} >{'add'}</Icon>
                                {/* {getAPIDDOM(item)} */}
                            </div>)


                        } else if (item.isDynamicObject) {
                            let numberOfKeys = Object.keys(item.value);
                            return (
                            <div style={{ display: 'flex', alignItems: 'center' }} key={item.key}>
                                <span>{item.displaylabel}:</span>
                                {numberOfKeys.map((objectKey, index) => (
                                    <SLTextField
                                        key={index}
                                        name={`${item.key}.${objectKey}`}
                                        label={`${objectKey}`}
                                        control={control}
                                        placeholder={`${objectKey}`}
                                    />
                                ))}
                                {/* {getAPIDDOM(item)} */}
                            </div>
                            )
                        } else if(item.isStateValue && item.apiCallForState){
                            return (<>{getAPIDDOM(item)}</>)
                        } else {
                            return <>
                                {item.isDisplay != 'no' && item.options && <SLSelectDropDown
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
                                {item.isDisplay != 'no' && (!item.options) && <SLTextField
                                    key={Math.random().toString()}
                                    name={item.key}
                                    label={item.displaylabel}
                                    control={control}
                                    placeholder={item.displaylabel}
                                />}
                                {/* {getAPIDDOM(item)} */}

                            </>
                        }



                    })}

                    <FormButtonComponent button1={"ADD"} clearFormEvent={() => {

                    }} />
                </form>

            </CommonCard>
        </>
    )
}