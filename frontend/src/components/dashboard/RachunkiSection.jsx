// src/components/dashboard/RachunkiSection.jsx
import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

const RachunkiSection = () => {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Rachunki
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Śledź swoje rachunki i płatności
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
                        backgroundColor: 'rgba(255, 217, 61, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        color: '#ffd93d',
                    }}
                >
                    <ReceiptIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                    Sekcja Rachunki w budowie
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Ta sekcja zostanie wkrótce uzupełniona o funkcjonalności zarządzania rachunkami
                </Typography>
            </Card>
        </Box>
    );
};

export default RachunkiSection;
