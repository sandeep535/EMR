import React, { useEffect, useState, useContext, useRef } from 'react';
import APIS from './APIS';
import { sendRequest } from '../pages/global/DataManager';
import EMRAlert from './CustomAlert';

export const generateBill = async (visitid,clientId) => {
    var payLoad = {
      method: APIS.GENERATE_BILL.METHOD,
      url: APIS.GENERATE_BILL.URL,
      paramas: [],
      data: {
        visitid: visitid,
        clientId: clientId
      }
    }
    let result = await sendRequest(payLoad);
    if (result && result) {
        EMRAlert.alertifySuccess("Bill generated Succussfully");
        return {status:"succuss",result:result}
    //   EMRAlert.alertifySuccess("Bill generated Succussfully");
    //   setPopupOpen(false)
    } else {
        EMRAlert.alertifySuccess("Bill not generated");
        return {status:"error"}
    }
  }