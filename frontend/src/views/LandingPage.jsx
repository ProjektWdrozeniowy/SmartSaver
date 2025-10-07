// src/views/LandingPage.jsx
import React from 'react';
import { Box } from '@mui/material';

// Importy komponentów (dodamy je krok po kroku)
import Navbar from "../components/common/Navbar.jsx";
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import BottomCTA from '../components/landing/BottomCTA';
import Footer from '../components/common/Footer';
import ScrollToTop from "../components/common/ScrollToTop.jsx";

const LandingPage = () => {
    return (
        <Box>

             <Navbar />

            <Box component="main">

                <HeroSection />

                <FeaturesSection />

                <HowItWorksSection />

                <TestimonialsSection />

                 <BottomCTA />
            </Box>

             <Footer />

            <ScrollToTop/>
        </Box>
    );
};

export default LandingPage;