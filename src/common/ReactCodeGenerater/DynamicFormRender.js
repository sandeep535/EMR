import React, { useState, Suspense, useRef, useEffect } from "react";
import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import { ImportFormField } from "./ImportFormField";
import { useForm } from "react-hook-form";
import FormButtonComponent from "../../components/FormButtonComponent/FormButtonComponent";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../../pages/global/DataManager";
export default function DynamicFormRender(props) {
    const [formState, setFormState] = useState(props.form);
    const [dynamicState, setDynamicState] = useState({});
    const { control: dynamicControl, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {},

    });
    const itemRefs = useRef([]);
    useEffect(() => {
        getStateValues();
    }, []);
    function getStateValues() {
        let copyState = { ...dynamicState };
        formState.forEach(row => {
            row && row.row.map((column, subIndex) => {
                column.props.forEach(prop => {
                    if (prop.isStateValue && prop.apiCallForState) {
                        copyState[prop.value.value] = [];
                    } else if (prop.isStateValue) {
                        copyState[prop.value] = [];
                    }
                })

            });
        });
        setDynamicState(copyState);
        setTimeout(() => {
            getOnloadAPIcalls();
        }, 1000)

    }
    async function callApis(prop) {
        let method = "";
        let url = "";
        let params = "";
        let state = prop.value.value;
        let apiInputs = prop.value;
        if (prop.apiCallForState) {
            method = apiInputs.apiCallForState.METHOD;
            url = apiInputs.apiCallForState.URL;
            params = apiInputs.apiCallForState.PARAM;
        }
        var payLoad = {
            method: method,
            url: url,
            paramas: [params]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            let copyStateValue = { ...dynamicState };
            if (Array.isArray(result)) {
                copyStateValue[state] = result;
            } else {
                copyStateValue[state] = result[params];
            }
            setDynamicState(copyStateValue);
        }
    }
    function getOnloadAPIcalls() {
        formState.forEach(item => {
            let rows = item.row;
            if (rows) {
                rows.forEach(column => {
                    column.props.forEach(prop => {
                        if (prop.isStateValue && prop.apiCallForState && prop.apiCallForState.onload == 1) {
                            callApis(prop);
                        }
                    })

                })
            }
        });
    }
    return (
        <>
            <Box sx={{ minHeight: 200, backgroundColor: 'white' }}>
                {formState.map((zone, index) => (
                    <>
                        <Grid container direction="row" key={index}>
                            {zone && zone.row.map((column, subIndex) => {
                                const field = column;
                                const gridSize = field.dynamicComponentProps.find(obj => obj['key'] == "gridSize");
                                const DynamicFiled = ImportFormField(field.type);
                                let propsobj = {};
                                //----------------------Props -------------------------------------
                                let localPorps = column.props;
                                localPorps.forEach(currentProp => {
                                    if (currentProp.isStateValue) {
                                        if (currentProp.apiCallForState) {
                                            propsobj[currentProp.key] = (dynamicState[currentProp.value.value]) ? dynamicState[currentProp.value.value] : [];
                                        } else {
                                            propsobj[currentProp.key] = (dynamicState[currentProp.value]) ? dynamicState[currentProp.value] : [];
                                        }
                                    } else {
                                        propsobj[currentProp.key] = currentProp.value;
                                    }

                                })
                                //------------------End Props --------------------------------------
                                return (
                                    <Grid key={subIndex} item xs={Number(gridSize.value)} >
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
                                               <></>
                                            )}
                                        </Box>
                                    </Grid>
                                );
                            })
                            }
                        </Grid>

                    </>
                ))}

            </Box>
        </>
    )
}