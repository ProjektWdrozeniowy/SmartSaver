// src/components/dashboard/UstawieniaSection.jsx
import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';

const UstawieniaSection = () => {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Ustawienia
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Zarządzaj ustawieniami swojego konta
                </Typography>
            </Box>

            <Card
                sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    p: 4,
                    textAlign: 'center',
                }}
            >
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(176, 176, 176, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        color: '#b0b0b0',
                    }}
                >
                    <SettingsIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                    Sekcja Ustawienia w budowie
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Ta sekcja zostanie wkrótce uzupełniona o panel ustawień konta
                </Typography>
            </Card>
        </Box>
    );
};

export default UstawieniaSection;
