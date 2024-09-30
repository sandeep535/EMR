import React, {  useState } from 'react';
import Grid from '@mui/material/Grid';
import CommonCard from '../../common/CommonCard';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Box } from '@mui/material';
import FormButtonComponent from '../../components/FormButtonComponent/FormButtonComponent';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import AddIcon from '@mui/icons-material/Add';
import SLTextField from '../../CoreComponents/SLTextField';
import { BedMasterAdd } from '../../common/YupSchema/formSchema';
import Translations from '../../resources/translations';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SLButton from '../../CoreComponents/SLButton';

var obj = []
const activeRadioButtonOptions = [
    { label: 'Yes', value: '1' },
    { label: 'No', value: '2' }
];
const BedMaster = () => {
    const [instutionList, setInstutionList] = useState(obj);
    const [isFormShow, setisFormShow] = useState(false);
    const [selectedNode, setselectedNode] = useState([]);
    const [bedList, setBedLoist] = useState([]);

    const apiRef = useTreeViewApiRef();
    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            isBed: '1'
        },
        resolver: yupResolver(BedMasterAdd),
    })
    const isBedWatch = watch('isBed');
    const renderTree = (nodes) =>
        nodes.map((node) => (
            <>
                {node && <Box sx={{ display: 'flex', flexDirection: 'row', cursor: 'pointer' }}>
                    <TreeItem itemId={node.id} label={node.label}>
                        {node.children && node.children.length > 0 && renderTree(node.children)}
                    </TreeItem>
                    {!node.isBed && <AddIcon sx={{ fontSize: 15, mt: 1 }} onClick={() => {
                        setselectedNode(node);
                        setisFormShow(true)
                    }} />}
                </Box>}

            </>
        ));

    const updateNodeName = (selectedParentNode, prevData, formData) => {
        return prevData.map(currentNode => {
            if (currentNode.id == selectedParentNode.id) {
                var obj = {
                    id: selectedParentNode.id + "-" + Date.now().toString(),
                    label: formData.name,
                    children: []
                }
                if (!currentNode.children)
                    currentNode.children = []
                if (formData.isBed == '1') {
                    obj.isBed = true
                }
                currentNode.children.push(obj);
                return currentNode;
            } else {
                if (currentNode.children && currentNode.children.length > 0) {
                    return { ...currentNode, children: updateNodeName(selectedParentNode, currentNode.children, formData) };
                } else {
                    return currentNode;
                }
            }
        })
    }
    function addChildtoTree(selectedParentNode, formData) {
        setInstutionList(prevData => {
            let affterchange = updateNodeName(selectedParentNode, prevData, formData);
            return affterchange
        });
        apiRef.current.setItemExpansion(null, selectedParentNode.id, true);
        closeFormEvent();
    }
    function resetForm() {
        reset({
            isBed: '1'
        })
    }
    const bedMasterAddhhandleSubmit = async (data) => {
        if (data.isBed == "1") {
            var bedListCopy = [...bedList];
            bedListCopy.push(data);
            setBedLoist(bedListCopy);
            reset({
                isBed:'1'
            });
        } else{
            if (selectedNode == 'New') {
                addMainBlock(data);
            } else {
                addChildtoTree(selectedNode, data);
            }
        }
    }
    function addMainBlock(formData) {
        if (formData.isBed == "1") {
            var bedListCopy = [...bedList];
            bedListCopy.push(formData);
            setBedLoist(bedListCopy);
            reset({
                isBed:'1'
            });
        } else {
            var copyOfInst = [...instutionList];
            var obj = {
                id: formData.name + "-" + Date.now().toString(),
                label: formData.name,
                children: []
            }
            copyOfInst.push(obj);
            setInstutionList(copyOfInst);
            closeFormEvent();
        }
    }
    const handleAdd = () => {
      let copyBedList = [...bedList];
      copyBedList.map(bed=>{
        addChildtoTree(selectedNode, bed);
      })
      };
    function closeFormEvent() {
        resetForm();
        setisFormShow(false);
        setselectedNode([]);
    }
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={6} spacing={0}>
                    <CommonCard title={Translations.BED_MASTER.TITLE}>
                        <Box sx={{
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: 2
                        }}>

                            <SimpleTreeView apiRef={apiRef}>
                                {renderTree(instutionList)}
                            </SimpleTreeView>
                            <AddIcon sx={{ fontSize: 15, mt: 1, cursor: 'pointer' }} onClick={() => {
                                setselectedNode('New');
                                setisFormShow(true)
                            }} />
                        </Box>
                    </CommonCard>
                </Grid>
                <Grid item xs={6} spacing={1}>
                    {isFormShow && <CommonCard title={'Add Label'}>
                        <form onSubmit={handleSubmit(bedMasterAddhhandleSubmit)} >
                            <Grid container spacing={1}>
                                <Grid item xs={3} spacing={0}>
                                    <SLRadioButton
                                        name="isBed"
                                        label={Translations.BED_MASTER.IS_BED}
                                        control={control}
                                        options={activeRadioButtonOptions}
                                        error={errors.status}
                                    />
                                </Grid>
                                <Grid item xs={5} spacing={0}>
                                    <SLTextField
                                        name="name"
                                        label={Translations.BED_MASTER.NAME}
                                        control={control}
                                        placeholder={Translations.BED_MASTER.NAME}
                                    />
                                </Grid>
                                <Grid item xs={4} spacing={0}>
                                    <FormButtonComponent button1={isBedWatch == "1" ? "Add" : "Save"} button2={"Close"} clearFormEvent={() => {
                                        closeFormEvent();
                                    }} />
                                </Grid>
                            </Grid>
                        </form>
                        {bedList && bedList.map(bed =>
                            <><List>
                                <ListItem sx={{ padding: 0 }}>
                                {bed.name}
                                </ListItem>
                            </List>
                            </>
                    )}
                      {bedList && bedList.length>0 &&  <SLButton variant="outlined" color="success" onClick={handleAdd}>Add</SLButton>}
                   
                    </CommonCard>}
                </Grid>
            </Grid>
        </>
    );
};

export default BedMaster;