import AppContext from './AppContext';
import { useState } from 'react';
import LeftMenu from '../../common/LeftMenu';

export default function AppProvider(props) {
    const [showLoader, setShowLoader] = useState(false);
    const [selectedVisitDeatils, setSelectedVisitDeatils] = useState([]);
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [loggedInRolesTaks, setLoggedInRolesTaks] = useState({});
    const [isLogin, setIslogin] = useState(false);
    const [leftMenuList, setLeftMenuList] = useState([]);

    const [tenant, setTenant] = useState("");
    const [selectedLeftMenuItem, setSelectedLeftMenuItem] = useState("");

    return (
        <AppContext.Provider value={
            {
                showLoader: showLoader,
                setShowLoader: (flag) => {
                    setShowLoader(flag)
                },
                selectedVisitDeatils: selectedVisitDeatils,
                setSelectedVisitDeatils: (data) => {
                    setSelectedVisitDeatils(data);
                },
                loggedInUserDetails:loggedInUserDetails,
                setLoggedInUserDetails:(data) =>{
                    setLoggedInUserDetails(data);
                },
                loggedInRolesTaks:loggedInRolesTaks,
                setLoggedInRolesTaks:(data) =>{
                    setLoggedInRolesTaks(data);
                },
                isLogin:isLogin,
                setIslogin:(flag)=>{
                    setIslogin(flag)
                },
                leftMenuList:leftMenuList,
                setLeftMenuList:(data)=>{
                    setLeftMenuList(data)
                },
                tenant:tenant,
                setTenant:(data)=>{
                    setTenant(data);
                },
                selectedLeftMenuItem:selectedLeftMenuItem,
                setSelectedLeftMenuItem:(data)=>{
                    setSelectedLeftMenuItem(data);
                },
            }
        }>
            {props.children}
        </AppContext.Provider>
    );
}