// src/views/SignInPage.jsx
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
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import phoneImage from '../assets/images/phone.png';

const SignInPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Wyczyść błąd dla tego pola
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Walidacja email
        if (!formData.email) {
            newErrors.email = 'Email jest wymagany';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Nieprawidłowy format email';
        }

        // Walidacja hasła
        if (!formData.password) {
            newErrors.password = 'Hasło jest wymagane';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Hasło musi mieć minimum 6 znaków';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // TODO: Integracja z backendem
            console.log('Form submitted:', formData);

            // Tymczasowo: przekierowanie do dashboard (gdy będzie gotowy)
            // navigate('/dashboard');

            alert('Logowanie - integracja z backendem będzie dodana później');
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
                    py: { xs: 4, md: 6 },
                    px: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                            gap: { xs: 4, md: 6 },
                            alignItems: 'center',
                            maxWidth: '1100px',
                            margin: '0 auto',
                        }}
                    >
                        {/* Left: Login Form */}
                        <Box
                            component={motion.div}
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                order: { xs: 2, md: 1 },
                            }}
                        >
                            <Paper
                                elevation={3}
                                sx={{
                                    maxWidth: '450px',
                                    width: '100%',
                                    p: { xs: 3, sm: 4 },
                                    backgroundColor: 'background.paper',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                }}
                            >
                                {/* Title */}
                                <Typography
                                    variant="h2"
                                    component="h1"
                                    sx={{
                                        fontSize: { xs: '1.8rem', sm: '2.2rem' },
                                        mb: 3,
                                        textAlign: 'center',
                                        color: 'text.primary',
                                    }}
                                >
                                    Zaloguj się
                                </Typography>

                                {/* Form */}
                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    {/* Email Field */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography
                                            component="label"
                                            htmlFor="email"
                                            sx={{
                                                display: 'block',
                                                mb: 0.8,
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
                                            placeholder="wpisz swój email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
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

                                    {/* Password Field */}
                                    <Box sx={{ mb: 1.5 }}>
                                        <Typography
                                            component="label"
                                            htmlFor="password"
                                            sx={{
                                                display: 'block',
                                                mb: 0.8,
                                                color: 'text.secondary',
                                                fontSize: '0.95rem',
                                                fontWeight: 400,
                                            }}
                                        >
                                            Hasło:
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="wpisz swoje hasło"
                                            value={formData.password}
                                            onChange={handleChange}
                                            error={!!errors.password}
                                            helperText={errors.password}
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

                                    {/* Forgot Password Link */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2.5 }}>
                                        <MuiLink
                                            component={Link}
                                            to="/forgot-password"
                                            sx={{
                                                fontSize: '0.9rem',
                                                color: 'text.secondary',
                                                textDecoration: 'none',
                                                '&:hover': {
                                                    color: 'primary.main',
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Nie pamiętasz hasła?
                                        </MuiLink>
                                    </Box>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        sx={{
                                            mt: 1,
                                            py: 1.2,
                                        }}
                                    >
                                        Zaloguj się
                                    </Button>
                                </Box>

                                {/* Sign Up Link */}
                                <Typography
                                    sx={{
                                        mt: 3,
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
                        </Box>

                        {/* Right: Image */}
                        <Box
                            component={motion.div}
                            variants={fadeIn}
                            initial="hidden"
                            animate="visible"
                            sx={{
                                display: { xs: 'flex', sm: 'flex' },
                                justifyContent: 'center',
                                alignItems: 'center',
                                order: { xs: 1, md: 2 },
                            }}
                        >
                            <Box
                                component="img"
                                src={phoneImage}
                                alt="SmartSaver App Interface"
                                sx={{
                                    maxWidth: '100%',
                                    maxHeight: '70vh',
                                    height: 'auto',
                                    borderRadius: 2,
                                    objectFit: 'contain',
                                    filter: 'drop-shadow(0 10px 30px rgba(0, 240, 255, 0.2))',
                                }}
                            />
                        </Box>
                    </Box>
                </Container>
            </Box>

            <Footer />
        </Box>
    );
};

export default SignInPage;