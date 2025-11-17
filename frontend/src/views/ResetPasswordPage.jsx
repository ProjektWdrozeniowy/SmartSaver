// src/views/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Link as MuiLink,
    Paper,
    Alert,
} from '@mui/material';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/common/AuthModal';
import { resetPassword } from '../api/auth';
import LockResetIcon from '@mui/icons-material/LockReset';

const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: 'success',
        title: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) {
            setModalConfig({
                type: 'error',
                title: 'Błąd',
                message: 'Brak tokenu resetowania hasła. Link jest nieprawidłowy.',
            });
            setModalOpen(true);
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.password) {
            newErrors.password = 'Hasło jest wymagane';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Hasło musi mieć minimum 8 znaków';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Potwierdź hasło';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Hasła nie są identyczne';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            setModalConfig({
                type: 'error',
                title: 'Błąd',
                message: 'Brak tokenu resetowania hasła.',
            });
            setModalOpen(true);
            return;
        }

        if (validateForm()) {
            try {
                setLoading(true);
                await resetPassword({ token, newPassword: formData.password });

                setModalConfig({
                    type: 'success',
                    title: 'Hasło zmienione!',
                    message: 'Twoje hasło zostało pomyślnie zmienione. Za chwilę zostaniesz przekierowany do strony logowania.',
                });
                setModalOpen(true);

                // Po 2 sekundach przekieruj do strony logowania
                setTimeout(() => {
                    navigate('/signin');
                }, 2000);
            } catch (err) {
                setModalConfig({
                    type: 'error',
                    title: 'Błąd',
                    message: err.message || 'Wystąpił błąd podczas resetowania hasła. Link może być nieprawidłowy lub wygasły.',
                });
                setModalOpen(true);
            } finally {
                setLoading(false);
            }
        }
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'background.default',
            }}
        >
            <Navbar />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: { xs: 6, md: 8 },
                    px: 2,
                }}
            >
                <Container maxWidth="sm">
                    <Paper
                        component={motion.div}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        sx={{
                            p: { xs: 4, sm: 5 },
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid',
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: 3,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        {/* Icon */}
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(0, 240, 255, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem',
                            }}
                        >
                            <LockResetIcon
                                sx={{
                                    fontSize: 40,
                                    color: 'primary.main',
                                }}
                            />
                        </Box>

                        {/* Title */}
                        <Typography
                            variant="h2"
                            component="h1"
                            sx={{
                                fontSize: { xs: '2rem', sm: '2.5rem' },
                                mb: 2,
                                textAlign: 'center',
                                color: 'text.primary',
                                fontWeight: 700,
                            }}
                        >
                            Ustaw nowe hasło
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                textAlign: 'center',
                                color: 'text.secondary',
                                lineHeight: 1.7,
                            }}
                        >
                            Wprowadź nowe hasło do swojego konta SmartSaver.
                        </Typography>

                        {/* Token warning */}
                        {!token && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                Brak tokenu resetowania hasła. Link jest nieprawidłowy.
                            </Alert>
                        )}

                        {/* Form */}
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            {/* Password Field */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    component="label"
                                    htmlFor="password"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontSize: '0.95rem',
                                        fontWeight: 400,
                                    }}
                                >
                                    Nowe hasło:
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Wprowadź nowe hasło"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    disabled={loading || !token}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'background.default',
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            {/* Confirm Password Field */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    component="label"
                                    htmlFor="confirmPassword"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontSize: '0.95rem',
                                        fontWeight: 400,
                                    }}
                                >
                                    Potwierdź hasło:
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Powtórz nowe hasło"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    disabled={loading || !token}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'background.default',
                                            '&:hover fieldset': {
                                                borderColor: 'primary.main',
                                            },
                                        },
                                    }}
                                />
                            </Box>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading || !token}
                                sx={{
                                    mb: 3,
                                    py: 1.5,
                                }}
                            >
                                {loading ? 'Resetowanie...' : 'Zresetuj hasło'}
                            </Button>

                            {/* Back to Login Link */}
                            <Box sx={{ textAlign: 'center' }}>
                                <MuiLink
                                    component={Link}
                                    to="/signin"
                                    sx={{
                                        color: 'text.secondary',
                                        textDecoration: 'none',
                                        fontSize: '0.95rem',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        '&:hover': {
                                            color: 'primary.main',
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    ← Powrót do logowania
                                </MuiLink>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>

            <Footer />

            {/* Auth Modal */}
            <AuthModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
            />
        </Box>
    );
};

export default ResetPasswordPage;
