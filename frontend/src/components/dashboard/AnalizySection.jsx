// src/components/dashboard/AnalizySection.jsx
import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

const AnalizySection = () => {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Analizy
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Analizuj swoje finanse i trendy
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
                        backgroundColor: 'rgba(0, 240, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        color: '#00f0ff',
                    }}
                >
                    <BarChartIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                    Sekcja Analizy w budowie
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Ta sekcja zostanie wkrótce uzupełniona o zaawansowane analizy finansowe
                </Typography>
            </Card>
        </Box>
    );
};

export default AnalizySection;
