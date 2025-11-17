// src/views/TermsPage.jsx
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

const TermsPage = () => {
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
            }}
          >
            {/* Title */}
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem' },
                mb: 2,
                color: 'text.primary',
                fontWeight: 700,
              }}
            >
              Regulamin
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mb: 4,
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
            </Typography>

            {/* Content - Placeholder */}
            <Box sx={{ '& > *:not(:last-child)': { mb: 3 } }}>
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                1. Postanowienia ogólne
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                [Tutaj umieścisz treść regulaminu. To jest placeholder - możesz go zastąpić
                rzeczywistą treścią prawną przygotowaną przez prawnika lub skopiować szablon
                regulaminu dla aplikacji finansowych.]
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                2. Definicje
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                W niniejszym Regulaminie, poniższe terminy będą miały następujące znaczenie:
                <br />
                - <strong>Serwis</strong> - aplikacja SmartSaver dostępna pod adresem...
                <br />
                - <strong>Użytkownik</strong> - osoba korzystająca z Serwisu...
                <br />
                - <strong>Konto</strong> - indywidualne konto użytkownika...
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                3. Rejestracja i konto użytkownika
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Rejestracja w Serwisie jest dobrowolna i bezpłatna. Użytkownik zobowiązuje się
                podać prawdziwe dane podczas rejestracji oraz aktualizować je w przypadku zmian.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                4. Zakres usług
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                SmartSaver umożliwia użytkownikom zarządzanie finansami osobistymi, w tym
                śledzenie wydatków, planowanie budżetu oraz generowanie raportów finansowych.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                5. Prawa i obowiązki użytkownika
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Użytkownik zobowiązuje się do korzystania z Serwisu zgodnie z jego
                przeznaczeniem oraz obowiązującymi przepisami prawa.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                6. Odpowiedzialność
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                [Tutaj opisz zakres odpowiedzialności Serwisu oraz wyłączenia odpowiedzialności.]
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                7. Postanowienia końcowe
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Regulamin wchodzi w życie z dniem publikacji. Serwis zastrzega sobie prawo do
                wprowadzania zmian w Regulaminie, o których użytkownicy zostaną
                poinformowani.
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

export default TermsPage;