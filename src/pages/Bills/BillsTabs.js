import React from "react";
import BillsList from "./BillsList";
import Paymemts from "../Paymemts/Paymemts";
import SLTabs from "../../CoreComponents/SLTabs";

const BillsTabs = () => {
  const tabLabels = ["Bills", "Paymemnts"];
  const tabContents = [
    <React.Fragment key="bills">
      <BillsList />
    </React.Fragment>,
    <React.Fragment key="payments">
      <Paymemts />
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
