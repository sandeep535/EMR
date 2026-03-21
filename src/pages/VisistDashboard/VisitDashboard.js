import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box, Grid, Card, CardContent, Typography, Badge, Icon, Chip, Tooltip, Divider, Paper } from '@mui/material';
import { sendRequest } from '../global/DataManager';
import APIS from '../../Utils/APIS';
import { useNavigate } from "react-router-dom";
import AppContext from '../../components/Context/AppContext';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Moment from 'react-moment';
import moment from 'moment';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import VisitCreation from '../visit-creation/VisitCreation';
import FullScreenModelPopup from '../../common/ModelPopup/FullScreenModelPopup';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import VisitSummary from '../VisitSummary/VisitSummary';
import VisitActivity from '../VisitActivites/VisitActivity';
import { sessionManager } from '../../Utils/sessionManager';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HotelIcon from '@mui/icons-material/Hotel';

const statusConfig = {
    1: { color: '#3498db', label: 'Not Started' },
    2: { color: '#f0776c', label: 'Cancelled' },
    3: { color: '#1abc9c', label: 'In Progress' },
    4: { color: '#ffd071', label: 'Completed' },
};

const legendItems = [
    { label: 'Not Started', color: '#3498db' },
    { label: 'In Progress', color: '#1abc9c' },
    { label: 'Completed',   color: '#ffd071' },
    { label: 'Cancelled',   color: '#f0776c' },
];

