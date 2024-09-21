import React, { useState } from "react";
import CommonCard from "../../common/CommonCard";
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});
const Demo = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
}));
const UploadDocuments = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [base64Files, setBase64Files] = useState([]);


    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to array
        setSelectedFiles(files);
        convertFilesToBase64(files); // Convert selected files to Base64
    };

    // Convert files to Base64
    const convertFilesToBase64 = (files) => {
        const promises = files.map((file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file); // Convert file to Base64 string
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });
        });

        Promise.all(promises)
            .then((base64Array) => setBase64Files(base64Array))
            .catch((error) => console.error("Error converting files to Base64:", error));
    };

    // Send files as Blob
    const handleUploadBlob = async () => {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("files", file); // Append each file as Blob
        });

        try {
            const response = await fetch("/upload-blob-endpoint", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                console.log("Files uploaded as Blob successfully!");
            } else {
                console.error("Failed to upload files as Blob.");
            }
        } catch (error) {
            console.error("Error uploading files as Blob:", error);
        }
    };

    // Send files as Base64
    const handleUploadBase64 = async () => {
        const data = {
            files: base64Files, // Send the Base64 strings
        };

        try {
            const response = await fetch("/upload-base64-endpoint", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log("Files uploaded as Base64 successfully!");
            } else {
                console.error("Failed to upload files as Base64.");
            }
        } catch (error) {
            console.error("Error uploading files as Base64:", error);
        }
    };

    return (
        <CommonCard title={"Documents"} >
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Upload files
                <VisuallyHiddenInput
                    type="file"
                    onChange={(event) => handleFileChange(event)}
                    multiple
                />
            </Button>
            <Box>
                <Typography variant="h6" component="div">
                    Selected Files:
                </Typography>
                <Demo>
                    <List >
                        {selectedFiles.map((file, index) => (
                            <ListItem>
                                <ListItemText
                                    primary={file.name}

                                />
                            </ListItem>
                        ))}
                    </List>
                </Demo>

            </Box>
            <Button variant="contained" size="small"
                onClick={() => {
                    handleUploadBase64()
                }}
            >Save</Button>

            {/* <button onClick={handleUploadBlob} disabled={selectedFiles.length === 0}>
                    Upload as Blob
                </button>

                <button onClick={handleUploadBase64} disabled={base64Files.length === 0}>
                    Upload as Base64
                </button> */}
        </CommonCard>
    );
};

export default UploadDocuments;
