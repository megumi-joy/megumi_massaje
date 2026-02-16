import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGES } from '../data/languages';
import { Star, ChevronDown } from 'lucide-react';

const Landing = ({ onEnter }) => {
    const { setLanguage } = useLanguage();

    const handleLanguageSelect = (langCode) => {
        setLanguage(langCode);
        onEnter();
    };

    return (
        <div className="landing-page" style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'radial-gradient(circle at center, var(--color-bg-secondary) 0%, var(--color-bg-primary) 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                opacity: 0.1,
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{ zIndex: 1, textAlign: 'center', marginBottom: '4rem' }}
            >
                <Star size={48} color="var(--color-accent)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>Megumi Massaje</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem', letterSpacing: '2px' }}>
                    HARMONY • WELLNESS • ENERGY
                </p>
            </motion.div>

            <div style={{ zIndex: 1, display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '800px' }}>
                {LANGUAGES.map((lang, index) => (
                    <motion.button
                        key={lang.code}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleLanguageSelect(lang.code)}
                        style={{
                            padding: '1rem 2rem',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: 'var(--color-text-primary)',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'rgba(0, 0, 0, 0.2)',
                            backdropFilter: 'blur(5px)',
                            minWidth: '160px',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
                        {lang.name}
                    </motion.button>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 2, duration: 2, repeat: Infinity }}
                style={{ position: 'absolute', bottom: '2rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                onClick={onEnter}
            >
                <ChevronDown size={32} />
            </motion.div>
        </div>
    );
};

export default Landing;
