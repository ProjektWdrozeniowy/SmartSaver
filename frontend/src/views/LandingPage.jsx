// src/views/LandingPage.jsx
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';


import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import BottomCTA from '../components/landing/BottomCTA';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';


const LandingPage = () => {
    const location = useLocation();

    // Sprawdź czy jest przekazany scrollTo w state (z Navbar)
    useEffect(() => {
        if (location.state?.scrollTo) {
            const element = document.querySelector(location.state.scrollTo);
            if (element) {
                // Daj chwilę na wyrenderowanie strony
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    return (
        <Box>
            {/* Navbar */}
            <Navbar />

            <Box component="main">
                {/* Hero Section */}
                <HeroSection />

                {/* Features Section */}
                <FeaturesSection />

                {/* How It Works Section */}
                <HowItWorksSection />

                {/* Testimonials Section */}
                <TestimonialsSection />

                {/* Bottom CTA */}
                <BottomCTA />
            </Box>

            {/* Footer */}
            <Footer />

            {/* Scroll to Top Button */}
            <ScrollToTop />
        </Box>
    );
};

export default LandingPage;