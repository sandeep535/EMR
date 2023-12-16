import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const DemoPaper = styled(Paper)(({ theme }) => ({
    width: '100%',
    height: '100%',
    padding: theme.spacing(1),
    ...theme.typography.body2,
    border:'1px solid #4ccfc2'
  }));
  export default DemoPaper;