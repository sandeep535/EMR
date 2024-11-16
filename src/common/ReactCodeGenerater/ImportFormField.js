import React, { lazy } from 'react';


export const ImportFormField = (type) => {
  switch (type) {
    case 'SLTextField':
      return lazy(() => import('../../CoreComponents/SLTextField'));
    case 'SLAutocomplete':
      return lazy(() => import('../../CoreComponents/SLAutocomplete'));
    case 'SLRadioButton':
      return lazy(() => import('../../CoreComponents/SLRadioButton'));
    case 'SLSelectDropDown':
      return lazy(() => import('../../CoreComponents/SLSelectDropDown'));
    case 'SLTitle':
      return lazy(() => import('../../CoreComponents/SLTitle'));
    case 'SLCheckbox':
        return lazy(() => import('../../CoreComponents/SLCheckbox'));
    case 'CustomDataGrid':
          return lazy(() => import('../../common/DataGrid/CustomDataGrid'));
    default:
      return null;
  }
};
