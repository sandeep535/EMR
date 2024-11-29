import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import { Box } from '@mui/material'
import Grid from '@mui/material/Grid';
import Translations from '../../resources/translations';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import AutocompleteField from '../../CoreComponents/AutocompleteField';
import { useForm } from "react-hook-form";
import SLAutocomplete from '../../CoreComponents/SLAutocomplete';
import GeneratedBillsList from '../../pages/Bills/GeneratedBillsList';

const visitServiceTableHeaders = [{
    name: 'Service Name',
    width: '25%'
}, {
    name: 'Price',
    width: '10%'
}, {
    name: 'Qty',
    width: '10%'
}, {
    name: 'Discount',
    width: '15%'
}, {
    name: 'GST',
    width: '10%'
},{
    name: 'Total Amount',
    width: '15%'
}]

const VisitServiceList = forwardRef((props, ref) => {
    const [visitServiceList, setVisitServiceList] = React.useState([]);
    const [visitdiscount, setVisitdiscount] = React.useState(0);
    const [visitpercentage, setVisitpercentage] = React.useState(0);
    const [totalAmount, setTotalAmount] = React.useState();
    const [visittotalamount, setVisittotalamount] = React.useState();
    const [serviceoptions, setServiceOptions] = React.useState([]);
    const [visitId, setVisitId] = React.useState("");
    const [paidAmount, setPaidAmount] = React.useState(0);
    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({

    });
    useImperativeHandle(ref, () => ({
        getVisistsList() {
            return { visitServiceList, visitdiscount, visittotalamount, visitpercentage }  // Return all form values from the child form
        },
        setVisitServiceList(data) {
            let { visitServiceList, visitdiscount, visittotalamount, visitpercentage } = data;
            setVisitId(data.visitId);
            let billNotGeneratedServices = [];
            visitServiceList.forEach(servce => {
                if (!servce.billId) {
                    billNotGeneratedServices.push(servce);
                }
            })
            setVisitServiceList(billNotGeneratedServices);
            setVisitdiscount(visitdiscount);
            setVisittotalamount(visittotalamount);
            setVisitpercentage(visitpercentage);
        }
    }));
    useEffect(() => {
        updateTotalAmount();
    }, [visitServiceList]);

    function setChangesToVisistServicelist(data, index, key) {
        let copyVisitServiceData = [...visitServiceList];
        copyVisitServiceData[index][key] = data;
        
        let {totalAmountAfterDiscount,gstAmount} = calParticularServiceTotalAmount(copyVisitServiceData[index]);
        copyVisitServiceData[index]['servicetotalamount'] = totalAmountAfterDiscount;
        if(gstAmount){
            copyVisitServiceData[index]['gstAmount'] = gstAmount;
        }
        copyVisitServiceData = calPercentage(data, index, key);
        setVisitServiceList(copyVisitServiceData);
        updateTotalAmount();
    }
    function updateTotalAmount() {
        let copyVisitServiceData = [...visitServiceList];
        let totalAmount = 0;
        copyVisitServiceData.forEach(item => {
            let {totalAmountAfterDiscount} = calParticularServiceTotalAmount(item);
            totalAmount = totalAmount + totalAmountAfterDiscount;
        });
        let afterDiscount = totalAmount - visitdiscount;
        setVisittotalamount(afterDiscount);
        setPaidAmount(afterDiscount);
        setTotalAmount(totalAmount);
    }

    function setTotalAmountAfterDiscountFun(discountAmount) {
        var aftertotalAmount = totalAmount - discountAmount;
        setVisittotalamount(aftertotalAmount);
        setPaidAmount(aftertotalAmount);
    }

    function calParticularServiceTotalAmount(data) {
        let totalAmount = Number(data.serviceprice) * Number(data.quantity);
        let totalAmountAfterDiscount = totalAmount - data.servicediscount;
        let gstAmount = 0;
        if(data.gst){
            gstAmount = calculateGSTAmount(totalAmountAfterDiscount,data.gst);
            totalAmountAfterDiscount = totalAmountAfterDiscount + gstAmount;
        }
        return {"totalAmountAfterDiscount" : totalAmountAfterDiscount,"gstAmount":gstAmount}
    }
    function calculateGSTAmount(originalPrice, gstPercentage) {
        return originalPrice * (gstPercentage / 100);
    }
    function calDiscountBasedonPercentage(data, index) {
        let copyVisitServiceData = [...visitServiceList];
        copyVisitServiceData[index]["servicediscountinpercentage"] = data;
        let cuurentData = copyVisitServiceData[index];
        let discount = (Number(cuurentData.quantity) * Number(cuurentData.serviceprice)) * (100 - Number(data)) / 100;
        discount = (Number(cuurentData.quantity) * Number(cuurentData.serviceprice)) - discount;
        copyVisitServiceData[index]["servicediscount"] = discount;
        setVisitServiceList(copyVisitServiceData);

    }
    function calVisitDiscountAmountBAsedonPercentage(value) {
        let copyVisistamount = totalAmount;
        let discount = (copyVisistamount) * (100 - Number(value)) / 100;
        discount = copyVisistamount - discount;
        setVisitdiscount(discount);
    }

    function calPercentageBasedOnDiscount(value) {
        let copyVisistamount = totalAmount;
        var percentage = (Number(value) / (copyVisistamount)) * 100;
        setVisitpercentage(percentage.toFixed(2));
    }
    function calPercentage(data, index, key) {
        let copyVisitServiceData = [...visitServiceList];
        var cuurentData = copyVisitServiceData[index];
        var percentage = (Number(cuurentData.servicediscount) / (Number(cuurentData.quantity) * Number(cuurentData.serviceprice))) * 100;
        cuurentData.servicediscountinpercentage = percentage.toFixed(2);
        copyVisitServiceData[index] = cuurentData;
        return copyVisitServiceData;
    }
    function addServicetoList(newService) {
        var obj = {
            serviceid: newService,
            serviceprice: newService.price,
            servicediscount: 0,
            servicediscountinpercentage: 0,
            quantity: 1,
            servicetotalamount: newService.price * 1,
            gst:newService.gst,
            gstAmount:0
        }
        let {totalAmountAfterDiscount,gstAmount} = calParticularServiceTotalAmount(obj);
        obj.servicetotalamount = totalAmountAfterDiscount;
        if(gstAmount){
            obj.gstAmount = gstAmount;
        }
        let copyList = [...visitServiceList];
        copyList.push(obj);
        setVisitServiceList(copyList);
    }

    async function getServiceMaterList(value) {
        if (!value)
            return false;
        var payLoad = {
            method: APIS.GET_SERVICE_MASTER_DATA_BASED_SERVICENAME.METHOD,
            url: APIS.GET_SERVICE_MASTER_DATA_BASED_SERVICENAME.URL,
            paramas: [value]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setServiceOptions(result)
        }
    }

    return (
        <Box sx={{ flexGrow: 1, m: 1 }}>
            <Grid xs={12} container spacing={1}>
                <Grid item xs={3} spacing={1}>
                    <FormControl variant="outlined" fullWidth>
                        <AutocompleteField
                            name="serviceValues"
                            label={Translations.visitCreation.addServices}
                            control={control}
                            options={serviceoptions}
                            placeholder={Translations.visitCreation.addServices}
                            mapvalues={{ id: "serviceid", value: 'servicename' }}
                            isMultiSelect={false}
                            id={"service-controllable-states-demo"}
                            onchangeEventCallBack={(newValue) => {
                                addServicetoList(newValue);
                            }}
                            onInputChange={(data) => {
                                if (data.length > 3) {
                                    getServiceMaterList(data)
                                }
                            }}
                        />
                    </FormControl>
                </Grid>
            </Grid>
            <Box sx={{ flexGrow: 1, m: 1 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                {(visitServiceTableHeaders.map(header => {
                                    return (
                                        <TableCell key={header.name} width={header.width}>{header.name}</TableCell>
                                    )
                                }))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visitServiceList && visitServiceList.map((service, index) => (
                                <TableRow key={index}>
                                    <TableCell>{(service && service.serviceid) ? service.serviceid.servicename : ""}</TableCell>
                                    <TableCell>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            className='input_background'
                                            type="text"
                                            onChange={(e) => {
                                                setChangesToVisistServicelist(e.target.value, index, 'serviceprice')
                                            }}
                                            label={"Price"}
                                            size="small"
                                            value={service.serviceprice}
                                        />
                                    </TableCell>
                                    <TableCell >
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            className='input_background'
                                            type="text"
                                            label={"Qty"}
                                            onChange={(e) => {
                                                setChangesToVisistServicelist(e.target.value, index, 'quantity')
                                            }}
                                            value={service.quantity}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell >
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                className='input_background'
                                                type="text"
                                                label={"Discount"}
                                                onChange={(e) => {
                                                    setChangesToVisistServicelist(e.target.value, index, 'servicediscount')
                                                }}
                                                value={service.servicediscount}
                                                size="small"
                                            />
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                className='input_background'
                                                type="text"
                                                label={"%"}
                                                sx={{ ml: 1 }}
                                                onBlur={(e) => {
                                                    let copyVisitServiceData = [...visitServiceList];
                                                    let discountValue = copyVisitServiceData[index].servicediscount;
                                                    setChangesToVisistServicelist(discountValue, index, 'servicediscount');
                                                }}
                                                onChange={(e) => {
                                                    calDiscountBasedonPercentage(e.target.value, index);
                                                }}
                                                value={service.servicediscountinpercentage}
                                                size="small"
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell >
                                        <TextField
                                            disabled
                                            fullWidth
                                            variant="outlined"
                                            className='input_background'
                                            type="text"
                                            label={"GST"}
                                            onChange={(e) => {
                                                //setChangesToVisistServicelist(e.target.value, index, 'quantity')
                                            }}
                                            value={service.gstAmount}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{service.servicetotalamount}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow key={"12111"}>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>Total Amount(before discount)</TableCell>
                                <TableCell>{totalAmount}</TableCell>
                            </TableRow>
                            <TableRow key={"323"}>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>Discount Amount</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            className='input_background'
                                            type="text"
                                            label={"Discount"}
                                            onChange={(e) => {
                                                setVisitdiscount(e.target.value);
                                                setTotalAmountAfterDiscountFun(e.target.value);
                                                calPercentageBasedOnDiscount(e.target.value);
                                            }}
                                            value={visitdiscount}
                                            size="small"
                                        />
                                        <TextField
                                            fullWidth
                                            variant="outlined"
                                            className='input_background'
                                            type="text"
                                            label={"%"}
                                            onBlur={(e) => {
                                                setTotalAmountAfterDiscountFun(visitdiscount);
                                            }}
                                            onChange={(e) => {
                                                setVisitpercentage(e.target.value);
                                                calVisitDiscountAmountBAsedonPercentage(e.target.value);
                                                //setTotalAmountAfterDiscountFun(e.target.value)
                                            }}
                                            value={visitpercentage}
                                            size="small"
                                        />
                                    </Box>
                                </TableCell>
                            </TableRow>
                            <TableRow key={"123545111"}>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>Total Amount(after discount & GST)</TableCell>
                                <TableCell>{visittotalamount}</TableCell>
                            </TableRow>
                            <TableRow key={"123545111"}>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                    <TextField
                                            fullWidth
                                            variant="outlined"
                                            className='input_background'
                                            type="text"
                                            label={"Paid Amount"}
                                            onBlur={(e) => {
                                                //setTotalAmountAfterDiscountFun(visitdiscount);
                                            }}
                                            onChange={(e) => {
                                                setPaidAmount(e.target.value);
                                               // calVisitDiscountAmountBAsedonPercentage(e.target.value);
                                                //setTotalAmountAfterDiscountFun(e.target.value)
                                            }}
                                            value={paidAmount}
                                            size="small"
                                        /></TableCell>
                            </TableRow>
                        </TableBody>

                    </Table>

                </TableContainer>
            </Box>
            <Box sx={{ flexGrow: 1, m: 1 }}>
                {visitId && <GeneratedBillsList visitId={visitId} />}
            </Box>
        </Box>
    );
});
VisitServiceList.displayName = "VisitServiceList";
export default VisitServiceList;