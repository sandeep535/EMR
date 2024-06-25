import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { CardHeader } from '@mui/material';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';

export default function CommonCard({ children, title, iconsList, catchCliedEvent }) {
  return (
    <Card className='common-card'>
      <CardHeader
        className='common-card-header'
        title={title}
        action={
          <IconButton aria-label="settings">
            {iconsList && iconsList.map((item, index) => (
              <Icon  onClick={() => { catchCliedEvent(item) }}>{item.icon}</Icon>
            ))}
          </IconButton>
        }
      />
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}