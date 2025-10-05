import { Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import React from 'react';

const GLASS_COLORS = [
    'rgba(255, 99, 132, 0.2)',  
    'rgba(54, 162, 235, 0.2)',  
    'rgba(255, 206, 86, 0.2)',  
    'rgba(75, 192, 192, 0.2)',  
    'rgba(153, 102, 255, 0.2)', 
];

const SELECTED_BORDERS = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)',
    'rgb(255, 206, 86)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
];

const TagBarItem = ({ tag, onClick, tagIndex }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Xác định Mobile

    const colorIndex = tagIndex % GLASS_COLORS.length;
    const glassColor = GLASS_COLORS[colorIndex];
    const selectedBorderColor = SELECTED_BORDERS[colorIndex];

    return (
        <Paper
            onClick={() => onClick(tag)}
            elevation={1}
            sx={{
                pt: isMobile ? 2.5 : 5,
                pb: isMobile ? 2.5 : 5,
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                textAlign: 'center',
                
                flexShrink: 0, 
                width:  isMobile ? '150px' : '250px', 
                
                flexGrow: 0, 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                bgcolor: glassColor,
                border: `1px solid ${selectedBorderColor}`,
                color: 'text.primary',

                '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-10px)',
                    borderColor: theme.palette.primary.light,
                }
            }}
        >
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 500,
                    color: 'text.primary',
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    px: 1, 
                }}
            >
                {tag.name}
            </Typography>
        </Paper>
    );
};

export default TagBarItem;