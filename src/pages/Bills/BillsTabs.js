import React from "react";
import BillsList from "./BillsList";
import Paymemts from "../Paymemts/Paymemts";
import SLTabs from "../../CoreComponents/SLTabs";

const BillsTabs = ({ clientId }) => {
  const tabLabels = ["Bills", "Paymemnts"];
  const tabContents = [
    <React.Fragment key="bills">
      <BillsList clientId={clientId}/>
    </React.Fragment>,
    <React.Fragment key="payments">
      <Paymemts clientId={clientId}/>
    </React.Fragment>,
  ];
  // const tabContents = [
  //   <BillsList />,
  //   <Paymemts />,
  // ];

  return (
    <div>
      <SLTabs tabLabels={tabLabels} tabContents={tabContents} />
    </div>
  );
};

export default BillsTabs;
