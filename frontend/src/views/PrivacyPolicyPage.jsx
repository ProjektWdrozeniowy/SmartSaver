// src/views/PrivacyPolicyPage.jsx
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

const PrivacyPolicyPage = () => {
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
              Polityka Prywatności
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
                1. Wprowadzenie
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych
                osobowych użytkowników aplikacji SmartSaver. Szanujemy Twoją prywatność i
                zobowiązujemy się chronić Twoje dane osobowe zgodnie z RODO.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                2. Administrator danych
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Administratorem danych osobowych jest [Nazwa firmy], z siedzibą w [Adres],
                kontakt: [email].
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                3. Jakie dane zbieramy
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Zbieramy następujące dane osobowe:
                <br />
                - Dane identyfikacyjne (imię, nazwisko, email)
                <br />
                - Dane dotyczące transakcji finansowych wprowadzonych przez użytkownika
                <br />
                - Dane techniczne (adres IP, typ przeglądarki, pliki cookies)
                <br />- Dane analityczne dotyczące korzystania z aplikacji
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                4. Cel przetwarzania danych
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Twoje dane przetwarzamy w celu:
                <br />
                - Świadczenia usług zarządzania finansami
                <br />
                - Obsługi konta użytkownika
                <br />
                - Komunikacji z użytkownikiem
                <br />
                - Poprawy jakości usług
                <br />- Zapewnienia bezpieczeństwa Serwisu
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                5. Udostępnianie danych
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Twoje dane nie są sprzedawane ani udostępniane osobom trzecim, z wyjątkiem
                sytuacji wymaganych prawem lub koniecznych do świadczenia usług (np.
                dostawcy hostingu).
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                6. Bezpieczeństwo danych
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Stosujemy środki techniczne i organizacyjne zapewniające ochronę danych przed
                nieuprawnionym dostępem, utratą lub zniszczeniem. Dane są szyfrowane i
                przechowywane na bezpiecznych serwerach.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                7. Twoje prawa
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Zgodnie z RODO przysługują Ci następujące prawa:
                <br />
                - Prawo dostępu do danych
                <br />
                - Prawo do sprostowania danych
                <br />
                - Prawo do usunięcia danych
                <br />
                - Prawo do ograniczenia przetwarzania
                <br />- Prawo do przenoszenia danych
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                8. Pliki cookies
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                Nasza strona wykorzystuje pliki cookies w celu zapewnienia prawidłowego
                działania serwisu oraz poprawy komfortu użytkowania.
              </Typography>

              <Typography variant="h2" sx={{ fontSize: '1.5rem', color: 'text.primary', mb: 2 }}>
                9. Kontakt
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                W sprawach dotyczących przetwarzania danych osobowych prosimy o kontakt:
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

export default PrivacyPolicyPage;