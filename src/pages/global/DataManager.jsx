import axios from 'axios';
import serviceDetails from '../../Utils/Service'

export const sendRequest = async payload => {
    let serverUrl = serviceDetails.SERVICE_URL;
    if (payload.method == "GET") {
        let subURL = appendGetVariblesToUrl(payload.url, payload.paramas);
        serverUrl = serverUrl + subURL;
        console.log("--------------",serverUrl);
    }else{
         serverUrl = serviceDetails.SERVICE_URL + payload.url;
    }
    try {
        const response = await axios(serverUrl, {
            crossdomain: true,
            method: payload.method,
            headers: {
               'content-type': 'application/json', 
               "Access-Control-Allow-Origin": "*",
               "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            },
            data: payload.data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

function appendGetVariblesToUrl(url,paramas) {
    return url.replace(/{(\d+)}/g,
        function (findMatch, count) {
            return typeof paramas[count] != 'undefined' ? paramas[count] : findMatch;
        });
}