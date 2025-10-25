// src/components/dashboard/BudzetSection.jsx
import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const BudzetSection = () => {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Budżet
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Planuj i kontroluj swój budżet
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
                        backgroundColor: 'rgba(168, 230, 207, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        color: '#a8e6cf',
                    }}
                >
                    <TrendingUpIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                    Sekcja Budżet w budowie
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Ta sekcja zostanie wkrótce uzupełniona o funkcjonalności zarządzania budżetem
                </Typography>
            </Card>
        </Box>
    );
};

export default BudzetSection;
