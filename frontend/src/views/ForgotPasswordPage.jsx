// src/views/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Link as MuiLink,
    Paper,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/common/AuthModal';
import { forgotPassword } from '../api/auth';
import EmailIcon from '@mui/icons-material/Email';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: 'success',
        title: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
        if (error) {
            setError('');
        }
    };

    const validateEmail = () => {
        if (!email) {
            setError('Email jest wymagany');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Nieprawidłowy format email');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Usuń focus z przycisku aby uniknąć problemów z aria-hidden
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        if (validateEmail()) {
            try {
                setLoading(true);
                await forgotPassword({ email });

                setModalConfig({
                    type: 'success',
                    title: 'Email wysłany!',
                    message: `Jeśli konto z adresem ${email} istnieje, wysłaliśmy na nie link do resetowania hasła. Sprawdź swoją skrzynkę pocztową.`,
                });
                setModalOpen(true);
                setEmail('');
            } catch (err) {
                setModalConfig({
                    type: 'error',
                    title: 'Błąd',
                    message: err.message || 'Wystąpił błąd podczas wysyłania emaila. Spróbuj ponownie.',
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
                            <EmailIcon
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
                            Zapomniałeś hasła?
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
                            Nie martw się! Podaj swój adres email, a wyślemy Ci link do resetowania hasła.
                        </Typography>

                        {/* Form */}
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            {/* Email Field */}
                            <Box sx={{ mb: 3 }}>
                                <Typography
                                    component="label"
                                    htmlFor="email"
                                    sx={{
                                        display: 'block',
                                        mb: 1,
                                        color: 'text.secondary',
                                        fontSize: '0.95rem',
                                        fontWeight: 400,
                                    }}
                                >
                                    Adres E-mail:
                                </Typography>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Wpisz swój email"
                                    value={email}
                                    onChange={handleChange}
                                    error={!!error}
                                    helperText={error}
                                    disabled={loading}
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
                                disabled={loading}
                                sx={{
                                    mb: 3,
                                    py: 1.5,
                                }}
                            >
                                {loading ? 'Wysyłanie...' : 'Wyślij link resetujący'}
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

                        {/* Sign Up Link */}
                        <Typography
                            sx={{
                                mt: 4,
                                pt: 3,
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                textAlign: 'center',
                                fontSize: '0.95rem',
                                color: 'text.secondary',
                            }}
                        >
                            Nie masz jeszcze konta?{' '}
                            <MuiLink
                                component={Link}
                                to="/signup"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Zarejestruj się tutaj
                            </MuiLink>
                        </Typography>
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

export default ForgotPasswordPage;
