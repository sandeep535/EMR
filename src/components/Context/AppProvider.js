import AppContext from './AppContext';
import { useState } from 'react';

export default function AppProvider(props) {
    const [showLoader, setShowLoader] = useState(false);
    const [selectedVisitDeatils, setSelectedVisitDeatils] = useState([]);
    const [loggedInUserDetails, setLoggedInUserDetails] = useState({});
    const [isLogin, setIslogin] = useState(false);

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
                }
            }
        }>
            {props.children}
        </AppContext.Provider>
    );
}