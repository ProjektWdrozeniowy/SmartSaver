// src/views/ContactPage.jsx
import React, { useState } from 'react';
import {
    Box,
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});
    const [faqOpen, setFaqOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);

    // FAQ Data
    const faqs = [
        {
            question: 'Jak mogę zacząć korzystać ze SmartSaver?',
            answer: 'Wystarczy zarejestrować się bezpłatnie, klikając przycisk "Zarejestruj się" w górnym rogu strony. Po utworzeniu konta możesz od razu zacząć dodawać wydatki i planować swój budżet.',
        },
        {
            question: 'Czy SmartSaver jest bezpłatny?',
            answer: 'Tak! SmartSaver oferuje bezpłatny plan podstawowy z wszystkimi kluczowymi funkcjami. Dla użytkowników, którzy potrzebują zaawansowanych raportów i nielimitowanego przechowywania danych, oferujemy plan premium.',
        },
        {
            question: 'Czy moje dane finansowe są bezpieczne?',
            answer: 'Absolutnie! Wszystkie Twoje dane są szyfrowane za pomocą najnowszych standardów bezpieczeństwa (256-bit SSL). Nie przechowujemy danych logowania do Twoich kont bankowych. Twoja prywatność jest naszym priorytetem.',
        },
        {
            question: 'Czy mogę korzystać ze SmartSaver na telefonie?',
            answer: 'Tak! SmartSaver jest w pełni responsywny i działa świetnie na smartfonach i tabletach. Pracujemy również nad dedykowaną aplikacją mobilną na iOS i Android.',
        },
        {
            question: 'Jak mogę skontaktować się z pomocą techniczną?',
            answer: 'Możesz napisać do nas przez formularz kontaktowy na tej stronie, wysłać email na kontakt@smartsaver.pl lub zadzwonić pod numer +48 123 456 789. Odpowiadamy w ciągu 2-4 godzin w dni robocze (Pon-Pt, 9:00-17:00).',
        },
    ];

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

        if (!formData.name) {
            newErrors.name = 'Imię jest wymagane';
        }

        if (!formData.email) {
            newErrors.email = 'Email jest wymagany';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Nieprawidłowy format email';
        }

        if (!formData.subject) {
            newErrors.subject = 'Temat jest wymagany';
        }

        if (!formData.message) {
            newErrors.message = 'Wiadomość jest wymagana';
        } else if (formData.message.length < 10) {
            newErrors.message = 'Wiadomość musi mieć minimum 10 znaków';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                // Wyślij dane do backendu
                const response = await fetch('http://localhost:4000/api/mail/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (data.ok) {
                    console.log('Email wysłany pomyślnie:', data);

                    // Pokaż modal sukcesu
                    setSuccessOpen(true);

                    // Wyczyść formularz
                    setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        message: '',
                    });
                } else {
                    // Obsługa błędu z backendu
                    console.error('Błąd wysyłania:', data);
                    alert('Wystąpił błąd podczas wysyłania wiadomości: ' + data.message);
                }
            } catch (error) {
                console.error('Błąd połączenia z serwerem:', error);
                alert('Nie udało się połączyć z serwerem. Sprawdź czy backend działa.');
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

            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #0d1a2a 0%, #1a0d1f 100%)',
                    py: { xs: 8, md: 10 },
                    px: 2,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography
                        component={motion.h1}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2.5rem', sm: '3.5rem' },
                            mb: 2,
                            color: 'text.primary',
                            fontWeight: 700,
                        }}
                    >
                        Skontaktuj się z nami
                    </Typography>
                    <Typography
                        component={motion.p}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        variant="body1"
                        sx={{
                            fontSize: { xs: '1rem', sm: '1.2rem' },
                            color: 'text.secondary',
                            maxWidth: '600px',
                            margin: '0 auto',
                        }}
                    >
                        Jesteśmy otwarci na każdą sugestię lub po prostu pogadajmy
                    </Typography>
                </Container>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flex: 1,
                    py: { xs: 6, md: 8 },
                    px: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
                        {/* Contact Form - Lewa strona */}
                        <Grid item xs={12} md={7}>
                            <Paper
                                component={motion.div}
                                variants={fadeIn}
                                initial="hidden"
                                animate="visible"
                                sx={{
                                    p: { xs: 3, sm: 5 },
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                    height: '100%',
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        mb: 4,
                                        color: 'text.primary',
                                        fontWeight: 600,
                                    }}
                                >
                                    Wyślij wiadomość
                                </Typography>

                                <Box component="form" onSubmit={handleSubmit} noValidate>
                                    {/* Name */}
                                    <Box sx={{ mb: 3 }}>
                                        <TextField
                                            fullWidth
                                            id="name"
                                            name="name"
                                            placeholder="Imię"
                                            value={formData.name}
                                            onChange={handleChange}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'background.default',
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Email */}
                                    <Box sx={{ mb: 3 }}>
                                        <TextField
                                            fullWidth
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'background.default',
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Subject */}
                                    <Box sx={{ mb: 3 }}>
                                        <TextField
                                            fullWidth
                                            id="subject"
                                            name="subject"
                                            placeholder="Temat"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            error={!!errors.subject}
                                            helperText={errors.subject}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'background.default',
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Message */}
                                    <Box sx={{ mb: 3 }}>
                                        <TextField
                                            fullWidth
                                            id="message"
                                            name="message"
                                            multiline
                                            rows={6}
                                            placeholder="Wiadomość"
                                            value={formData.message}
                                            onChange={handleChange}
                                            error={!!errors.message}
                                            helperText={errors.message}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'background.default',
                                                },
                                            }}
                                        />
                                    </Box>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            py: 1.5,
                                            '&:hover': {
                                                transform: 'none',
                                                boxShadow: '0 0 12px 3px rgba(0, 240, 255, 0.2)',
                                            },
                                        }}
                                    >
                                        Wyślij wiadomość
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* Contact Info - Prawa strona */}
                        <Grid item xs={12} md={5}>
                            <Paper
                                component={motion.div}
                                variants={fadeIn}
                                initial="hidden"
                                animate="visible"
                                sx={{
                                    p: { xs: 3, sm: 5 },
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                                    backdropFilter: 'blur(10px)',
                                    WebkitBackdropFilter: 'blur(10px)',
                                    border: '1px solid',
                                    borderColor: 'rgba(255, 255, 255, 0.1)',
                                    borderRadius: 2,
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                                    height: '100%',
                                }}
                            >
                                <Typography
                                    variant="h4"
                                    sx={{
                                        mb: 2,
                                        color: 'text.primary',
                                        fontWeight: 600,
                                    }}
                                >
                                    Kontakt
                                </Typography>

                                <Typography
                                    variant="body1"
                                    sx={{
                                        mb: 4,
                                        color: 'text.secondary',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    Jesteśmy otwarci na każdą sugestię lub po prostu pogadajmy
                                </Typography>

                                {/* Phone */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(255, 107, 157, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#ff6b9d',
                                        }}
                                    >
                                        <PhoneIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                            Telefon:
                                        </Typography>
                                        <Typography
                                            component="a"
                                            href="tel:+48123456789"
                                            variant="body1"
                                            sx={{
                                                color: 'text.primary',
                                                textDecoration: 'none',
                                                fontWeight: 500,
                                                '&:hover': {
                                                    color: 'primary.main',
                                                },
                                            }}
                                        >
                                            +48 123 456 789
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Email */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(0, 240, 255, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#00f0ff',
                                        }}
                                    >
                                        <EmailIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                            Email:
                                        </Typography>
                                        <Typography
                                            component="a"
                                            href="mailto:kontakt@smartsaver.pl"
                                            variant="body1"
                                            sx={{
                                                color: 'text.primary',
                                                textDecoration: 'none',
                                                fontWeight: 500,
                                                '&:hover': {
                                                    color: 'primary.main',
                                                },
                                            }}
                                        >
                                            kontakt@smartsaver.pl
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Response Time */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            backgroundColor: 'rgba(168, 230, 207, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#a8e6cf',
                                        }}
                                    >
                                        <AccessTimeIcon />
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>
                                            Średni czas odpowiedzi:
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                color: 'text.primary',
                                                fontWeight: 600,
                                            }}
                                        >
                                            2-4 godziny
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* FAQ Button */}
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<HelpOutlineIcon />}
                                    onClick={() => setFaqOpen(true)}
                                    sx={{
                                        py: 1.5,
                                        borderWidth: 2,
                                        '&:hover': {
                                            borderWidth: 2,
                                            transform: 'none',
                                            backgroundColor: 'transparent',
                                            color: '#00f0ff',
                                            borderColor: '#00f0ff',
                                            boxShadow: '0 0 12px 3px rgba(0, 240, 255, 0.2)',
                                        },
                                    }}
                                >
                                    Często zadawane pytania
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* FAQ Modal */}
            <Dialog
                open={faqOpen}
                onClose={() => setFaqOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pb: 2,
                    }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        💡 Często zadawane pytania
                    </Typography>
                    <IconButton
                        onClick={() => setFaqOpen(false)}
                        sx={{ color: 'text.secondary' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ pt: 0 }}>
                    <Typography
                        variant="body2"
                        sx={{ mb: 3, color: 'text.secondary' }}
                    >
                        Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące SmartSaver
                    </Typography>

                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            sx={{
                                backgroundColor: 'background.default',
                                mb: 1,
                                '&:before': {
                                    display: 'none',
                                },
                                '&.Mui-expanded': {
                                    margin: '0 0 8px 0',
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 240, 255, 0.05)',
                                    },
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'text.primary',
                                    }}
                                >
                                    {faq.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        lineHeight: 1.8,
                                    }}
                                >
                                    {faq.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}

                    <Box
                        sx={{
                            mt: 4,
                            p: 3,
                            backgroundColor: 'rgba(0, 240, 255, 0.1)',
                            borderRadius: 2,
                            borderLeft: '4px solid',
                            borderColor: 'primary.main',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="body1" sx={{ color: 'text.primary', mb: 1 }}>
                            Nie znalazłeś odpowiedzi?
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            Skontaktuj się z nami przez formularz lub napisz na{' '}
                            <Box
                                component="a"
                                href="mailto:kontakt@smartsaver.pl"
                                sx={{
                                    color: 'primary.main',
                                    textDecoration: 'none',
                                    fontWeight: 600,
                                    '&:hover': {
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                kontakt@smartsaver.pl
                            </Box>
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => setFaqOpen(false)}
                            sx={{
                                mt: 1,
                                '&:hover': {
                                    transform: 'none',
                                    boxShadow: '0 0 12px 3px rgba(0, 240, 255, 0.2)',
                                },
                            }}
                        >
                            Zamknij
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Success Modal */}
            <Dialog
                open={successOpen}
                onClose={() => setSuccessOpen(false)}
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        border: '1px solid',
                        borderColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
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
                            backgroundColor: 'rgba(76, 175, 80, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem',
                        }}
                    >
                        <CheckCircleIcon
                            sx={{
                                fontSize: 50,
                                color: '#4caf50',
                            }}
                        />
                    </Box>

                    <Typography
                        variant="h5"
                        sx={{
                            mb: 2,
                            color: 'text.primary',
                            fontWeight: 600,
                        }}
                    >
                        Wiadomość wysłana!
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                            lineHeight: 1.7,
                        }}
                    >
                        Dziękujemy za kontakt! Otrzymaliśmy Twoją wiadomość i odpowiemy najszybciej jak to możliwe.
                    </Typography>

                    <Typography
                        variant="body2"
                        sx={{
                            mb: 3,
                            color: 'text.secondary',
                            fontSize: '0.9rem',
                        }}
                    >
                        Średni czas odpowiedzi: <strong style={{ color: '#00f0ff' }}>2-4 godziny</strong>
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => setSuccessOpen(false)}
                        fullWidth
                        sx={{
                            py: 1.5,
                            '&:hover': {
                                transform: 'none',
                                boxShadow: '0 0 12px 3px rgba(0, 240, 255, 0.2)',
                            },
                        }}
                    >
                        OK, rozumiem
                    </Button>
                </DialogContent>
            </Dialog>

            <Footer />
            <ScrollToTop />
        </Box>
    );
};

export default ContactPage;