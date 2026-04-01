import React, { useState, useContext, useEffect, useRef } from "react";
import {
    Box, Button, Grid, Typography, IconButton, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Tooltip, Divider, CircularProgress
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import { styled } from "@mui/material/styles";
import CommonCard from "../../common/CommonCard";
import AppContext from "../../components/Context/AppContext";
import APIS from "../../Utils/APIS";
import { sendRequest } from "../global/DataManager";
import serviceDetails from "../../Utils/Service";
import SLSelectDropDown from "../../CoreComponents/SLSelectDropDown";
import SLTextField from "../../CoreComponents/SLTextField";

const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

const FILE_ICONS = {
    pdf: <PictureAsPdfIcon color="error" />,
    jpg: <ImageIcon color="primary" />,
    jpeg: <ImageIcon color="primary" />,
    png: <ImageIcon color="primary" />,
};

const getFileIcon = (fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    return FILE_ICONS[ext] || <InsertDriveFileIcon color="action" />;
};

const initialForm = { docTypeId: null, docName: "", description: "", file: null };

const UploadDocuments = () => {
    const { selectedVisitDeatils } = useContext(AppContext);
    const patientId = selectedVisitDeatils?.clientid?.seqid;
    const visitId = selectedVisitDeatils?.visitid;

    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [activeType, setActiveType] = useState("ALL");
    const [docTypeOptions, setDocTypeOptions] = useState([]);
    const fileInputRef = useRef();

    useEffect(() => {
        sendRequest({ method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD, url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL, paramas: ['DOCUMENT_TYPE'] })
            .then(result => { if (result) setDocTypeOptions(result); });
    }, []);

    useEffect(() => {
        if (patientId) fetchDocuments();
    }, [patientId]);

    const fetchDocuments = async (docTypeId = null) => {
        const api = docTypeId
            ? { method: APIS.GET_DOCS_BY_PATIENT_TYPE.METHOD, url: APIS.GET_DOCS_BY_PATIENT_TYPE.URL, paramas: [patientId, docTypeId] }
            : { method: APIS.GET_DOCS_BY_PATIENT.METHOD, url: APIS.GET_DOCS_BY_PATIENT.URL, paramas: [patientId] };
        const result = await sendRequest({ ...api, data: null });
        if (result) setDocuments(result);
    };

    const validate = () => {
        const e = {};
        if (!form.docTypeId) e.docTypeId = "Document type is required";
        if (!form.docName.trim()) e.docName = "Document name is required";
        if (!form.file) e.file = "Please select a file";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleUpload = async () => {
        if (!validate()) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", form.file);
        formData.append("patientId", patientId);
        formData.append("visitId", visitId);
        formData.append("docTypeId", form.docTypeId.id);
        formData.append("docName", form.docName);
        formData.append("description", form.description);

        const result = await sendRequest({
            method: APIS.FILE_UPLOAD.METHOD,
            url: APIS.FILE_UPLOAD.URL,
            paramas: [],
            data: formData,
            isMultiContent: true,
        });
        setUploading(false);
        if (result) {
            setForm(initialForm);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchDocuments();
        }
    };

    const handleDelete = async (docId) => {
        await sendRequest({
            method: APIS.DELETE_DOCUMENT.METHOD,
            url: APIS.DELETE_DOCUMENT.URL,
            paramas: [docId],
            data: null,
        });
        setDocuments((prev) => prev.filter((d) => d.id !== docId));
    };

    const handleDownload = (doc) => {
        const url = `${serviceDetails.SERVICE_URL}documents/download/${doc.id}`;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", doc.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const docTypes = ["ALL", ...new Set(documents.map((d) => d.docTypeName || String(d.docTypeId)))];

    return (
        <CommonCard title="Documents">
            {/* Upload Form */}
            <Box sx={{ p: 2, border: "1px dashed", borderColor: "divider", borderRadius: 2, mb: 3 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>Upload Document</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <SLSelectDropDown
                            label="Document Type *"
                            options={docTypeOptions}
                            mapvalues={{ id: "id", value: "masterdatavalue" }}
                            value={form.docTypeId}
                            onChange={(val) => setForm((f) => ({ ...f, docTypeId: val }))}
                            error={errors.docTypeId ? { message: errors.docTypeId } : null}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SLTextField
                            label="Document Name *"
                            size="small"
                            fullWidth
                            value={form.docName}
                            onChange={(e) => setForm((f) => ({ ...f, docName: e.target.value }))}
                            error={!!errors.docName}
                            helperText={errors.docName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <SLTextField
                            label="Description"
                            size="small"
                            fullWidth
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Button
                            component="label"
                            variant="outlined"
                            startIcon={<CloudUploadIcon />}
                            size="small"
                            color={errors.file ? "error" : "primary"}
                        >
                            {form.file ? form.file.name : "Choose File"}
                            <VisuallyHiddenInput
                                ref={fileInputRef}
                                type="file"
                                onChange={(e) => {
                                    const selected = e.target.files[0] || null;
                                    const nameWithoutExt = selected ? selected.name.replace(/\.[^/.]+$/, "") : "";
                                    setForm((f) => ({
                                        ...f,
                                        file: selected,
                                        docName: f.docName.trim() === "" ? nameWithoutExt : f.docName,
                                    }));
                                    setErrors((er) => ({ ...er, file: null }));
                                }}
                            />
                        </Button>
                        {errors.file && <Typography variant="caption" color="error" ml={1}>{errors.file}</Typography>}
                    </Grid>
                    <Grid item xs={12} sm={6} display="flex" alignItems="center" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleUpload}
                            disabled={uploading}
                            startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
                        >
                            {uploading ? "Uploading..." : "Upload"}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Filter Chips by Doc Type */}
            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                {docTypes.map((type) => (
                    <Chip
                        key={type}
                        label={type}
                        size="small"
                        color={activeType === type ? "primary" : "default"}
                        onClick={() => {
                            setActiveType(type);
                            const matched = docTypeOptions.find((o) => o.masterdatavalue === type);
                            fetchDocuments(type === "ALL" ? null : matched?.id || type);
                        }}
                        variant={activeType === type ? "filled" : "outlined"}
                    />
                ))}
            </Box>

            {/* Documents Table */}
            <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                    <TableHead sx={{ bgcolor: "primary.main" }}>
                        <TableRow>
                            <TableCell sx={{ color: "white" }}>File</TableCell>
                            <TableCell sx={{ color: "white" }}>Doc Name</TableCell>
                            <TableCell sx={{ color: "white" }}>Type</TableCell>
                            <TableCell sx={{ color: "white" }}>Description</TableCell>
                            <TableCell sx={{ color: "white" }}>Date</TableCell>
                            <TableCell sx={{ color: "white" }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body2" color="text.secondary" py={2}>No documents found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            documents.map((doc) => (
                                <TableRow key={doc.id} hover>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {getFileIcon(doc.fileName)}
                                            <Typography variant="body2" noWrap maxWidth={120}>{doc.fileName}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{doc.docName}</TableCell>
                                    <TableCell>
                                        <Chip label={doc.docTypeName || doc.docTypeId} size="small" variant="outlined" color="info" />
                                    </TableCell>
                                    <TableCell>{doc.description}</TableCell>
                                    <TableCell>{doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "-"}</TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Download">
                                            <IconButton size="small" color="primary" onClick={() => handleDownload(doc)}>
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(doc.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </CommonCard>
    );
};

export default UploadDocuments;
