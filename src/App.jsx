import { useRef, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import Landing from './components/Landing';
import MainPage from './components/MainPage';
import AdminDashboard from './components/AdminDashboard';
import TeachingPlatform from './components/TeachingPlatform';
// Lazy load FohowPage
const FohowPage = lazy(() => import('./components/FohowPage'));
import AuthModal from './components/AuthModal'; // Import if needed globally, though it's in MainPage now
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
                    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>}>
                        <Routes>
                            <Route path="/admin" element={<AdminDashboard />} />
                            <Route path="/teaching" element={<TeachingPlatform />} />
                            <Route path="/fohow" element={<FohowPage />} />
                            <Route path="*" element={
                                <>
                                    <Landing onEnter={scrollToMain} />
                                    <div ref={mainContentRef}>
                                        <MainPage />
                                    </div>
                                </>
                            } />
                        </Routes>
                    </Suspense>
                </AnimatePresence>
            </Router>
        </LanguageProvider>
    );
}

export default App;
