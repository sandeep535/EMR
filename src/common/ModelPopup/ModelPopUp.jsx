import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import DialogContentText from '@mui/material/DialogContentText';

const ModelPopUp = ({ open, handleClose, handleConfirm }) => (
  <Dialog open={open} onClose={handleClose}>
    <DialogTitle>Sign Out</DialogTitle>
    <DialogContent>
      <DialogContentText>Do you want to logout?</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleConfirm} color="primary" variant="contained">Yes</Button>
      <Button onClick={handleClose} color="secondary" variant="outlined">No</Button>
    </DialogActions>
  </Dialog>
);

export default ModelPopUp;