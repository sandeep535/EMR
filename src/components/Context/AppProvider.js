import AppContext from './AppContext';
import { useState } from 'react';

export default function AppProvider( props ) {
    const [showLoader, setShowLoader] = useState(false);
    return (
        <AppContext.Provider value={
            {
               showLoader:showLoader,
               setShowLoader :(flag)=>{
                    setShowLoader(flag)
               }
            }
        }>
                {props.children}
        </AppContext.Provider>
    );
}