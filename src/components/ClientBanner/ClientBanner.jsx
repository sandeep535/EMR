import React from 'react';
import { Box, Typography, Avatar, Chip, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import WcIcon from '@mui/icons-material/Wc';
import CakeIcon from '@mui/icons-material/Cake';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import HotelIcon from '@mui/icons-material/Hotel';

const statusConfig = {
    1: { color: '#3498db', label: 'Not Started' },
    2: { color: '#f0776c', label: 'Inactive' },
    3: { color: '#1abc9c', label: 'In Progress' },
    4: { color: '#ffd071', label: 'Completed' },
};

const InfoItem = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>{icon}</Box>
        <Box>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1 }}>{label}</Typography>
            <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.4 }}>{value || '—'}</Typography>
        </Box>
    </Box>
);

export default function ClientBanner({ clientData, visitData, bedInfo }) {
    if (!clientData) return null;

    const status = visitData?.status;
    const { color: statusColor, label: statusLabel } = statusConfig[status] || { color: '#ccc', label: 'Unknown' };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            bgcolor: 'background.paper',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            mb: 2,
        }}>
            {/* Status color bar */}
            <Box sx={{ width: 6, alignSelf: 'stretch', bgcolor: statusColor, flexShrink: 0 }} />

            {/* Avatar */}
            <Box sx={{ px: 2, py: 1.5 }}>
                <Avatar sx={{ bgcolor: statusColor, width: 48, height: 48 }}>
                    <PersonIcon />
                </Avatar>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ my: 1 }} />

            {/* Info fields */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, px: 3, py: 1.5, flex: 1 }}>
                <InfoItem
                    icon={<PersonIcon fontSize="small" />}
                    label="Patient Name"
                    value={`${clientData.firstname} ${clientData.lastname}`}
                />
                <InfoItem
                    icon={<CakeIcon fontSize="small" />}
                    label="Age"
                    value={clientData.age}
                />
                <InfoItem
                    icon={<WcIcon fontSize="small" />}
                    label="Gender"
                    value={clientData.gender?.lookupvalue}
                />
                <InfoItem
                    icon={<PhoneIcon fontSize="small" />}
                    label="Mobile"
                    value={clientData.contact}
                />
                {visitData?.reason && (
                    <InfoItem
                        icon={<MedicalServicesIcon fontSize="small" />}
                        label="Visit Reason"
                        value={visitData.reason}
                    />
                )}
                <InfoItem
                    icon={<HotelIcon fontSize="small" />}
                    label="Assigned Bed"
                    value={bedInfo || '—'}
                />
            </Box>

            {/* Status chip */}
            <Box sx={{ pr: 2 }}>
                <Chip
                    label={statusLabel}
                    size="small"
                    sx={{ bgcolor: statusColor, color: '#fff', fontWeight: 600, fontSize: 11 }}
                />
            </Box>
        </Box>
    );
}
