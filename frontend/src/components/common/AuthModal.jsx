// src/components/common/AuthModal.jsx
import React from 'react';
import {
    Dialog,
    DialogContent,
    Box,
    Typography,
    Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useThemeMode } from '../../context/ThemeContext';

const AuthModal = ({ open, onClose, type = 'success', title, message, actionText = 'OK, rozumiem' }) => {
    const isSuccess = type === 'success';
    const { mode } = useThemeMode();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            PaperProps={{
                sx: {
                    background: mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08))'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(245, 245, 245, 0.95))',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                    borderRadius: 3,
                    boxShadow: mode === 'dark'
                        ? '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                        : '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
                    textAlign: 'center',
                    p: 2,
                },
            }}
        >
            <DialogContent>
                <Box
                    sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        backgroundColor: isSuccess
                            ? 'rgba(76, 175, 80, 0.15)'
                            : 'rgba(244, 67, 54, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 2rem',
                    }}
                >
                    {isSuccess ? (
                        <CheckCircleIcon
                            sx={{
                                fontSize: 50,
                                color: '#4caf50',
                            }}
                        />
                    ) : (
                        <ErrorOutlineIcon
                            sx={{
                                fontSize: 50,
                                color: '#f44336',
                            }}
                        />
                    )}
                </Box>

                <Typography
                    variant="h5"
                    sx={{
                        mb: 2,
                        color: 'text.primary',
                        fontWeight: 600,
                    }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="body1"
                    sx={{
                        mb: 3,
                        color: 'text.secondary',
                        lineHeight: 1.7,
                    }}
                >
                    {message}
                </Typography>

                <Button
                    variant="contained"
                    onClick={onClose}
                    fullWidth
                    sx={{
                        py: 1.5,
                        '&:hover': {
                            transform: 'none',
                            boxShadow: '0 0 12px 3px rgba(0, 240, 255, 0.2)',
                        },
                    }}
                >
                    {actionText}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
