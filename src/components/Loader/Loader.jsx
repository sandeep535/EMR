import React, { useState, useEffect } from 'react';
import { Hourglass } from 'react-loader-spinner'
import axios from 'axios';

export default function Loader() {
    useEffect(() => {
        axios.interceptors.request.use(
            config => {
                setShowLoader(true);
                return config
            },
            error => {
                setShowLoader(false);
                Promise.reject(error)
            }
        )
        axios.interceptors.response.use(
            response => {
                setShowLoader(false);
                return response
            },
            function (error) {
                setShowLoader(false);
                return Promise.reject(error)
            }
        )
    }, []);

    const [showLoader, setShowLoader] = useState(false);
    return (
        <div style={{ position: 'fixed', left: '50%', top: '50%' }}>
            <Hourglass
                visible={showLoader}
                height="80"
                width="80"
                ariaLabel="hourglass-loading"
                wrapperStyle={{}}
                wrapperClass=""
                colors={['#306cce', '#72a1ed']}
            />
        </div>


    );
}
