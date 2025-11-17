// src/views/SignUpPage.jsx
import { registerUser } from '../api/auth';
import React, { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Link as MuiLink,
    Paper,
    Checkbox,
    FormControlLabel,
    FormHelperText,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AuthModal from '../components/common/AuthModal';
import phoneImage from '../assets/images/phone.png';


const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });
    const [errors, setErrors] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        type: 'success',
        title: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
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

        // Walidacja username
        if (!formData.username) {
            newErrors.username = 'Nazwa użytkownika jest wymagana';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Nazwa musi mieć minimum 3 znaki';
        }

        // Walidacja email
        if (!formData.email) {
            newErrors.email = 'Email jest wymagany';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Nieprawidłowy format email';
        }

        // Walidacja hasła
        if (!formData.password) {
            newErrors.password = 'Hasło jest wymagane';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Hasło musi mieć minimum 8 znaków';
        }

        // Walidacja potwierdzenia hasła
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Potwierdź hasło';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Hasła nie są identyczne';
        }

        // Walidacja regulaminu
        if (!formData.terms) {
            newErrors.terms = 'Musisz zaakceptować regulamin';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    try {
      const { username, email, password } = formData;

      // wysyłamy dane do backendu (http://localhost:4000/api/register)
      const data = await registerUser({ username, email, password });

      // registerUser już sprawdza res.ok i rzuca błąd jeśli !res.ok
      // więc tutaj wiemy że wszystko ok
      setModalConfig({
        type: 'success',
        title: 'Konto utworzone!',
        message: `Witaj ${username}! Twoje konto zostało pomyślnie utworzone. Możesz teraz się zalogować.`,
      });
      setModalOpen(true);

      // Po 2 sekundach przekieruj do strony logowania
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      setModalConfig({
        type: 'error',
        title: 'Błąd rejestracji',
        message: err.message || 'Wystąpił błąd podczas rejestracji. Spróbuj ponownie.',
      });
      setModalOpen(true);
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
                        {/* Left: Signup Form */}
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
                                sx={{
                                    maxWidth: '450px',
                                    width: '100%',
                                    p: { xs: 3, sm: 4 },
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                                    Zarejestruj się
                                </Typography>

                                {/* Form */}
                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    {/* Username Field */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography
                                            component="label"
                                            htmlFor="username"
                                            sx={{
                                                display: 'block',
                                                mb: 0.8,
                                                color: 'text.secondary',
                                                fontSize: '0.95rem',
                                                fontWeight: 400,
                                            }}
                                        >
                                            Nazwa użytkownika:
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="Wybierz nazwę użytkownika"
                                            value={formData.username}
                                            onChange={handleChange}
                                            error={!!errors.username}
                                            helperText={errors.username}
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
                                            placeholder="Wpisz swój email"
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
                                    <Box sx={{ mb: 2.5 }}>
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
                                            placeholder="Wprowadź hasło"
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

                                    {/* Confirm Password Field */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <Typography
                                            component="label"
                                            htmlFor="confirmPassword"
                                            sx={{
                                                display: 'block',
                                                mb: 0.8,
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
                                            placeholder="Powtórz hasło"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            error={!!errors.confirmPassword}
                                            helperText={errors.confirmPassword}
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

                                    {/* Terms Checkbox */}
                                    <Box sx={{ mb: 2.5 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    id="terms"
                                                    name="terms"
                                                    checked={formData.terms}
                                                    onChange={handleChange}
                                                    sx={{
                                                        color: errors.terms ? 'error.main' : 'text.secondary',
                                                        '&.Mui-checked': {
                                                            color: 'primary.main',
                                                        },
                                                    }}
                                                />
                                            }
                                            label={
                                                <Typography sx={{ fontSize: '0.9rem', color: 'text.secondary' }}>
                                                    Akceptuję{' '}
                                                    <MuiLink
                                                        component={Link}
                                                        to="/terms"
                                                        target="_blank"
                                                        sx={{
                                                            color: 'primary.main',
                                                            textDecoration: 'none',
                                                            '&:hover': { textDecoration: 'underline' },
                                                        }}
                                                    >
                                                        Regulamin
                                                    </MuiLink>{' '}
                                                    i{' '}
                                                    <MuiLink
                                                        component={Link}
                                                        to="/privacy-policy"
                                                        target="_blank"
                                                        sx={{
                                                            color: 'primary.main',
                                                            textDecoration: 'none',
                                                            '&:hover': { textDecoration: 'underline' },
                                                        }}
                                                    >
                                                        Politykę Prywatności
                                                    </MuiLink>
                                                    .
                                                </Typography>
                                            }
                                        />
                                        {errors.terms && (
                                            <FormHelperText error sx={{ ml: 2 }}>
                                                {errors.terms}
                                            </FormHelperText>
                                        )}
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
                                        Zarejestruj się
                                    </Button>
                                </Box>

                                {/* Sign In Link */}
                                <Typography
                                    sx={{
                                        mt: 3,
                                        textAlign: 'center',
                                        fontSize: '0.95rem',
                                        color: 'text.secondary',
                                    }}
                                >
                                    Masz już konto?{' '}
                                    <MuiLink
                                        component={Link}
                                        to="/signin"
                                        sx={{
                                            color: 'primary.main',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        Zaloguj się tutaj
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
                                display: { xs: 'none', md: 'flex' },
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
                                }}
                            />
                        </Box>
                    </Box>
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

export default SignUpPage;