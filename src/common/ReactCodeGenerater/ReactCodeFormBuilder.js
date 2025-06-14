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
            marginBottom: '5px'
        }}>
            <Box sx={{ backgroundColor: isDragging ? "lightgray" : "white", display: 'flex', flexDirection: 'column', height: '100%', borderRadius: '5px', margin: '5px', padding: '5px' }}>
                <Icon>{field.icon}</Icon>
                <Typography variant="body3" >
                    {field.label}
                </Typography>
            </Box>
        </Grid>
    );
};
const DropZone = ({ field, index, subIndex, onDrop, control, onEditModeDisplayFiled }) => {
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
                propsobj[item.key] = (item.value) ? item.value : [];
            } else {
                propsobj[item.key] = (item.value) ? (item.isStateValue) ? [] :item.value : "Sample";
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
                <Icon key={index.toString()} style={{ fontSize: 14, color: 'black', cursor: 'pointer' }} onClick={() => {
                    onEditModeDisplayFiled(field, index, subIndex, control)
                }}>{"edit"}</Icon>
            </Box>
        </Grid>
    );
};

const ReactCodeFormBuilder = () => {
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
        if(field.type == "SLFORM"){
            newGrid[index] = {form:[filedCopy]}
        }else{
            newGrid[index]['row'][subIndex] = filedCopy;
        }
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
        if (field.apiCall) {
            allPops = [...allPops, field.apiCall]
        }
        let onj = {
            index: index,
            subIndex: subIndex,
            dataItem: allPops
        }
        setPropertyFiled(onj)
    }
    const addRow = (index,subIndex,isForm) => {
        const newGrid = [...formGrid];
        let newDummyRowCopy = {
            row: []
        };
        for (var i = 0; i < rows; i++) {
            let obj = structuredClone(filedPropList[formFields[0]]);
            obj.dynamicComponentProps[0].value = 12 / Number(rows);
            obj.props.forEach(item => {
                item.value = Math.random().toString();
            })
            obj.isDummyRow = true;
            newDummyRowCopy.row.push(obj);
        }
        if(isForm){
            if(newGrid[index].row){
                newGrid[index].row = [...newGrid[index].row ,...newDummyRowCopy.row];
            }else{
                newGrid[index].row = newDummyRowCopy.row;
            }
            
        }else{
            newGrid[newGrid.length] = newDummyRowCopy;
        }
        
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
        let previousValue = "";
        if(newGrid[selectedFiled['index']]['row']){
            previousValue = newGrid[selectedFiled['index']]['row'][selectedFiled.subIndex];
        }else{
            previousValue = newGrid[selectedFiled['index']]['form'][selectedFiled.subIndex];
        }
        
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
        if(newGrid[selectedFiled['index']]['row']){
            newGrid[selectedFiled['index']]['row'][selectedFiled.subIndex] = previousValue;
        }else{
            newGrid[selectedFiled['index']]['form'][selectedFiled.subIndex] = previousValue;
        }
        
        setFormGrid(newGrid);
        setPropertyFiled([]);
    }
    const DisplayFiledProperieshandleSubmit = async (data) => {
        console.log("dataaaa", data)
    }

   
    function getDynamicCodeContextReactJsxJson() {
        let reactJson = {};
        reactJson["componentname"] = "sampleForm";
        reactJson["props"]=[];
        reactJson["onLoadApiMethods"] = [];
        reactJson["forms"] = []
        const importCompoents = [];
        formGrid.map((rows,index) => {
            let rowEle = [];
            if(rows.form){
                const name = rows.form[0].props.find(obj => obj['key'] == "name");
                const forApi =   rows.form[0].props.find(obj => obj['key'] == "forapi");
                let form = {
                    name:name,
                    index:index,
                    apiData:(forApi)?forApi.value.apiCallForState:""
                }
                reactJson["forms"].push(form);
            }else{
                let emptyObj = {};
                reactJson["forms"].push(emptyObj);
            }
            rows.row.forEach(column => {
                //------------Elements ----------------------
                let elementColumnobj = {};
                elementColumnobj.type = column.type;
                elementColumnobj.size= column.dynamicComponentProps[0].value;
                let propsString = "";
                if(column.isControl){
                    console.log(rows)
                    if(rows.form && rows.form[0]){
                        const name = rows.form[0].props.find(obj => obj['key'] == "name");
                        propsString = propsString + "control=" + `{${name.value}Control}`;
                    }else{
                        propsString = propsString + "control=" + "{control}";
                    }
                   
                   
                }
               
                //-------------Import statements ----------------
                if(!reactJson["importComponents"]){
                    reactJson["importComponents"] = []
                }
                if(importCompoents.indexOf(column.type) == -1){
                    importCompoents.push(column.type);
                    let importCompoentObj = {
                        name:"import "+column.type+" from '@src/CoreComponents/"+column.type+"';"
                    }
                    reactJson["importComponents"].push(importCompoentObj)
                }
                //-------------End Import statements ----------------
                
                if(column.apiCall){
                    const triggerpoint = column.apiCall.find(obj => obj['key'] == "triggerpoint");
                    const url = column.apiCall.find(obj => obj['key'] == "url");
                    const method = column.apiCall.find(obj => obj['key'] == "method");
                    const paramas = column.apiCall.find(obj => obj['key'] == "paramas");
                    const name = column.props.find(obj => obj['key'] == "name");
                    if (triggerpoint.value && triggerpoint.value.id == 1) {
                        if (!reactJson["onLoadApiMethods"]) {
                            reactJson["onLoadApiMethods"] = []
                        }
                        let onLoadApiMethodObj = {
                            name:'get'+name.value+"method",
                            url:url.value,
                            method:method.value,
                            paramas:paramas.value
                        }
                        reactJson["onLoadApiMethods"].push(onLoadApiMethodObj);
                    }
                }
                column.props.forEach(prop => {
                    
                     //------------State Value ---------------------
                    if(prop.isStateValue){
                        if(prop.apiCallForState){
                            propsString = propsString + "" + prop.key + "=" + "{"+prop.value.value+"} "
                            if (!reactJson["state"]) {
                                reactJson["state"] = []
                            }
                            let columnStateObj = {
                                name:prop.value.value,
                                defaultValue:""
                            }
                            reactJson["state"].push(columnStateObj);
                            let onLoadApiMethodObj = {
                                name:'get'+prop.value.value+"methodlist",
                                url:prop.value.apiCallForState.URL,
                                method:prop.value.apiCallForState.METHOD,
                                paramas:prop.value.apiCallForState.PARAM,
                                body:`set${prop.value.value}(result);`
                            }
                            reactJson["onLoadApiMethods"].push(onLoadApiMethodObj);
                        }else{
                            propsString = propsString + "" + prop.key + "=" + "{"+prop.value+"} "
                            if (!reactJson["state"]) {
                                reactJson["state"] = []
                            }
                            let columnStateObj = {
                                name:prop.value,
                                defaultValue:""
                            }
                            reactJson["state"].push(columnStateObj);
                        }
                    }
                    if(prop.isMethod){
                        propsString = propsString + "" + prop.key + "=" + "{"+prop.value+"()} "
                        if (!reactJson["method"]) {
                            reactJson["method"] = []
                        }
                        let columnMethodObj = {
                            name:prop.value,
                            body:""
                        }
                        reactJson["method"].push(columnMethodObj);
                    }else if(!prop.isStateValue){
                            if(typeof prop.value == "string"){
                                propsString = propsString + "" + prop.key + "=" + "{'"+prop.value+"'} "
                            }else{
                                propsString = propsString + "" + prop.key + "=" + "{"+JSON.stringify(prop.value)+"} "
                            }
                    }
                    //------------End State Value ---------------------
                })
                elementColumnobj.props = propsString
                rowEle.push(elementColumnobj);
                //------------Elements ----------------------
            });
            if (!reactJson["elements"]) {
                reactJson["elements"] = []
            }
            reactJson["elements"].push(rowEle);
        });
        debugger

    }

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <Box sx={{ display: "flex", justifyContent: "space-between", padding: 0 }}>
                    <Box sx={{ width: '15%' }}>
                        <Typography variant="h6" gutterBottom>
                            Form Fields
                        </Typography>
                        <Grid container direction="row" >
                            {formFields.map((field) => (
                                <DraggableField key={Math.random().toString()} field={filedPropList[field]} />
                            ))}
                        </Grid>
                        
                    </Box>

                    <Box sx={{ flexGrow: 1, marginLeft: 2,width: '60%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Typography variant="h6" gutterBottom>
                                Build Your Form
                            </Typography>
                            <Box sx={{ mr: '15px' }}>
                                <TextField required id="outlined-required" size="small" label="Rows" value={rows} onChange={(event) => {
                                    setRows(event.target.value);
                                }}
                                />
                                <Button variant="contained" size="small" color="primary" onClick={addRow}>Add Row</Button>
                            </Box>

                        </Box>

                        <Box sx={{ minHeight: 200, backgroundColor: 'white' }}>
                            <form onSubmit={handleSubmit(DisplayFiledProperieshandleSubmit)} >
                                {formGrid.map((zone, index) => (
                                    <Grid container direction="row" key={index}>
                                        {zone && zone.form && zone.form.map((form, subIndex) => (
                                            <Grid item xs={Number(form.dynamicComponentProps[0].value)} key={{subIndex}} >
                                                <Box sx={{ width: '100%' }}>
                                                    <Typography variant="h6" gutterBottom>
                                                       {form.props && form.props[0] && form.props[0].value}
                                                    </Typography>
                                                    <form onSubmit={handleSubmit((data) => {
                                                        console.log("data", data)
                                                       // onSubmit(data, formIndex)
                                                    })} style={{
                                                        padding: '10px',
                                                        border: '1px solid #ccc',
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f9f9f9',
                                                        width: '100%',
                                                        minHeight: '70px',

                                                    }} >
                                                        <Grid container direction="row" key={subIndex}>
                                                            {zone && zone.row && zone.row.map((formrow, formsubIndex) => (
                                                                <DropZone
                                                                    key={Math.random().toString()}
                                                                    field={formrow}
                                                                    index={index}
                                                                    subIndex={formsubIndex}
                                                                    onDrop={handleDrop}
                                                                    control={dynamicControl}
                                                                    onEditModeDisplayFiled={onEditModeDisplayFiled}
                                                                />
                                                            ))}
                                                        </Grid>
                                                        <FormButtonComponent button1={"Save"} button2={"Close"} />
                                                    </form>
                                                    <Icon key={index.toString()} style={{ fontSize: 14, color: 'black', cursor: 'pointer' }} onClick={() => {
                                                       // onEditModeDisplayFiled(field, index, subIndex, control)
                                                       addRow(index,subIndex,"form")
                                                    }}>{"edit"}</Icon>
                                                </Box>
                                            </Grid>
                                        ))} 
                                        {zone && !zone.form && zone.row && zone.row.map((subZone, subIndex) => (
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
                    <Box sx={{width: '25%',minHeight: 200, backgroundColor: 'white'}}>
                            {propertyFiled.length != 0 && <DisplayFiledProperies displyItems={propertyFiled.dataItem} returnedDisplayPropItems={returnedDisplayPropItems1}></DisplayFiledProperies>}
                        </Box>
                </Box>
            </DndProvider>
            <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => {
                 setIspreview(true)
                getDynamicCodeContextReactJsxJson()
            }}>Preview</Button>
             <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={() => {
                 setIspreview(false)
              
            }}>Preview close</Button>
            {isPreview && <DynamicFormRender form={formGrid} />}

        </>
    );
};

export default ReactCodeFormBuilder;
