import axios from 'axios';
import serviceDetails from '../../Utils/Service';

export const sendRequest = async payload => {
    console.log("Sending request:", payload);
    let serverUrl = serviceDetails.SERVICE_URL;
    if (payload.method == "GET") {
        let subURL = appendGetVariblesToUrl(payload.url, payload.paramas);
        serverUrl = serverUrl + subURL;
    }else{
         let subURL = appendGetVariblesToUrl(payload.url, payload.paramas);
         serverUrl = serviceDetails.SERVICE_URL +subURL;
    }
    var headers =  {
        'content-type': (payload.isMultiContent) ? '' :'application/json', 
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
       // throw error;
    }
};

function appendGetVariblesToUrl(url,paramas) {
    return url.replace(/{(\d+)}/g,
        function (findMatch, count) {
            return typeof paramas[count] != 'undefined' ? paramas[count] : findMatch;
        });
}