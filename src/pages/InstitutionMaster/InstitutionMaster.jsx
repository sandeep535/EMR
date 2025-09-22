import React, { useEffect, useState, useMemo } from "react";
import { Box, Button, Card, CardContent, Divider, Grid, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControlLabel, Checkbox, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Breadcrumbs, Link } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import APIS from "../../Utils/APIS";
import { sendRequest } from "../global/DataManager";
import SLTextField from "../../CoreComponents/SLTextField";
import SLButton from "../../CoreComponents/SLButton";

const InstitutionMaster = () => {
  const [allUnits, setAllUnits] = useState([]); // flat list from INS_MASTER
  const [path, setPath] = useState([]); // breadcrumb path (array of nodes)
  const [loading, setLoading] = useState(false);

  // dialogs
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  // forms
  const [addForm, setAddForm] = useState({ name: '', code: '', isBed: false, cost: '', parentId: null });
  const [editForm, setEditForm] = useState({ id: null, name: '', code: '', isBed: false, cost: '', parentId: null });

  const currentParentId = path.length ? path[path.length - 1].id : null;

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const payLoad = { method: APIS.INS_MASTER.METHOD, url: APIS.INS_MASTER.URL, paramas: [] };
      const data = await sendRequest(payLoad);
      setAllUnits(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  const currentList = useMemo(() => {
    return (allUnits || []).filter(u => (u.parent ? u.parent.id : null) === currentParentId);
  }, [allUnits, currentParentId]);

  const openAdd = (parentId) => {
    setAddForm({ name: '', code: '', isBed: false, cost: '', parentId: parentId ?? currentParentId });
    setAddOpen(true);
  };

  const submitAdd = async () => {
    const payload = {
      name: addForm.name,
      code: addForm.code,
      parentId: addForm.parentId ?? null,
      isBed: !!addForm.isBed,
      bedCost: addForm.isBed ? Number(addForm.cost || 0) : null
    };
    const payLoad = { method: APIS.INS_MASTER_POST.METHOD, url: APIS.INS_MASTER_POST.URL, paramas: [], data: payload };
    const res = await sendRequest(payLoad);
    if (res) {
      setAddOpen(false);
      await loadAll();
    }
  };

  const openEdit = (node) => {
    setEditForm({ id: node.id, name: node.name, code: node.code, isBed: !!node.bed, cost: node.bedCost || '', parentId: node.parent ? node.parent.id : null });
    setEditOpen(true);
  };

  const submitEdit = async () => {
    const payload = {
      id: editForm.id,
      name: editForm.name,
      code: editForm.code,
      parentId: editForm.parentId ?? null,
      isBed: !!editForm.isBed,
      bedCost: editForm.isBed ? Number(editForm.cost || 0) : null
    };
    const payLoad = { method: APIS.INS_MASTER_POST.METHOD, url: APIS.INS_MASTER_POST.URL, paramas: [], data: payload };
    const res = await sendRequest(payLoad);
    if (res) {
      setEditOpen(false);
      await loadAll();
    }
  };

  const doDelete = async (node) => {
    const payload = { id: node.id, delete: true };
    const payLoad = { method: APIS.INS_MASTER_POST.METHOD, url: APIS.INS_MASTER_POST.URL, paramas: [], data: payload };
    const res = await sendRequest(payLoad);
    if (res) await loadAll();
  };

  const goInto = (node) => {
    setPath([...path, node]);
  };

  const goCrumb = (index) => {
    const newPath = path.slice(0, index + 1);
    setPath(newPath);
  };

  const goHome = () => {
    setPath([]);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Institution Master</Typography>
              <Box>
                <Button startIcon={<AddCircleOutlineIcon />} variant="contained" onClick={() => openAdd(null)}>Add</Button>
              </Box>
            </Box>
            <Divider sx={{ my: 1 }} />

            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link underline="hover" color="inherit" onClick={goHome} style={{ cursor: 'pointer' }}>Root</Link>
              {path.map((n, idx) => (
                <Link key={n.id} underline="hover" color={idx === path.length - 1 ? 'text.primary' : 'inherit'} onClick={() => goCrumb(idx)} style={{ cursor: 'pointer' }}>
                  {n.name}
                </Link>
              ))}
            </Breadcrumbs>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Code</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Bed Cost</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentList.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.code}</TableCell>
                    <TableCell>{row.isBed ? 'Bed' : 'Unit'}</TableCell>
                    <TableCell align="right">{row.bed ? (row.bedCost ?? '-') : '-'}</TableCell>
                    <TableCell align="right">
                      {!row.isBed &&  <Tooltip title="Open">
                        <IconButton size="small" onClick={() => goInto(row)}>
                          <ArrowRightAltIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>}
                     
                      <Tooltip title="Add Child">
                        <IconButton size="small" onClick={() => openAdd(row.id)}>
                          <AddCircleOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(row)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => doDelete(row)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {!currentList.length && (
                  <TableRow>
                    <TableCell colSpan={5} align="center">No items</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Grid>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
        <DialogTitle>Add Unit</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <SLTextField label="Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
            <SLTextField label="Code" value={addForm.code} onChange={(e) => setAddForm({ ...addForm, code: e.target.value })} />
            <FormControlLabel control={<Checkbox checked={!!addForm.isBed} onChange={(e) => setAddForm({ ...addForm, isBed: e.target.checked })} />} label="Is Bed (final)" />
            {addForm.isBed && (
              <SLTextField label="Bed Cost" type="number" value={addForm.cost} onChange={(e) => setAddForm({ ...addForm, cost: e.target.value })} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button onClick={submitAdd} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Unit</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <SLTextField label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            <SLTextField label="Code" value={editForm.code} onChange={(e) => setEditForm({ ...editForm, code: e.target.value })} />
            <FormControlLabel control={<Checkbox checked={!!editForm.isBed} onChange={(e) => setEditForm({ ...editForm, isBed: e.target.checked })} />} label="Is Bed (final)" />
            {editForm.isBed && (
              <SLTextField label="Bed Cost" type="number" value={editForm.cost} onChange={(e) => setEditForm({ ...editForm, cost: e.target.value })} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={submitEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default InstitutionMaster;
