import React, { useState, useContext } from 'react';
import { Box, Paper, Typography, Grid, Divider, Chip, Button } from '@mui/material';
import HotelIcon from '@mui/icons-material/Hotel';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BedSelection from '../../common/BedSelection/BedSelection';
import BedSelectionView from '../../common/BedSelection/BedSelectionView';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import AppContext from '../../components/Context/AppContext';
import SLDatePicker from '../../CoreComponents/SLDatePicker';
import SLTextField from '../../CoreComponents/SLTextField';
import dayjs from 'dayjs';

export default function AssignBed() {
  const [bedList, setBedList] = useState([]);
  const [selectedBed, setSelectedBed] = useState(null);
  const [admitDate, setAdmitDate] = useState(dayjs());
  const [admitTime, setAdmitTime] = useState(dayjs().format('HH:mm'));
  const appContextValue = useContext(AppContext);
  const visitDetails = appContextValue.selectedVisitDeatils;

  function handleBedPicked(bed) {
    setSelectedBed(null);
    setBedList(Array.isArray(bed) ? bed : [bed]);
  }

  async function handleSave() {
    if (!selectedBed || !visitDetails?.clientid) return;
    const admittedAt = `${dayjs(admitDate).format('YYYY-MM-DD')}T${admitTime}:00`;
    await sendRequest({
      method: APIS.ASSIGN_BED.METHOD,
      url: APIS.ASSIGN_BED.URL,
      data: { bedId: selectedBed.id, patientId: visitDetails.clientid.seqid, admittedAt },
    });
  }

  return (
    <Box sx={{ m: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HotelIcon sx={{ color: '#1976d2' }} />
        <Typography variant="h6" fontWeight={600}>Assign Bed</Typography>
      </Box>

      <Grid container spacing={2} sx={{ flex: 1 }}>

        {/* Left Panel — Admission Details + Bed Selector */}
        <Grid item xs={12} md={4}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">ADMISSION DETAILS</Typography>
            </Box>
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EventIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                <Box sx={{ flex: 1 }}>
                  <SLDatePicker
                    label="Admitted Date"
                    value={admitDate}
                    onChange={(val) => setAdmitDate(val)}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeIcon sx={{ color: '#1976d2', fontSize: 20 }} />
                <Box sx={{ flex: 1 }}>
                  <SLTextField
                    label="Admitted Time"
                    type="time"
                    value={admitTime}
                    onChange={(e) => setAdmitTime(e.target.value)}
                  />
                </Box>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
                  SELECT LOCATION
                </Typography>
                <BedSelection onChange={handleBedPicked} initialParentId={-999} />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel — Bed Grid */}
        <Grid item xs={12} md={8}>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ px: 2, py: 1.5, bgcolor: '#f5f7fa', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" fontWeight={600} color="text.secondary">BED LAYOUT</Typography>
              {bedList.length > 0 && (
                <Chip label={`${bedList.length} beds`} size="small" sx={{ bgcolor: '#e3f2fd', color: '#1976d2', fontWeight: 600 }} />
              )}
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <BedSelectionView
                bed={bedList}
                onSelect={(bed) => setSelectedBed(bed)}
              />
            </Box>

            {/* Footer Action */}
            <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#fafafa' }}>
              {selectedBed ? (
                <Typography variant="body2" color="text.secondary">
                  Selected: <strong>{selectedBed.name}</strong>
                </Typography>
              ) : (
                <Typography variant="body2" color="text.disabled">No bed selected</Typography>
              )}
              <Button
                variant="contained"
                disabled={!selectedBed}
                onClick={handleSave}
                startIcon={<HotelIcon />}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Assign Bed
              </Button>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
}
