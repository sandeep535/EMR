import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SLBreadcrumbs = ({ items }) => {
    const navigate = useNavigate();

    return (
        <Breadcrumbs aria-label="breadcrumb">
            {items.map((item, index) => (
                <div key={index}>
                    {item.link ? (
                        <Link
                            color="inherit"
                            onClick={() => navigate(item.link)}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <Typography color="text.primary">{item.label}</Typography>
                    )}
                </div>
            ))}
        </Breadcrumbs>
    );
};

export default SLBreadcrumbs;
