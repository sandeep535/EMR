
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { sendRequest } from '../global/DataManager';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import APIS from '../../Utils/APIS';
import EMRAlert from '../../Utils/CustomAlert';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import Translations from '../../resources/translations';
import TextField from '@mui/material/TextField';

export default function RoleAndTasks(props) {
    const [rolesState, setRolesState] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [role, setRole] = useState('');

    function isParentShouldCheckornot(currentRole, index) {
        var rolesStateCopy = [...rolesState];
        var subScreens = rolesStateCopy[index].subScreens;
        var isAllCheck = true;
        subScreens.forEach(subScreen => {
            if (!subScreen.ispermission) {
                isAllCheck = false;
            }
        });
        return isAllCheck;
    }
    async function getRoleMasterData() {
        var payLoad = {
            method: APIS.GET_MASTER_DATA_BASED_ON_CODE.METHOD,
            url: APIS.GET_MASTER_DATA_BASED_ON_CODE.URL,
            paramas: ["ROLE"]
        }
        let result = await sendRequest(payLoad);
        if (result) {
            setRolesList(result);
            fetchRolesTransData();
        }
    }
    function isIndeterminate(currentRole, index) {
        var rolesStateCopy = [...rolesState];
        var subScreens = rolesStateCopy[index].subScreens;
        var isAllCheck = false;
        subScreens.forEach(subScreen => {
            if (subScreen.ispermission) {
                isAllCheck = true;
            }
        });
        return isAllCheck;
    }
    const handleParentChange = (role, index, newValue) => {
        var rolesStateCopy = [...rolesState];
        rolesStateCopy.ispermission = newValue;
        rolesStateCopy[index].subScreens.forEach(subScreen => {
            subScreen.ispermission = newValue;
        });
        setRolesState(rolesStateCopy);
    };
    const handleChildpermissions = (subRole, subIndex, subroleNewvalue, mainRole, mainIndex) => {
        var rolesStateCopy = [...rolesState];
        rolesStateCopy[mainIndex].subScreens[subIndex].ispermission = subroleNewvalue;
        setRolesState(rolesStateCopy);
    }
    async function fetchRolesTransData(roleid) {
        let roleidcopy = (roleid) ? roleid : role.id;
        var payLoad = {
            method: APIS.GET_ROLES_TASKS_TRANS_ROLEID.METHOD,
            url: APIS.GET_ROLES_TASKS_TRANS_ROLEID.URL,
            paramas: [roleidcopy]
        }
        let result = await sendRequest(payLoad);
        if (result && result.size != 0) {
            debugger
            let roleIds = [];
            var finalResult = [];
            for (var i = 0; i < result.length; i++) {
                var obj = [];
                if (roleIds.indexOf(result[i]["screencode"]) == -1) {
                    var obj = {
                        screenName: result[i].screenname,
                        screencode: result[i].screencode,
                        ispermission: true,
                        subScreens: [result[i]]
                    }
                    roleIds.push(result[i]["screencode"]);
                    finalResult.push(obj);
                } else {
                    var currentIndex = roleIds.indexOf(result[i]["screencode"]);
                    finalResult[currentIndex].subScreens.push(result[i]);
                }
            }
            setRolesState(finalResult);
        } else {
            setRolesState([]);
        }
    }
    async function saveRolesAndTaskData() {
        let stateCopyData = [...rolesState];
        let resultData = [];
        for (var i = 0; i < stateCopyData.length; i++) {
            if (stateCopyData[i].subScreens.length != 0) {
                for (var j = 0; j < stateCopyData[i].subScreens.length; j++) {
                    var obj = {
                        roletaskactionid: stateCopyData[i].subScreens[j].roletaskactionid,
                        taskid: stateCopyData[i].subScreens[j].taskid,
                        roleid: role.id,
                        ispermission: stateCopyData[i].subScreens[j].ispermission,
                        status: stateCopyData[i].subScreens[j].status
                    }
                    resultData.push(obj);
                }
            }
        }
        var payLoad = {
            method: APIS.SAVE_ROLES_TASKS.METHOD,
            url: APIS.SAVE_ROLES_TASKS.URL,
            paramas: [],
            data: resultData
        }
        let result = await sendRequest(payLoad);
        if (result) {
            EMRAlert.alertifySuccess("Roles saved succussfully");
            fetchRolesTransData();
        } else {
            EMRAlert.alertifyError("Error");
        }
        debugger
    }

    useEffect(() => {
        getRoleMasterData();

    }, []);
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <FormControl variant="outlined" fullWidth>
                    <Autocomplete
                        size="small"
                        disablePortal
                        id="combo-box-demo"
                        options={rolesList}
                        key={option => option.id}
                        getOptionLabel={option => option.masterdatavalue}
                        value={role}
                        onChange={(event, newValue) => {
                            setRole(newValue);
                            fetchRolesTransData(newValue.id);
                        }}
                        renderOption={(props, option) => {
                            return (
                                <li {...props} key={option.id}>
                                    {option.masterdatavalue}
                                </li>
                            );
                        }}
                        renderInput={(params) => <TextField {...params} label={Translations.employeeRegistration.role} />}
                    />
                </FormControl>
                {rolesState && rolesState.map((role, index) => {
                    return (
                        <>
                            <FormControlLabel
                                label={role.screenName}
                                control={
                                    <Checkbox
                                        checked={isParentShouldCheckornot(role, index)}
                                        indeterminate={isIndeterminate(role, index) && !isParentShouldCheckornot(role, index)}
                                        onChange={(event, newValue) => {
                                            handleParentChange(role, index, newValue);
                                        }}
                                    />
                                }
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                                {role && role.subScreens.map((subrole, subindex) => {
                                    return (
                                        <>
                                            <FormControlLabel
                                                label={subrole.actionname}
                                                control={
                                                    <Checkbox
                                                        checked={subrole.ispermission}
                                                        onChange={(event, newValue) => {
                                                            handleChildpermissions(subrole, subindex, newValue, role, index);
                                                        }} />
                                                }
                                            />
                                        </>
                                    )
                                })}
                            </Box>

                        </>
                    )
                })}
                <Box display="flex" justifyContent="center" mt="20px">
                    <Button type="button" color="primary" variant="contained" onClick={() => {
                        saveRolesAndTaskData();
                    }}>
                        {"Save"}
                    </Button>


                </Box>
            </Box>
        </>
    )
}
