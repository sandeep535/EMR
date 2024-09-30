import React, { useState, useEffect } from 'react';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import Translations from '../../resources/translations';
import CommonCard from '../../common/CommonCard';
import CustomDataGrid from '../../common/DataGrid/CustomDataGrid';

const serviceListHeaders = [{
  name: Translations.SERVICE_MASTER.SERVICE_NAME,
  datakey: 'servicename',
  width: '20%'
}, {
  name: Translations.SERVICE_MASTER.PRICE,
  datakey: 'price',
  width: '20%'
}, {
  name: Translations.SERVICE_MASTER.STATUS,
  width: '10%',
  datakey: 'active',
  mappingData: { 1: "Active", 2: "In-active" }
},{
  name: Translations.SERVICE_MASTER.ACTIONS,
  width: '10%',
  isActions: true,
  actions: [{
      icon: 'edit'
  }]
}]
export default function ServiceMasterList(props) {
  const [serviceMasterList, setServiceMasterList] = useState([]);

  useEffect(() => {
    getAllMasterData(0);
  }, []);

  async function getAllMasterData(number) {
    var payLoad = {
      method: APIS.GET_ALL_SERVICE_MASTER_DATA.METHOD,
      url: APIS.GET_ALL_SERVICE_MASTER_DATA.URL,
      paramas: [number, 10]
    }
    let result = await sendRequest(payLoad);
    if (result) {
      setServiceMasterList(result)
    }
  }
  function openServiceEditmode(row, action){
    props.openServiceEditmode(row, action);
  }

  return (
    <>
      <CommonCard title={Translations.SERVICE_MASTER.SERVICE_MASTER_LIST}>
        <CustomDataGrid tableHeaders={serviceListHeaders} tableData={serviceMasterList} totalcount={'100'} rowsPerPage={10} paginationChangeEvent={(number) => {
          getAllMasterData(number)
        }} triggerEvent={(row, action) => {
          openServiceEditmode(row, action);
        }}></CustomDataGrid>
      </CommonCard>

    </>
  )
}

