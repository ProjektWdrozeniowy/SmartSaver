// src/views/LandingPage.jsx
import React from 'react';
import { Box } from '@mui/material';

// Importy komponentów (dodamy je krok po kroku)
import Navbar from "../components/common/Navbar.jsx";
// import HeroSection from '../components/landing/HeroSection';
// import FeaturesSection from '../components/landing/FeaturesSection';
// import HowItWorksSection from '../components/landing/HowItWorksSection';
// import TestimonialsSection from '../components/landing/TestimonialsSection';
// import BottomCTA from '../components/landing/BottomCTA';
// import Footer from '../components/common/Footer';

const LandingPage = () => {
    return (
        <Box>
            
             <Navbar />

            <Box component="main">
                {/* Hero Section */}
                {/* <HeroSection /> */}

                {/* Features Section */}
                {/* <FeaturesSection /> */}

                {/* How It Works Section */}
                {/* <HowItWorksSection /> */}

                {/* Testimonials Section */}
                {/* <TestimonialsSection /> */}

                {/* Bottom CTA */}
                {/* <BottomCTA /> */}
            </Box>

            {/* Footer */}
            {/* <Footer /> */}

            {/* Tymczasowy tekst dla testów */}
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.primary',
                    fontSize: '2rem',
                    fontWeight: 700,
                }}
            >
                SmartSaver - React App Started! 🚀
            </Box>
        </Box>
    );
};

export default LandingPage;