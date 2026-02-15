import React, { useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import Landing from './components/Landing';
import MainPage from './components/MainPage';
import AdminDashboard from './components/AdminDashboard';
import './styles/index.css';

function App() {
    const mainContentRef = useRef(null);

    const scrollToMain = () => {
        mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <LanguageProvider>
            <Router basename={import.meta.env.BASE_URL}>
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="*" element={
                            <>
                                <Landing onEnter={scrollToMain} />
                                <div ref={mainContentRef}>
                                    <MainPage />
                                </div>
                            </>
                        } />
                    </Routes>
                </AnimatePresence>
            </Router>
        </LanguageProvider>
    );
}

export default App;
