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
              Warunki Usługi
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
                1. Akceptacja warunków
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Korzystając z aplikacji SmartSaver, akceptujesz niniejsze Warunki Usługi.
                Jeśli nie zgadzasz się z tymi warunkami, nie korzystaj z naszych usług.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                2. Opis usługi
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                SmartSaver to aplikacja do zarządzania finansami osobistymi, która umożliwia
                użytkownikom śledzenie wydatków, planowanie budżetu oraz generowanie raportów
                finansowych.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                3. Rejestracja konta
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Aby korzystać z pełnych funkcjonalności, musisz utworzyć konto. Zobowiązujesz
                się podać prawdziwe, aktualne i kompletne informacje oraz chronić swoje dane
                logowania.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                4. Odpowiedzialność użytkownika
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Jesteś odpowiedzialny za:
                <br />
                - Zachowanie poufności danych logowania
                <br />
                - Wszystkie działania wykonane na Twoim koncie
                <br />
                - Prawidłowość wprowadzanych danych finansowych
                <br />- Korzystanie z usługi zgodnie z obowiązującym prawem
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                5. Ograniczenia usługi
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                SmartSaver nie ponosi odpowiedzialności za:
                <br />
                - Decyzje finansowe podejmowane na podstawie danych z aplikacji
                <br />
                - Utratę danych w wyniku awarii sprzętu lub oprogramowania
                <br />- Przerwy w dostępie do usługi z przyczyn technicznych
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                6. Własność intelektualna
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Wszystkie prawa do aplikacji SmartSaver, w tym kod źródłowy, design, logo i
                treści, są własnością SmartSaver. Nie możesz kopiować, modyfikować ani
                dystrybuować naszych materiałów bez zgody.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                7. Rozwiązanie umowy
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Możesz zakończyć korzystanie z usługi w dowolnym momencie, usuwając swoje
                konto. Zastrzegamy sobie prawo do zawieszenia lub zakończenia dostępu do
                usługi w przypadku naruszenia niniejszych warunków.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                8. Zmiany warunków
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Zastrzegamy sobie prawo do modyfikacji tych Warunków Usługi. O istotnych
                zmianach poinformujemy użytkowników z odpowiednim wyprzedzeniem.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                9. Prawo właściwe
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Niniejsze Warunki Usługi podlegają prawu polskiemu. Wszelkie spory będą
                rozstrzygane przez właściwe sądy w Polsce.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                10. Kontakt
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                W przypadku pytań dotyczących Warunków Usługi, skontaktuj się z nami:
                [email kontaktowy].
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