import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, List, ListItem, ListItemText, Chip, Divider, IconButton, Tooltip } from '@mui/material';
import KingBedIcon from '@mui/icons-material/KingBed';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddIcon from '@mui/icons-material/Add';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useTreeViewApiRef } from '@mui/x-tree-view/hooks';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BedMasterAdd } from '../../common/YupSchema/formSchema';
import SLTextField from '../../CoreComponents/SLTextField';
import SLRadioButton from '../../CoreComponents/SLRadioButton';
import SLButton from '../../CoreComponents/SLButton';
import Translations from '../../resources/translations';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';

const isBedOptions = [{ id: 'Yes', value: '1' }, { id: 'No', value: '2' }];

const BedMaster = () => {
    const [instutionList, setInstutionList] = useState([]);
    const [isFormShow, setIsFormShow] = useState(false);
    const [selectedNode, setSelectedNode] = useState([]);
    const [bedList, setBedList] = useState([]);

    const apiRef = useTreeViewApiRef();
    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: { isLast: '1' },
        resolver: yupResolver(BedMasterAdd),
    });

    const isBedWatch = watch('isLast');

    useEffect(() => { getTableMaster(); }, []);

    async function getTableMaster() {
        const result = await sendRequest({ method: APIS.GET_MASTER_TABLE.METHOD, url: APIS.GET_MASTER_TABLE.URL, paramas: [] });
        if (result) setInstutionList(result);
    }

    const renderTree = (nodes) => nodes.map((node) => (
        <Box key={node.id} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <TreeItem itemId={node.id} label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="body2" sx={{ fontSize: 13 }}>{node.name}</Typography>
                    {node.isLast && <Chip label="Bed" size="small" sx={{ height: 16, fontSize: 10, bgcolor: '#e3f2fd', color: '#1976d2' }} />}
                </Box>
            }>
                {node.subGroups?.length > 0 && renderTree(node.subGroups)}
            </TreeItem>
            {!node.isLast && (
                <Tooltip title="Add child">
                    <IconButton size="small" sx={{ ml: 0.5, color: '#673AB7' }} onClick={() => { setSelectedNode(node); setIsFormShow(true); if (!(node.subGroups?.[0]?.isLast)) setBedList([]); }}>
                        <AddIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                </Tooltip>
            )}
        </Box>
    ));

    const updateNodeName = (selectedParentNode, prevData, formData) =>
        prevData.map(currentNode => {
            if (currentNode.id === selectedParentNode.id) {
                const newNode = { id: `${selectedParentNode.id}-${Math.random()}`, name: formData.name, subGroups: [] };
                if (formData.isLast === '1') newNode.isLast = true;
                if (!currentNode.subGroups) currentNode.subGroups = [];
                currentNode.subGroups.push(newNode);
                return currentNode;
            }
            if (currentNode.subGroups?.length > 0)
                return { ...currentNode, subGroups: updateNodeName(selectedParentNode, currentNode.subGroups, formData) };
            return currentNode;
        });

    function addChildtoTree(selectedParentNode, formData) {
        setInstutionList(prev => updateNodeName(selectedParentNode, prev, formData));
        apiRef.current.setItemExpansion(null, selectedParentNode.id, true);
        closeFormEvent();
    }

    const onSubmit = async (data) => {
        if (data.isLast === '1') {
            setBedList(prev => [...prev, data]);
            reset({ isLast: '1' });
            sendNodeToAPI({ name: data.name, parent_id: selectedNode.id, isLast: true });
        } else {
            if (selectedNode === 'New') addMainBlock(data);
            else { addChildtoTree(selectedNode, data); sendNodeToAPI({ name: data.name, parent_id: selectedNode.id, isLast: false }); }
        }
    };

    async function sendNodeToAPI(data) {
        const result = await sendRequest({ method: APIS.SAVE_MASTER_TABLE.METHOD, url: APIS.SAVE_MASTER_TABLE.URL, paramas: [data.name, data.parent_id, data.isLast] });
        if (result) getTableMaster();
    }

    function addMainBlock(formData) {
        if (formData.isLast === '1') { setBedList(prev => [...prev, formData]); reset({ isLast: '1' }); }
        else {
            setInstutionList(prev => [...prev, { id: `${formData.name}-${Date.now()}`, name: formData.name, subGroups: [] }]);
            closeFormEvent();
        }
    }

    const handleAddBeds = () => {
        bedList.forEach(bed => addChildtoTree(selectedNode, bed));
    };

    function closeFormEvent() { reset({ isLast: '1' }); setIsFormShow(false); setSelectedNode([]); }

    return (
        <Box sx={{ m: 1 }}>
            <Grid container spacing={2}>
                {/* Tree View */}
                <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
                        <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <KingBedIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">{Translations.BED_MASTER.TITLE}</Typography>
                            </Box>
                            <Tooltip title="Add new block">
                                <IconButton size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7' }}
                                    onClick={() => { setSelectedNode('New'); setIsFormShow(true); }}>
                                    <AddCircleOutlineIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Box sx={{ p: 2, minHeight: 200 }}>
                            {instutionList.length === 0 ? (
                                <Typography variant="body2" color="text.disabled" textAlign="center" sx={{ mt: 4 }}>
                                    No structure defined. Click + to add a block.
                                </Typography>
                            ) : (
                                <SimpleTreeView apiRef={apiRef}>
                                    {renderTree(instutionList)}
                                </SimpleTreeView>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Add Form */}
                <Grid item xs={12} sm={6}>
                    {isFormShow && (
                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                            <Box sx={{ px: 2, py: 1.2, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AddCircleOutlineIcon sx={{ fontSize: 18, color: '#673AB7' }} />
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                                    ADD TO: {selectedNode === 'New' ? 'ROOT' : selectedNode?.name?.toUpperCase()}
                                </Typography>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <SLRadioButton name="isLast" label={Translations.BED_MASTER.IS_BED} control={control}
                                                options={isBedOptions} error={errors.isLast} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <SLTextField name="name" label={Translations.BED_MASTER.NAME} control={control}
                                                placeholder={Translations.BED_MASTER.NAME} error={errors.name} />
                                        </Grid>
                                        <Grid item xs={12} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                            <SLButton variant="outlined" onClick={closeFormEvent}
                                                sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7' }}>Cancel</SLButton>
                                            <SLButton type="submit" variant="contained"
                                                sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>
                                                {isBedWatch === '1' ? 'Add Bed' : 'Save'}
                                            </SLButton>
                                        </Grid>
                                    </Grid>
                                </form>

                                {/* Staged beds */}
                                {bedList.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Divider sx={{ mb: 1 }} />
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                BEDS TO ADD <Chip label={bedList.length} size="small" sx={{ bgcolor: '#ede7f6', color: '#673AB7', fontWeight: 600, ml: 0.5 }} />
                                            </Typography>
                                            <SLButton variant="contained" size="small" onClick={handleAddBeds}
                                                sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>
                                                Confirm Add
                                            </SLButton>
                                        </Box>
                                        <List dense disablePadding>
                                            {bedList.map((bed, i) => (
                                                <ListItem key={i} sx={{ py: 0.3, borderBottom: '1px dashed #eee' }}>
                                                    <ListItemText primary={bed.name} primaryTypographyProps={{ variant: 'body2', fontSize: 12 }} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default BedMaster;
