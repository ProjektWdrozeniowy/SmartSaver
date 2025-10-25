// src/components/dashboard/CeleSection.jsx
import React from 'react';
import { Box, Typography, Card } from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';

const CeleSection = () => {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Cele
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Ustalaj i osiągaj swoje cele finansowe
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
                        backgroundColor: 'rgba(199, 125, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        color: '#c77dff',
                    }}
                >
                    <TrackChangesIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                    Sekcja Cele w budowie
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Ta sekcja zostanie wkrótce uzupełniona o funkcjonalności zarządzania celami finansowymi
                </Typography>
            </Card>
        </Box>
    );
};

export default CeleSection;
