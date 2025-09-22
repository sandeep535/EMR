import React from 'react';
import { Box } from '@mui/material';
import APIS from '../../Utils/APIS';
import { sendRequest } from '../../pages/global/DataManager';
import SLSelectDropDown from '../../CoreComponents/SLSelectDropDown';

const BedSelection = ({ onChange, labelPrefix = 'Select', initialParentId = -999 }) => {
  const [levels, setLevels] = React.useState([]); // [{ options, value, parentId } ...]

  React.useEffect(() => {
    loadLevel(initialParentId, 0);
  }, [initialParentId]);

  async function fetchByParent(parentId) {
    const payLoad = { method: APIS.GET_INST_BASED_PARENT.METHOD, url: APIS.GET_INST_BASED_PARENT.URL, paramas: [parentId] };
    const data = await sendRequest(payLoad);
    console.log("ssss",data)
    return Array.isArray(data) ? data : [];
  }

  async function loadLevel(parentId, levelIndex) {
    const options = await fetchByParent(parentId);

    const first = options[0];
    const isBedFlag = (item) => !!(item && (item.isBed || item.bed));

    if (isBedFlag(first)) {
      if (onChange) onChange(first);
      return; // do not render a dropdown for bed
    }

    setLevels(prev => {
      const next = prev.slice(0, levelIndex);
      next[levelIndex] = { options, value: null, parentId };
      return [...next];
    });
  }

  const getMapValues = React.useCallback(() => ({ id: 'id', value: 'name' }), []);

  const handleSelect = async (levelIndex, selected) => {
    if (selected?.isBed || selected?.bed) {
      if (onChange) onChange(selected);
      setLevels(prev => prev.slice(0, levelIndex));
      return;
    }

    setLevels(prev => {
      const next = [...prev];
      next[levelIndex] = { ...next[levelIndex], value: selected };
      return next.slice(0, levelIndex + 1);
    });

    if (selected && selected.id != null) {
      await loadLevel(selected.id, levelIndex + 1);
    }
  };

  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={2}>
      {levels.map((lvl, idx) => (
        <Box key={idx} sx={{ minWidth: 260, flex: '0 0 auto' }}>
          <SLSelectDropDown
            label={`${labelPrefix} ${idx + 1}`}
            options={lvl.options}
            mapvalues={getMapValues()}
            value={lvl.value}
            onChange={(opt) => handleSelect(idx, opt)}
          />
        </Box>
      ))}
    </Box>
  );
};

export default BedSelection; 