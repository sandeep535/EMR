import AppContext from './AppContext';
import { useState } from 'react';

export default function AppProvider(props) {
    const [showLoader, setShowLoader] = useState(false);
    const [selectedVisitDeatils, setSelectedVisitDeatils] = useState([]);

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
                }
            }
        }>
            {props.children}
        </AppContext.Provider>
    );
}