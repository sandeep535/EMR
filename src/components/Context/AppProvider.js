import AppContext from './AppContext';
import { useState } from 'react';
import LeftMenu from '../../common/LeftMenu';

export default function AppProvider(props) {
    const [showLoader, setShowLoader] = useState(false);
    const [selectedVisitDeatils, setSelectedVisitDeatils] = useState([]);
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [isLogin, setIslogin] = useState(false);
    const [leftMenuList, setLeftMenuList] = useState(LeftMenu);

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
                isLogin:isLogin,
                setIslogin:(flag)=>{
                    setIslogin(flag)
                },
                leftMenuList:leftMenuList,
                setLeftMenuList:(data)=>{
                    setLeftMenuList(data)
                }
            }
        }>
            {props.children}
        </AppContext.Provider>
    );
}