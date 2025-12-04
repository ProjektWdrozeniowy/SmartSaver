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
            Regulamin
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
            Nasze zasady
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
            {/* Date */}
            <Typography
              variant="body2"
              sx={{
                mb: 4,
                color: 'text.secondary',
                fontStyle: 'italic',
              }}
            >
              Ostatnia aktualizacja: 03.12.2025 r.
            </Typography>

            {/* 1. Postanowienia ogólne */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                1. Postanowienia ogólne
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Niniejszy Regulamin określa zasady korzystania z serwisu i aplikacji Smart$aver, dostępnych pod adresem smartsaver.com.pl Usługodawcą jest <strong>Smart$aver sp. z o.o., 80-266 Gdańsk, aleja Grunwaldzka 238A, NIP 12345678</strong>. Korzystanie z serwisu oznacza akceptację Regulaminu.
              </Typography>
            </Box>

            {/* 2. Definicje */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                2. Definicje
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                <strong>Serwis</strong> – aplikacja Smart$aver służąca do zarządzania finansami osobistymi.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                <strong>Usługodawca</strong> – Smart$aver sp. z o.o.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                <strong>Użytkownik</strong> – osoba korzystająca z Serwisu.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 1 }}>
                <strong>Konto</strong> – indywidualny panel Użytkownika umożliwiający dostęp do funkcji serwisu.
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                <strong>Dane osobowe</strong> – dane przetwarzane zgodnie z Polityką Prywatności.
              </Typography>
            </Box>

            {/* 3. Funkcjonalności serwisu */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                3. Funkcjonalności serwisu
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                Serwis pozwala użytkownikowi na:
              </Typography>

              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>tworzenie Konta, logowanie i resetowanie hasła</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>usunięcie konta</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>dodawanie wirtualnych środków i wydatków</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>tworzenie kategorii wydatków</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>ustawianie celów oszczędnościowych</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>przegląd miesięcznych zestawień finansowych</Typography></li>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Smart$aver nie obsługuje prawdziwych transakcji finansowych.
              </Typography>
            </Box>

            {/* 4. Rejestracja i Konto */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                4. Rejestracja i Konto
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                Rejestracja jest dobrowolna i bezpłatna. Użytkownik musi podać prawdziwe dane i dbać o bezpieczeństwo swojego hasła.
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Usunięcie konta powoduje trwałe skasowanie danych przypisanych do konta, zgodnie z Polityką Prywatności.
              </Typography>
            </Box>

            {/* 5. Korzystanie z Serwisu */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                5. Korzystanie z Serwisu
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                Serwis służy do organizacji i analizy danych finansowych wprowadzonych przez użytkownika. Aplikacja nie udziela porad inwestycyjnych ani finansowych.
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Wyniki, wykresy i analizy mają charakter pomocniczy i opierają się wyłącznie na danych podanych przez użytkownika.
              </Typography>
            </Box>

            {/* 6. Odpowiedzialność */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                6. Odpowiedzialność
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                Usługodawca nie ponosi odpowiedzialności za:
              </Typography>

              <Box component="ul" sx={{ pl: 4, mb: 2 }}>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>skutki decyzji finansowych użytkownika</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>błędne dane wprowadzone do systemu</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>przerwy techniczne niezależne od usługodawcy</Typography></li>
                <li><Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>ingerencje osób trzecich spowodowane ujawnieniem danych logowania</Typography></li>
              </Box>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Usługodawca dokłada starań, by zapewnić stabilne działanie serwisu.
              </Typography>
            </Box>

            {/* 7. Reklamacje */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                7. Reklamacje
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Reklamacje można zgłaszać na adres:{' '}
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
                . Odpowiedź zostanie udzielona w ciągu 14 dni roboczych.
              </Typography>
            </Box>

            {/* 8. Postanowienia końcowe */}
            <Box component="section">
              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2, fontWeight: 600 }}>
                8. Postanowienia końcowe
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2 }}>
                Regulamin może być aktualizowany. Informacje o zmianach będą publikowane na stronie serwisu.
              </Typography>

              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Korzystanie z serwisu po zmianach oznacza ich akceptację.
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