export default function VisitDasboard(props) {
    const [fromDate, setFromDate] = useState(dayjs(moment(new Date()).format("YYYY-MM-DD")));
    const [toDate, setTodate] = useState(dayjs(moment(new Date()).format("YYYY-MM-DD")));
    const [visitList, setVisitList] = useState([]);
    const appContextValue = useContext(AppContext);
    const listInnerRef = useRef();
    const [count, setCount] = useState(1);
    const [visitStatus, setVisitStatus] = useState([]);
    const [visitStatusList, setVisitStatusList] = useState([]);
    const [isOpenEditPopup, setIsOpenEditPopup] = useState(false);
    const [visitEditData, setVisitEditData] = useState({});
    const [totalRecords, setTotalRecords] = useState(0);
    const [isVisummaryPopup, setisVisummaryPopup] = useState(false);
    const [isVisitActivityPopUp, setIsVisitActivityPopUp] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { setCount(1); getVisitDetails(); }, [toDate, fromDate]);
    useEffect(() => { getVisitStatusList(); }, []);
    useEffect(() => { getVisitDetails(); }, [count]);
    useEffect(() => { setCount(1); getVisitDetails(); }, [visitStatus]);

    async function getVisitDetails() {
        if (!visitStatus) return false;
        let localfromDate = fromDate ? new Date(fromDate).setHours(0, 0, 0) : new Date().setHours(0, 0, 0);
        let localtoDate = toDate ? new Date(toDate).setHours(23, 59, 59) : new Date().setHours(23, 59, 59);
        var payLoad = {
            method: APIS.GET_VISITS.METHOD,
            url: APIS.GET_VISITS.URL,
            paramas: [new Date(localfromDate), new Date(localtoDate), visitStatus.id, count - 1, 16, props?.patienttype]
        }
        let result = await sendRequest(payLoad);
        if (result && result.visitDetailsDTO.length != 0) {
            setVisitList(result.visitDetailsDTO);
            setTotalRecords(result.totalcount);
        } else {
            setVisitList([]);
        }
    }

    async function getVisitStatusList() {
        var payLoad = {
            method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
            url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
            paramas: ["VISIT_STATUS"]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setVisitStatusList(result);
            setVisitStatus(result[0]);
        }
    }

    function gotoActivitiesPage(visit) {
        appContextValue.setSelectedVisitDeatils(visit);
        var copyData = [...appContextValue.leftMenuList];
        copyData.forEach(item => {
            if (item.title === "Clinical Data") {
                item.isOpen = true;
                item.isPatientSpecific = true;
            } else {
                item.isOpen = false;
                if (Object.prototype.hasOwnProperty.call(item, "isPatientSpecific")) {
                    item.isPatientSpecific = false;
                }
            }
        });
        appContextValue.setLeftMenuList(copyData);
        sessionManager.setLeftMenu(copyData);
        appContextValue.setSelectedLeftMenuItem({
            title: "Visit", to: "/visit-activity", icon: "favorite",
            isPatientSpecific: false, isOpen: false, isRefreshMenu: false, screencode: 'VITALS_SCREEN_VIEW'
        });
        navigate("/visit-activity");
    }

    function gotoAssignBed(visit) {
        appContextValue.setSelectedVisitDeatils(visit);
        var copyData = [...appContextValue.leftMenuList];
        copyData.forEach(item => {
            if (item.title === "Clinical Data") {
                item.isOpen = true;
                item.isPatientSpecific = true;
            } else {
                item.isOpen = false;
                if (Object.prototype.hasOwnProperty.call(item, "isPatientSpecific")) {
                    item.isPatientSpecific = false;
                }
            }
        });
        appContextValue.setLeftMenuList(copyData);
        sessionManager.setLeftMenu(copyData);
        navigate("/assign-bed");
    }

    function openEditPopup(visitData) { setVisitEditData(visitData); setIsOpenEditPopup(true); }
    function openVisummaryPop(visitData) { setVisitEditData(visitData); setisVisummaryPopup(true); }
    function openVisitActivity(visitData) { appContextValue.setSelectedVisitDeatils(visitData); setIsVisitActivityPopUp(true); }
    function closeModelPopup() {
        setIsOpenEditPopup(false); setisVisummaryPopup(false); setIsVisitActivityPopUp(false);
        appContextValue.setSelectedVisitDeatils([]);
    }
    const handlePaginationChange = (event, value) => { setCount(value); };

    return (
        <>
            <Box sx={{ mt: 1, ml: 1, mr: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: 1 }}>

                {/* Filter Bar */}
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 1.5 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DateField', 'DateField']} sx={{ pt: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    onChange={newValue => setFromDate(new Date(newValue))}
                                    format="DD-MM-YYYY"
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={newValue => setTodate(new Date(newValue))}
                                    format="DD-MM-YYYY"
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                                <Autocomplete
                                    size="small"
                                    disablePortal
                                    sx={{ minWidth: 180 }}
                                    options={visitStatusList}
                                    getOptionLabel={option => option.masterdatavalue || ""}
                                    value={visitStatus}
                                    onChange={(event, newValue) => setVisitStatus(newValue)}
                                    renderOption={(props, option) => <li {...props} key={option.id}>{option.masterdatavalue}</li>}
                                    renderInput={(params) => <TextField {...params} label="Visit Status" />}
                                />
                                <Divider orientation="vertical" flexItem />
                                {/* Legend */}
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {legendItems.map(item => (
                                        <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                                            <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                                        </Box>
                                    ))}
                                </Box>
                                <Box sx={{ ml: 'auto' }}>
                                    <Chip label={`Total: ${totalRecords}`} size="small" color="primary" variant="outlined" />
                                </Box>
                            </Box>
                        </DemoContainer>
                    </LocalizationProvider>
                </Paper>

                {/* Visit Cards */}
                <Box sx={{ flex: '1 1 auto', overflowY: 'auto', minHeight: 0 }} ref={listInnerRef}>
                    <Grid container spacing={1.5}>
                        {visitList && visitList.map(visit => {
                            const { color, label } = statusConfig[visit.status] || { color: '#ccc', label: '' };
                            return (
                                <Grid item xs={12} sm={6} md={4} lg={3} key={visit.id}>
                                    <Card sx={{
                                        borderRadius: 2,
                                        border: '1px solid #e0e0e0',
                                        borderLeft: `4px solid ${color}`,
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                                        transition: '0.2s',
                                        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }
                                    }}>
                                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>

                                            {/* Header — name + token + status */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                    <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>
                                                        {visit.clientid.firstname + " " + visit.clientid.lastname}
                                                    </Typography>
                                                </Box>
                                                <Badge badgeContent={visit.token} color="success" sx={{ mr: 1 }} />
                                            </Box>

                                            <Chip label={label} size="small" sx={{ bgcolor: color, color: '#fff', fontWeight: 600, fontSize: 10, height: 18, mb: 1 }} />

                                            <Divider sx={{ my: 0.8 }} />

                                            {/* Date + Doctor */}
                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <CalendarTodayIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                                    <Typography sx={{ fontSize: 11 }} color="text.secondary">
                                                        <Moment format="DD-MMM-YYYY">{new Date(visit.visitdate)}</Moment>
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <LocalHospitalIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                                                    <Typography sx={{ fontSize: 11 }} color="text.secondary">
                                                        {visit.doctor.firstname + " " + visit.doctor.lastname}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 0.8 }} />

                                            {/* Actions */}
                                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                                <Tooltip title="Go to Visit">
                                                    <Icon sx={{ fontSize: 18, color: '#3498db', cursor: 'pointer' }}
                                                        onClick={(e) => { e.preventDefault(); gotoActivitiesPage(visit); }}>send</Icon>
                                                </Tooltip>
                                                <Tooltip title="Edit Visit">
                                                    <Icon sx={{ fontSize: 18, color: '#3498db', cursor: 'pointer' }}
                                                        onClick={(e) => { e.preventDefault(); openEditPopup(visit); }}>edit</Icon>
                                                </Tooltip>
                                                {visit.status == 3 && (
                                                    <Tooltip title="Visit Summary">
                                                        <Icon sx={{ fontSize: 18, color: '#1abc9c', cursor: 'pointer' }}
                                                            onClick={(e) => { e.preventDefault(); openVisummaryPop(visit); }}>summarize</Icon>
                                                    </Tooltip>
                                                )}
                                                {props?.isFrom === "nursedashboard" && (
                                                    <Tooltip title="Visit Activity">
                                                        <Icon sx={{ fontSize: 18, color: '#f0776c', cursor: 'pointer' }}
                                                            onClick={(e) => { e.preventDefault(); openVisitActivity(visit); }}>tour</Icon>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Assign Bed">
                                                    <HotelIcon sx={{ fontSize: 18, color: '#9c27b0', cursor: 'pointer' }}
                                                        onClick={(e) => { e.preventDefault(); gotoAssignBed(visit); }} />
                                                </Tooltip>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>

                {/* Pagination */}
                <Paper variant="outlined" sx={{ borderRadius: 2, p: 1, display: 'flex', justifyContent: 'center' }}>
                    <Stack spacing={2}>
                        <Pagination count={Math.ceil(totalRecords / 16)} color="primary" page={count} onChange={handlePaginationChange} />
                    </Stack>
                </Paper>
            </Box>

            {isOpenEditPopup && (
                <FullScreenModelPopup title="Edit Visit" isOpen={isOpenEditPopup} handleClose={closeModelPopup}>
                    <VisitCreation isEdit={'true'} visitEditData={visitEditData} />
                </FullScreenModelPopup>
            )}
            {isVisummaryPopup && (
                <FullScreenModelPopup title="Visit Summary" isOpen={isVisummaryPopup} handleClose={closeModelPopup}>
                    <VisitSummary visitEditData={visitEditData} isFrom="Nurse-dashboard" />
                </FullScreenModelPopup>
            )}
            {isVisitActivityPopUp && (
                <FullScreenModelPopup title="Visit Activity" isOpen={isVisitActivityPopUp} handleClose={closeModelPopup}>
                    <VisitActivity />
                </FullScreenModelPopup>
            )}
        </>
    );
}
