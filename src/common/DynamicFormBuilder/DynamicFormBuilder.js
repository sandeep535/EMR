import React, { useState, Suspense, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Box, Paper, Typography, Button, Grid } from "@mui/material";
import FiledProperitedList from "./FiledProperitedList";
import DisplayFiledProperies from "./DisplayFiledProperies";
import { ImportFormField } from "./ImportFormField";
import { useForm } from "react-hook-form";
import FormButtonComponent from "../../components/FormButtonComponent/FormButtonComponent";
import { sendRequest } from "../../pages/global/DataManager";
import DynamicFormRender from "./DynamicFormRender";
const ItemType = "FORM_FIELD";
import TextField from '@mui/material/TextField';
import Icon from '@mui/material/Icon';
/* eslint-disable no-debugger */

const DraggableField = ({ field }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemType,
        item: { field },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <Grid item xs={4} ref={drag} sx={{
            cursor: "move",
            opacity: isDragging ? 0.5 : 1,
            marginBottom:'5px'
        }}>
            <Box sx={{ backgroundColor: isDragging ? "lightgray" : "white",display:'flex',flexDirection:'column',height:'100%',borderRadius:'5px',margin:'5px',padding:'5px'}}>
                <Icon>{field.icon}</Icon>
                <Typography variant="body3" >
                    {field.label}
                </Typography>
            </Box>
        </Grid>
        // <Paper
        //     ref={drag}
        //     sx={{
               
        //         marginBottom: 2,
        //         backgroundColor: isDragging ? "lightgray" : "white",
        //         cursor: "move",
        //         opacity: isDragging ? 0.5 : 1,
        //     }}
        // >
        //     <Typography variant="body1">{field.label}</Typography>
        // </Paper>
    );
};
const DropZone = ({ field, index, subIndex, onDrop, control,onEditModeDisplayFiled }) => {

    const [{ isOver }, drop] = useDrop(() => ({
        accept: ItemType,
        drop: (item) => {
            return onDrop(item.field, index, subIndex, control)
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));
    const DynamicFiled = ImportFormField(field.type);
    var propsobj = {}
    if (field.props) {
        var componentProps = field.props;
        componentProps.forEach(item => {
            if (item.isApiCall == 'NO') {
                propsobj[item.key] = (item.value) ? JSON.parse(item.value) : [];
            } else {
                propsobj[item.key] = (item.value) ? item.value : "Sample";
            }

        })
        var dynamiccomponentPropsdo = field.dynamicComponentProps;
        var dynamicPopsObj = {};
        dynamiccomponentPropsdo.forEach(item => {
            dynamicPopsObj[item.key] = (item.value) ? item.value : "2";
        })
    }
    return (
        <Grid item xs={Number(dynamicPopsObj.gridSize)} >
            <Box
                ref={drop}
                sx={{
                    padding: 1,
                    border: "2px dashed gray",
                    backgroundColor: isOver ? "lightgreen" : "white",
                    minHeight: 20,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',

                }}
            >
                {field && !field.isDummyRow ? (
                    <Suspense fallback={<Box >Loading</Box>} key={Math.random().toString()}>
                        <DynamicFiled {...propsobj} control={control} />
                    </Suspense>
                ) : (
                    <Typography>Drop here</Typography>
                )}
                <Icon key={index.toString()} style={{ fontSize:14, color: 'black', cursor: 'pointer' }} onClick={() => {
                    onEditModeDisplayFiled(field, index, subIndex, control)
                }}>{"edit"}</Icon>
            </Box>
        </Grid>
    );
};

const DynamicFormBuilder = () => {
    const [formGrid, setFormGrid] = useState([]);
    const [formFields, setformFields] = useState([]);
    const [filedPropList, setFiledPopList] = useState([]);
    const [propertyFiled, setPropertyFiled] = useState([]);
    const [isPreview, setIspreview] = useState(false);

    const [rows, setRows] = React.useState('');

    const [dynamicState, setDynamicState] = useState({});
    const { control: dynamicControl, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {},

    });
    useEffect(() => {
        var copyOne = { ...FiledProperitedList }
        const formFields = Object.keys(copyOne);
        setformFields(formFields);
        setFiledPopList(copyOne);
    }, []);
    useEffect(() => {
    }, [formGrid])

    const handleDrop = (field, index, subIndex, control) => {
        let newGrid = [...formGrid];
        let filedCopy = JSON.parse(JSON.stringify(field));
        filedCopy.isDummyRow = false;
        newGrid[index]['row'][subIndex] = filedCopy;
        setFormGrid(newGrid);
        let dynamicCompProps = filedPropList[field.type].dynamicComponentProps;
        let compoenntPoprs = filedPropList[field.type].props;
        let apiProps = [];
        if (filedPropList[field.type].apiCall) {
            apiProps = filedPropList[field.type].apiCall;
        }
        let allPops = [...dynamicCompProps, ...compoenntPoprs, ...apiProps];
        let onj = {
            index: index,
            subIndex: subIndex,
            dataItem: allPops
        }
        setPropertyFiled(onj)
    };
    const onEditModeDisplayFiled = (field, index, subIndex, control) => {
        let allPops = [...field.dynamicComponentProps, ...field.props];
        if(field.apiCall){
            allPops = [...allPops,field.apiCall]
        }
        let onj = {
            index: index,
            subIndex: subIndex,
            dataItem: allPops
        }
        setPropertyFiled(onj)
    }
    const addRow = () => {
        const newGrid = [...formGrid];
        let newDummyRowCopy = {
            row: []
        };
        for (var i = 0; i < rows; i++) {
            let obj = structuredClone(filedPropList[formFields[0]]);
            obj.dynamicComponentProps[0].value = 12/Number(rows);
            obj.props.forEach(item => {
                item.value = Math.random().toString();
            })
            obj.isDummyRow = true;
            newDummyRowCopy.row.push(obj);
        }

        newGrid[newGrid.length] = newDummyRowCopy;
        setFormGrid(newGrid);
    };
    async function callApis(api, callBack) {
        debugger
        const urlObj = api.find(obj => obj['key'] == "url");
        const methoidObj = api.find(obj => obj['key'] == "method");
        const paraObj = api.find(obj => obj['key'] == "paramas");
        const stateObj = api.find(obj => obj['key'] == "stateKey");
        var payLoad = {
            method: methoidObj.value,
            url: urlObj.value,
            paramas: [paraObj.value]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            let dynamicStateCopy = { ...dynamicState };
            dynamicStateCopy[stateObj.value] = result.GENDER;

        }
        callBack()
    }
    function returnedDisplayPropItems1(data) {
        debugger
        let selectedFiled = structuredClone(propertyFiled);
        let newGrid = [...formGrid];
        let previousValue = newGrid[selectedFiled['index']]['row'][selectedFiled.subIndex];
        if (previousValue.apiCall) {
            previousValue.apiCall.forEach(item => {
                if (data[item.key]) {
                    item.value = data[item.key]
                }
            })
            callApis(previousValue.apiCall, () => {
                setPreviousPropsToCurrent(previousValue, newGrid, data, selectedFiled)
            });
        } else {
            setPreviousPropsToCurrent(previousValue, newGrid, data, selectedFiled)
        }
        setPropertyFiled([])
    }
    function setPreviousPropsToCurrent(previousValue, newGrid, data, selectedFiled) {
        previousValue.props.forEach(item => {
            if (data[item.key]) {
                item.value = data[item.key]
            }
        });
        previousValue.dynamicComponentProps.forEach(item => {
            if (data[item.key]) {
                item.value = data[item.key]
            }
        });
        newGrid[selectedFiled['index']]['row'][selectedFiled.subIndex] = previousValue;
        setFormGrid(newGrid);
        setPropertyFiled([]);
    }
    const DisplayFiledProperieshandleSubmit = async (data) => {
        console.log("dataaaa", data)
    }

    function getDynamicCodeContextReactJsxJson(){
        let reactJson = {};
        reactJson["componentname"] = "sampleForm";
        formGrid.map(rows=>{
            let rowEle = []
            rows.row.forEach(column =>{
              //  if(reactJson["elements"]){
                    let elementColumnobj = {};
                    elementColumnobj.type = column.type;
                    let propsString = "";
                    column.props(prop=>{
                        propsString+""+prop.key +"="+ "{"+prop.value+"}"
                    })
                    elementColumnobj.props = propsString
                    rowEle.push(elementColumnobj);
               // }
            });
            if(!reactJson["elements"]){
                reactJson["elements"] = []
            }
            reactJson["elements"].push(rowEle);
        });

    }

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <Box sx={{ display: "flex", justifyContent: "space-between", padding: 4 }}>
                    <Box sx={{ width: 200 }}>
                        <Typography variant="h6" gutterBottom>
                            Form Fields
                        </Typography>
                        <Grid container direction="row" >
                        {formFields.map((field) => (
                            <DraggableField key={Math.random().toString()} field={filedPropList[field]} />
                        ))}
                        </Grid>
                        <Box>
                            {propertyFiled.length != 0 && <DisplayFiledProperies displyItems={propertyFiled.dataItem} returnedDisplayPropItems={returnedDisplayPropItems1}></DisplayFiledProperies>}
                        </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1, marginLeft: 4 }}>
                        <Box sx={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                            <Typography variant="h6" gutterBottom>
                                Build Your Form
                            </Typography>
                            <Box sx={{mr:'15px'}}>
                                <TextField required id="outlined-required" size="small" label="Rows" value={rows} onChange={(event) => {
                                    setRows(event.target.value);
                                }}
                                />
                                <Button variant="contained" size="small" color="primary"  onClick={addRow}>Add Row</Button>
                            </Box>
                           
                        </Box>
                        
                        <Box sx={{ minHeight: 200, backgroundColor: 'white' }}>
                            <form onSubmit={handleSubmit(DisplayFiledProperieshandleSubmit)} >
                                {formGrid.map((zone, index) => (
                                   
                                        <Grid container direction="row" key={index}>
                                            {zone && zone.row.map((subZone, subIndex) => (
                                               
                                                 <DropZone
                                                         key={Math.random().toString()}
                                                        field={subZone}
                                                        index={index}
                                                        subIndex={subIndex}
                                                        onDrop={handleDrop}
                                                        control={dynamicControl}
                                                        onEditModeDisplayFiled={onEditModeDisplayFiled}
                                                    />
                                               
                                            ))}
                                        </Grid>
                                    

                                ))}
                                <FormButtonComponent button1={"Save"} button2={"Close"} />
                            </form>
                        </Box>
                        
                    </Box>
                </Box>
            </DndProvider>
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => {
                debugger
               // setIspreview(true)
               getDynamicCodeContextReactJsxJson()
                }}>Preview</Button>
            {isPreview && <DynamicFormRender form={formGrid} />}

        </>
    );
};

export default DynamicFormBuilder;
