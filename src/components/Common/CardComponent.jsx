import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material'

const CardComponent = (props, ref) => {
    return (
        <>
            <Card >
                <CardContent>
                    <Typography sx={{ fontSize: 16 }} >
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