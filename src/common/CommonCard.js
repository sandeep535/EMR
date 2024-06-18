import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';

export default function CommonCard({ children, title }) {
  return (
    <Card className='common-card'>
      <CardHeader className='common-card-header' title={title}></CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {/* <CardActions className='common-card-bottom'>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}