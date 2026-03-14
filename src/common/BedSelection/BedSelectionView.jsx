import React from "react";
import { Card, CardActionArea, Box, Typography, Grid } from "@mui/material";
import BedIcon from "@mui/icons-material/Hotel";

const BedCard = ({ bed, selected, onClick }) => {
  if (!bed) return null;

  const isFree = bed.isOccupied === null;
  const iconColor = isFree ? "success.main" : "error.main";

  return (
    <Card
      sx={{
        width: 120,
        borderRadius: 3,
        boxShadow: selected ? 6 : 2,
        border: selected ? "2px solid #1976d2" : "2px solid transparent",
        textAlign: "center",
        cursor: "pointer",
        transition: "0.2s",
      }}
      onClick={() => onClick && onClick(bed)}
    >
      <CardActionArea sx={{ p: 2 }}>
        <BedIcon sx={{ fontSize: 40, color: iconColor }} />
        <Typography variant="body2" fontWeight={600} mt={1}>
          {bed.name}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const BedSelectionView = ({ bed = [] }) => {
  if (!bed || bed.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No beds selected
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" mb={2}>
        Selected Beds ({bed.length})
      </Typography>
      <Grid container spacing={2}>
        {bed.map((bedItem, index) => (
          <Grid item key={bedItem.id || index}>
            <BedCard bed={bedItem} selected={true} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BedSelectionView;
export { BedCard };
