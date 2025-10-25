// src/components/dashboard/WydatkiSection.jsx
import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const WydatkiSection = () => {
    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
                    Wydatki
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Zarządzaj swoimi wydatkami
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
                        backgroundColor: 'rgba(255, 107, 157, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 24px',
                        color: '#ff6b9d',
                    }}
                >
                    <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />
                </Box>
                <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>
                    Sekcja Wydatki w budowie
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                    Ta sekcja zostanie wkrótce uzupełniona o funkcjonalności zarządzania wydatkami
                </Typography>
            </Card>
        </Box>
    );
};

export default WydatkiSection;
