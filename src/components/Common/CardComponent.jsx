import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material'

const CardComponent = (props, ref) => {
    return (
        <>
            <Card variant="outlined">
                <CardContent>
                    <Typography sx={{ fontSize: 16 }} className='card-header'>
                        {props.title}
                    </Typography>
                    <Box sx={{ m: 1 }}>
                        {props.children}
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}

export default CardComponent;