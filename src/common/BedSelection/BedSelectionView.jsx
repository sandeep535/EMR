import React, { useState } from "react";
import { Card, CardActionArea, Box, Typography, Grid } from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";

const BedCard = ({ bed, selected, onClick }) => {
  if (!bed) return null;

  const isOccupied = bed.isOccupied === true;
  const bedColor = isOccupied ? "#f0776c" : "#1abc9c";

  return (
    <Card
      sx={{
        width: 120,
        borderRadius: 3,
        boxShadow: selected ? 6 : 2,
        border: selected ? "2px solid #1976d2" : `2px solid ${bedColor}`,
        textAlign: "center",
        cursor: isOccupied ? "not-allowed" : "pointer",
        transition: "0.2s",
        opacity: isOccupied ? 0.6 : 1,
        bgcolor: selected ? "#e3f2fd" : "background.paper",
      }}
      onClick={() => !isOccupied && onClick && onClick(bed)}
    >
      <CardActionArea sx={{ p: 2 }} disabled={isOccupied}>
        <BedIcon sx={{ fontSize: 40, color: bedColor }} />
        <Typography variant="body2" fontWeight={600} mt={1}>
          {bed.name}
        </Typography>
        <Typography variant="caption" sx={{ color: bedColor }}>
          {isOccupied ? "Occupied" : "Available"}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const BedSelectionView = ({ bed = [], onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);

  function handleBedClick(bedItem) {
    setSelectedId(bedItem.id);
    if (onSelect) onSelect(bedItem);
  }

  if (!bed || bed.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No beds available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#1abc9c' }} />
          <Typography variant="caption">Available</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f0776c' }} />
          <Typography variant="caption">Occupied</Typography>
        </Box>
      </Box>
      <Grid container spacing={2}>
        {bed.map((bedItem, index) => (
          <Grid item key={bedItem.id || index}>
            <BedCard
              bed={bedItem}
              selected={selectedId === bedItem.id}
              onClick={handleBedClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BedSelectionView;
export { BedCard };
