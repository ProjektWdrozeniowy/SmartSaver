// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import LandingPage from './views/LandingPage';
import SignInPage from './views/SignInPage';
import SignUpPage from './views/SignUpPage';
import TermsPage from './views/TermsPage';
import PrivacyPolicyPage from './views/PrivacyPolicyPage';
import TermsOfServicePage from './views/TermsOfServicePage';
import ContactPage from './views/ContactPage.jsx';
import DashboardPage from './views/DashboardPage';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
    return (
        <Router>
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

                    <Route path="/regulamin" element={<TermsPage />} />
                    <Route path="/pp" element={<PrivacyPolicyPage />} />
                    <Route path="/warunki" element={<TermsOfServicePage />} />

                    <Route path="/kontakt" element={<ContactPage />} />

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
        </Router>
    );
}

export default App;