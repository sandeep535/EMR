import React, { useEffect, useState, useContext, useRef } from 'react';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { sendRequest } from '../global/DataManager';
import Typography from '@mui/material/Typography';
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
import styles from './VisitDashboardCss';
import ColorLegend from '../../components/Common/ColorLegend';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Icon from '@mui/material/Icon';
import VisitCreation from '../visit-creation/VisitCreation';
import FullScreenModelPopup from '../../common/ModelPopup/FullScreenModelPopup';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import CommonCard from '../../common/CommonCard';
import Badge from '@mui/material/Badge';

const borderColor = {
    1: '#3498db',
    2: '#f0776c',
    3: '#1abc9c',
    4: '#ffd071'
}
const visitStatus = {
    1: "Visit Not Started",
    2: 'Visit In-active',
    3: 'Visit In progress',
    4: 'Visit Complted'
}
const legendItems = [
    { label: 'Visit Not Started', color: '#3498db' },
    { label: 'Visit In Progress', color: '#1abc9c' },
    { label: 'Visit Completed', color: '#ffd071' },
    { label: 'Visit Cancelled', color: '#f0776c' },
];



export default function VisitDasboard() {
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

    const navigate = useNavigate();
    useEffect(() => {
        setCount(1);
        getVisitDetails();
    }, [toDate, fromDate]);
    useEffect(() => {
        getVisitStatusList();
    }, []);
    useEffect(() => {
        getVisitDetails();
    }, [count])
    useEffect(() => {
        setCount(1);
        getVisitDetails();

    }, [visitStatus]);
    async function getVisitDetails() {
        let localfromDate = fromDate ? new Date(fromDate).setHours(0, 0, 0) : new Date().setHours(0, 0, 0);
        let localtoDate = toDate ? new Date(toDate).setHours(23, 59, 59) : new Date().setHours(23, 59, 59);
        var payLoad = {
            method: APIS.GET_VISITS.METHOD,
            url: APIS.GET_VISITS.URL,
            paramas: [new Date(localfromDate), new Date(localtoDate), visitStatus.id, count - 1, 10]
        }
        let result = await sendRequest(payLoad);
        debugger
        if (result && result.visitDetailsDTO.length != 0) {
            setVisitList(result.visitDetailsDTO);
            setTotalRecords(result.totalcount)
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
        copyData.map(item => {
            if (item.hasOwnProperty("isPatientSpecific")) {
                item.isOpen = true;
                item.isPatientSpecific = true;
            }
        });
        appContextValue.setLeftMenuList(copyData);
        navigate("/vist-activity");
    }

    function openEditPopup(visitData) {
        setVisitEditData(visitData);
        setIsOpenEditPopup(true);
    }

    function closeModelPopup() {
        setIsOpenEditPopup(false);
    }
    const handlePaginationChange = (event, value) => {
        setCount(value);
    };
    return (
        <>

            <Box sx={{ flexGrow: 1, m: 1, position: 'relative', zIndex: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateField', 'DateField']}>
                        <Grid container >
                            <Grid item xs={2} spacing={1}>
                                <DatePicker
                                    label="From Date"
                                    value={fromDate}
                                    onChange={newValue => setFromDate(new Date(newValue))}
                                    format="DD-MM-YYYY"
                                    slotProps={{ textField: { size: 'small' } }}
                                />
                            </Grid>
                            <Grid item xs={2} spacing={1} sx={{ ml: 1 }}>
                                <DatePicker
                                    label="To Date"
                                    value={toDate}
                                    onChange={newValue => {
                                        setTodate(new Date(newValue));
                                    }}
                                    format="DD-MM-YYYY"
                                    slotProps={{ textField: { size: 'small' } }}

                                />

                            </Grid>
                            <Grid item xs={2} spacing={0} sx={{ ml: 1 }}>
                                <Autocomplete
                                    size="small"
                                    disablePortal
                                    id="visitTypeList"
                                    options={visitStatusList}
                                    key={option => option.id}
                                    getOptionLabel={option => option.masterdatavalue || ""}
                                    value={visitStatus}
                                    onChange={(event, newValue) => {
                                        setVisitStatus(newValue);
                                    }}
                                    renderOption={(props, option) => {
                                        return (
                                            <li {...props} key={option.id}>
                                                {option.masterdatavalue}
                                            </li>
                                        );
                                    }}
                                    renderInput={(params) => <TextField {...params} label={'Visit Status'} />}
                                />
                            </Grid>
                            <ColorLegend legendItems={legendItems} />
                            <Box sx={{ mt: 1, fontSize: 14, fontWeight: 900 }}>{"Total Records: " + totalRecords}</Box>
                        </Grid>
                    </DemoContainer>
                </LocalizationProvider>
            </Box>

            <Box sx={{ m: 1, paddingTop: '80px' }} className='visit-cards-div' ref={listInnerRef}>
                <Grid container spacing={1}  >
                    {visitList && visitList.map(visit => {
                        return (
                            <Grid item xs={3} key={visit.id}>
                                <Card sx={{ border: '2px solid #d3d3d3',borderLeftColor:borderColor[visit.status] }}>
                                    <CardContent>
                                        <Box>
                                            <Typography  sx={{ display:'flex',flexDirection:'row',justifyContent :'space-between'}} gutterBottom>
                                                <Typography sx={{ fontSize: 14, fontWeight: 700 }} >{visit.clientid.firstname + " " + visit.clientid.lastname }</Typography>
                                               
                                                <Badge badgeContent={visit.token} color="success" ></Badge>
                                            </Typography>
                                            <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                                                {<Moment format="DD-MMM-YYYY">
                                                    {new Date(visit.visitdate)}
                                                </Moment>}
                                            </Typography>
                                        </Box>
                                        <Box sx={styles.wrapper}>
                                            <Typography sx={{ fontSize: 12 }} color="text.secondary" gutterBottom>
                                                {visit.doctor.firstname + " " + visit.doctor.lastname}
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                                <Icon sx={{ fontSize: 16, color: 'rgb(52, 152, 219)' }} onClick={(event) => { event.preventDefault(); gotoActivitiesPage(visit) }}>{"send"}</Icon>
                                                <Icon sx={{ fontSize: 16, color: 'rgb(52, 152, 219)', ml: 1 }} onClick={(event) => { event.preventDefault(); openEditPopup(visit) }}>{"edit"}</Icon>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })}

                </Grid>

            </Box>
            <Box >
                <Stack spacing={2}>
                    <Pagination count={Math.ceil(totalRecords / 5)} color="primary" page={count} onChange={handlePaginationChange} />
                </Stack>
            </Box>
            <Box>
                <FullScreenModelPopup title={"Edit Visit"} isOpen={isOpenEditPopup} handleClose={() => closeModelPopup()}>
                    <VisitCreation isEdit={'true'} visitEditData={visitEditData} />
                </FullScreenModelPopup>
            </Box>
        </>
    )
}