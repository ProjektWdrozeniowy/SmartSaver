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

const AuthModal = ({ open, onClose, type = 'success', title, message, actionText = 'OK, rozumiem' }) => {
    const isSuccess = type === 'success';

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            PaperProps={{
                sx: {
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
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
                    }}
                >
                    {actionText}
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AuthModal;
