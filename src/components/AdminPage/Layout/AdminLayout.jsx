import { Box, Toolbar, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout({toggleTheme}) {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                minHeight: "100vh",
                backgroundAttachment: "fixed",
                backgroundImage: theme.palette.background.backgroundAdminImage,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <AdminSidebar />

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    minHeight: "100vh",
                    overflowY: "auto",
                }}    
            >
                <AdminHeader toggleTheme={toggleTheme}/>
                
                <Toolbar/>

                <Box sx={{flex: 1, minHeight: 0, p: 2}}>
                    <Outlet/>
                </Box>
            </Box>
        </Box>
    )
};
