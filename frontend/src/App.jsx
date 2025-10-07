// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import LandingPage from './views/LandingPage';

// Importy dla późniejszych stron (zakomentowane na razie)
// import SignInPage from './views/SignInPage';
// import SignUpPage from './views/SignUpPage';

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
                    {/* Landing Page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Routing dla stron logowania/rejestracji - dodamy później */}
                    {/* <Route path="/signin" element={<SignInPage />} /> */}
                    {/* <Route path="/signup" element={<SignUpPage />} /> */}
                    {/* <Route path="/regulamin" element={<TermsPage />} /> */}
                    {/* <Route path="/pp" element={<PrivacyPolicyPage />} /> */}
                </Routes>
            </Box>
        </Router>
    );
}

export default App;