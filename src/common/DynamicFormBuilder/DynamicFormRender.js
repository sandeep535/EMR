import React, { useState, Suspense,useRef, useEffect } from "react";
import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import { ImportFormField } from "./ImportFormField";
import { useForm } from "react-hook-form";
import FormButtonComponent from "../../components/FormButtonComponent/FormButtonComponent";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../../pages/global/DataManager";

const isStateValue = ["options"];
const convertObjectorArray = [];
const convertIdAndValue = ['mapvalues'];
const functionsList = ['onInputChange', 'onchangeEventCallBack'];
const splitWithCommaAPIObject =['apiEndpoint']

export default function DynamicFormRender(props) {
    const [formState, setFormState] = useState(props.form);
    const [dynamicState, setDynamicState] = useState({});
    const { control: dynamicControl, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {},

    });
    const itemRefs = useRef([]);
    useEffect(() => {
        getOnloadAPIcalls();
    }, []);
    async function callApis(apiData,subZone,index,subIndex) {
        const urlObj = apiData.find(obj => obj['key'] == "url");
        const methoidObj = apiData.find(obj => obj['key'] == "method");
        const paraObj = apiData.find(obj => obj['key'] == "paramas");
        const stateObj = apiData.find(obj => obj['key'] == "stateKey");

        var payLoad = {
            method: methoidObj.value,
            url: urlObj.value,
            paramas: [paraObj.value]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            let copyStateValue = { ...dynamicState };
            if(Array.isArray(result)){
                copyStateValue[stateObj.value] = result;
            }else{
                copyStateValue[stateObj.value] = result[paraObj.value];
            }
            if(subZone){
                //subZone.apiCall[3].value = result;
                itemRefs.current[subIndex]=result;
            }else{
                setDynamicState(copyStateValue);
            }
          
        }
    }
    function getOnloadAPIcalls() {
        formState.forEach(item => {
            let rows = item.row;
            if (rows) {
                rows.forEach(rowItem => {
                    if (rowItem.apiCall) {
                        const triggerpoint = rowItem.apiCall.find(obj => obj['key'] == "triggerpoint");
                        if (triggerpoint.value && triggerpoint.value.id == 1) {
                            callApis(rowItem.apiCall)
                        }

                    }
                })
            }

        })
    }
    
    const callFunctions = (key,subZone,index,subIndex,data) => {
       if(data != subZone.apiCall[2].value){
        subZone.apiCall[2].value = data
        callApis(subZone.apiCall,subZone,index,subIndex)
       }
      
    };
    const dummyFunctions = (key,subZone, data) => {

    }
    return (
        <>
            <Box sx={{ minHeight: 200, backgroundColor: 'white' }}>
                {formState.map((zone, index) => (
                    <>
                        <Grid container direction="row" key={index}>
                            {zone && zone.row.map((subZone, subIndex) => {
                                const field =subZone;
                                const DynamicFiled = ImportFormField(field.type);
                                //const optionsRef+index = useRef([]);
                                var propsobj = {}
                                if (field.props) {
                                    var componentProps = field.props;
                                    componentProps.forEach(item => {
                                        if (isStateValue.indexOf(item.key) == -1) {
                                            propsobj[item.key] = (item.value) ? item.value : "Sample";
                                        } else if (splitWithCommaAPIObject.indexOf(item.key) != -1 && item.isApiCall != "NO") {
                                            const stateObj = field.apiCall.find(obj => obj['key'] == "stateKey");
                                            propsobj[item.key] = (dynamicState[stateObj.value]) ? dynamicState[stateObj.value] : [];
                                        } else {
                                            if (item.isApiCall == 'NO') {
                                                propsobj[item.key] = (item.value) ? JSON.parse(item.value) : [];
                                            } else {
                                                propsobj[item.key] = (item.value) ? item.value : "Sample";
                                            }
                                        }
                                        if (convertIdAndValue.indexOf(item.key) != -1) {
                                            let orignalSplitValue = item.value;
                                            let splitAreay = orignalSplitValue.split(",");
                                            let mapingObj = {
                                                id :splitAreay[0],
                                                value:splitAreay[1]
                                            }
                                            propsobj[item.key] = mapingObj
                                          //  propsobj[item.key] = (item.value) ? JSON.parse(item.value) : "Sample";
                                        }
                                        if (splitWithCommaAPIObject.indexOf(item.key) != -1) {
                                            let orignalSplitValue = item.value;
                                            let splitAreay = orignalSplitValue.split(",");
                                            let APIENDPOINT = {
                                                URL :splitAreay[0],
                                                METHOD:splitAreay[1]
                                            }
                                            propsobj[item.key] = APIENDPOINT
                                        }
                                        if (functionsList.indexOf(item.key) != -1 && subZone && subZone.apiCall && subZone.apiCall[4].value.id ==2) {
                                          
                                            propsobj[item.key] =callFunctions.bind("",item.key,subZone,index,subIndex)
                                        }else if(functionsList.indexOf(item.key) != -1){
                                            propsobj[item.key] = dummyFunctions.bind("",item.key,subZone)
                                        }

                                    });

                                    var dynamiccomponentPropsdo = field.dynamicComponentProps;
                                    var dynamicPopsObj = {};
                                    dynamiccomponentPropsdo.forEach(item => {
                                        dynamicPopsObj[item.key] = (item.value) ? item.value : "2";
                                    })
                                }
                                return (
                                    <Grid key ={subIndex} item xs={Number(dynamicPopsObj.gridSize)} >
                                        <Box
                                            sx={{
                                                padding: 1,
                                                minHeight: 20,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',

                                            }}
                                        >
                                            {field && !field.isDummyRow ? (
                                                <Suspense fallback={<Box >Loading</Box>} key={Math.random().toString()}>
                                                    <DynamicFiled {...propsobj} control={dynamicControl} />
                                                </Suspense>
                                            ) : (
                                                <Typography>Drop here</Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </>

                ))}
                <FormButtonComponent button1={"Save"} button2={"Close"} />
            </Box>
        </>
    )
}