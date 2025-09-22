import React from 'react';
import { Box, Card, CardActionArea, CardContent, Chip, Grid, Typography, TextField, ToggleButton, ToggleButtonGroup, Stack } from '@mui/material';

// bed shape expected: { id, name, bedCost, isOccupied (null => free, false => occupied), location?: { block, ward, room } }
const BedGrid = ({ beds = [], onSelect, selectedId, enableSearch = true, showFilters = true }) => {
  const [query, setQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all'); // all | free | occupied

  const filtered = React.useMemo(() => {
    return beds.filter(b => {
      const matchesQuery = !query || (b.name?.toLowerCase().includes(query.toLowerCase()));
      const occupied = b.isOccupied === null ? false : (b.isOccupied === false ? true : false);
      const statusOk = statusFilter === 'all' || (statusFilter === 'free' && !occupied) || (statusFilter === 'occupied' && occupied);
      return matchesQuery && statusOk;
    });
  }, [beds, query, statusFilter]);

  const renderStatus = (b) => {
    if (b.isOccupied === null) return <Chip size="small" label="Free" color="success" />;
    if (b.isOccupied === false) return <Chip size="small" label="Occupied" color="error" />;
    return <Chip size="small" label="Unknown" variant="outlined" />;
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
        {enableSearch && (
          <TextField
            size="small"
            placeholder="Search beds..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        {showFilters && (
          <ToggleButtonGroup
            size="small"
            exclusive
            value={statusFilter}
            onChange={(e, val) => val && setStatusFilter(val)}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="free">Free</ToggleButton>
            <ToggleButton value="occupied">Occupied</ToggleButton>
          </ToggleButtonGroup>
        )}
      </Stack>

      <Grid container spacing={2}>
        {filtered.map((b) => {
          const isSelected = selectedId != null && String(selectedId) === String(b.id);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={b.id}>
              <Card sx={{ borderRadius: 2, boxShadow: isSelected ? 6 : 2, border: isSelected ? '2px solid #1976d2' : '1px solid #eee' }}>
                <CardActionArea onClick={() => onSelect && onSelect(b)}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle2" fontWeight={700} noWrap>{b.name}</Typography>
                      {renderStatus(b)}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Cost: {b.bedCost ?? '-'}
                    </Typography>
                    {b.location && (
                      <Typography variant="caption" display="block" mt={0.5} color="text.secondary">
                        {b.location.block} {b.location.ward ? `• ${b.location.ward}` : ''} {b.location.room ? `• ${b.location.room}` : ''}
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
        {!filtered.length && (
          <Grid item xs={12}>
            <Typography align="center" variant="body2" color="text.secondary">No beds found</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BedGrid; 