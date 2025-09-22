import React from "react";
import { Card, CardActionArea, Box, Typography } from "@mui/material";
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

export default BedCard;
