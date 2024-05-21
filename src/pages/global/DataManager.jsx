import axios from 'axios';
import serviceDetails from '../../Utils/Service';

export const sendRequest = async payload => {
    
    let serverUrl = serviceDetails.SERVICE_URL;
    if (payload.method == "GET") {
        let subURL = appendGetVariblesToUrl(payload.url, payload.paramas);
        serverUrl = serverUrl + subURL;
        console.log("--------------",serverUrl);
    }else{
         serverUrl = serviceDetails.SERVICE_URL + payload.url;
    }
    var headers =  {
        'content-type': 'application/json', 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        "X-TenantID" : sessionStorage.getItem("tenant"),
     }
    if(payload.url != 'auth/signin'){
        headers.Authorization="Bearer "+sessionStorage.getItem("token");
    }
    try {
        const response = await axios(serverUrl, {
            crossdomain: true,
            method: payload.method,
            headers: headers,
            data: payload.data,
        });
        return response.data;
    } catch (error) {
        console.log("----------------error",error)
       // throw error;
    }
};

function appendGetVariblesToUrl(url,paramas) {
    return url.replace(/{(\d+)}/g,
        function (findMatch, count) {
            return typeof paramas[count] != 'undefined' ? paramas[count] : findMatch;
        });
}