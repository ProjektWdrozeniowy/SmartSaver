// src/views/TermsOfServicePage.jsx
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

const TermsOfServicePage = () => {
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
            Warunki Usługi
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
            Przejrzyste zasady współpracy
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
        <Container maxWidth="md">
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
              '& section:not(:last-child)': {
                mb: 5,
              },
            }}
          >


            {/* 1. Akceptacja Warunków */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                1. Akceptacja Warunków
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Korzystając z aplikacji Smart$aver, użytkownik akceptuje niniejsze Warunki Usługi. Jeśli nie zgadza się z ich treścią, powinien zaprzestać korzystania z aplikacji.
              </Typography>
            </Box>

            {/* 2. Zakres działania */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                2. Zakres działania
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Smart$aver to aplikacja do zarządzania finansami osobistymi w formie wirtualnej. Użytkownik może dodawać środki, wydatki, tworzyć kategorie oraz ustawiać cele oszczędnościowe. Aplikacja nie operuje prawdziwymi pieniędzmi i nie wykonuje żadnych realnych transakcji.
              </Typography>
            </Box>

            {/* 3. Dane wprowadzane przez użytkownika */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                3. Dane wprowadzane przez użytkownika
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Wszystkie obliczenia i zestawienia bazują wyłącznie na informacjach wprowadzonych przez użytkownika. Użytkownik ponosi odpowiedzialność za dokładność i kompletność danych.
              </Typography>
            </Box>

            {/* 4. Bezpieczeństwo */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                4. Bezpieczeństwo
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Użytkownik odpowiada za swoje dane logowania oraz za zachowanie poufności hasła. Usługodawca stosuje odpowiednie środki techniczne mające na celu ochronę danych, zgodnie z Polityką Prywatności.
              </Typography>
            </Box>

            {/* 5. Ograniczenia odpowiedzialności */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                5. Ograniczenia odpowiedzialności
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Smart$aver nie udziela porad finansowych ani inwestycyjnych. Wyniki w aplikacji mają charakter poglądowy i służą jedynie do organizacji budżetu. Usługodawca nie ponosi odpowiedzialności za skutki wykorzystania danych z aplikacji.
              </Typography>
            </Box>

            {/* 6. Zmiany w Usłudze */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                6. Zmiany w Usłudze
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Usługodawca może wprowadzać aktualizacje, dodawać nowe funkcje lub modyfikować istniejące. Aktualizacja Warunków Usługi może nastąpić w dowolnym momencie.
              </Typography>
            </Box>

            {/* 7. Kontakt */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                7. Kontakt
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                W sprawach dotyczących aplikacji lub niniejszych Warunków należy kontaktować się pod adresem:{' '}
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
                .
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>

      <Footer />
      <ScrollToTop />
    </Box>
  );
};

export default TermsOfServicePage;