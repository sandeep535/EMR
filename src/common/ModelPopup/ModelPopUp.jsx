import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Box, Typography, Button, Slide
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ModelPopUp = ({ open, isOpen, handleClose, handleConfirm, title, children, maxWidth = 'md' }) => {
  const isOpen_ = open ?? isOpen ?? false;
  const isConfirmMode = !!handleConfirm;

  return (
    <Dialog
      open={isOpen_}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ p: 0 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          px: 2.5, py: 1.5,
          bgcolor: '#673AB7',
          color: '#fff',
        }}>
          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#fff' }}>
            {title || (isConfirmMode ? 'Confirm' : '')}
          </Typography>
          {handleClose && (
            <IconButton size="small" onClick={handleClose}
              sx={{ color: '#fff', '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' } }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ px: 2.5, py: 2, mt: isConfirmMode ? 0 : 0 }}>
        {isConfirmMode ? (
          <Typography variant="body2" sx={{ pt: 1 }}>
            Are you sure you want to logout?
          </Typography>
        ) : children}
      </DialogContent>

      {/* Actions — only for confirm mode */}
      {isConfirmMode && (
        <DialogActions sx={{ px: 2.5, pb: 2, gap: 1 }}>
          <Button onClick={handleClose} variant="outlined" size="small"
            sx={{ textTransform: 'none', borderColor: '#673AB7', color: '#673AB7', '&:hover': { borderColor: '#512DA8' } }}>
            No
          </Button>
          <Button onClick={handleConfirm} variant="contained" size="small"
            sx={{ textTransform: 'none', bgcolor: '#673AB7', '&:hover': { bgcolor: '#512DA8' } }}>
            Yes, Logout
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModelPopUp;
