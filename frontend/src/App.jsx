// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import LandingPage from './views/LandingPage';
import SignInPage from './views/SignInPage';
import SignUpPage from './views/SignUpPage';
import ForgotPasswordPage from './views/ForgotPasswordPage';
import ResetPasswordPage from './views/ResetPasswordPage';
import TermsPage from './views/TermsPage';
import PrivacyPolicyPage from './views/PrivacyPolicyPage';
import TermsOfServicePage from './views/TermsOfServicePage';
import ContactPage from './views/ContactPage.jsx';
import DashboardPage from './views/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import ScrollToTopOnRouteChange from './components/common/ScrollToTopOnRouteChange';

function App() {
    return (
        <>
            <ScrollToTopOnRouteChange />
            <Box
                sx={{
                    minHeight: '100vh',
                    backgroundColor: 'background.default',
                    overflowX: 'hidden',
                }}
            >
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                     <Route path="/signin" element={<SignInPage />} />
                     <Route path="/signup" element={<SignUpPage />} />
                     <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                     <Route path="/reset-password" element={<ResetPasswordPage />} />

                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms-of-service" element={<TermsOfServicePage />} />

                    <Route path="/contact" element={<ContactPage />} />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                </Routes>
            </Box>
        </>
    );
}

export default App;