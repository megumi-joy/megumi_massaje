import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Euro } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ServiceSlider = ({ services, onSelect }) => {
    const { t } = useLanguage();
    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prev) => (prev + 1) % services.length);
    };

    const prev = () => {
        setCurrentIndex((prev) => (prev - 1 + services.length) % services.length);
    };

    const currentService = services[currentIndex];

    return (
        <div style={sliderContainer}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                    style={sliderContent}
                >
                    <div style={imageWrapper}>
                        {/* We don't have unique images per service yet, so we use a fallback placeholder that looks premium */}
                        <img
                            src={`https://images.unsplash.com/photo-1544161515-4ae6ce6dbec6?auto=format&fit=crop&q=80&w=800`}
                            alt={t(currentService.name)}
                            style={serviceImage}
                        />
                        <div style={imageOverlay} />
                    </div>

                    <div style={detailsWrapper}>
                        <h3 style={serviceTitle}>{t(currentService.name)}</h3>
                        <p style={serviceDescription}>{t(currentService.description)}</p>

                        <div style={infoGrid}>
                            <div style={infoItem}>
                                <Clock size={20} color="var(--color-accent)" />
                                <span>{currentService.duration || '60m'}</span>
                            </div>
                            <div style={infoItem}>
                                <Euro size={20} color="var(--color-accent)" />
                                <span>{currentService.price || '--'}€</span>
                            </div>
                        </div>

                        <button
                            onClick={() => onSelect(currentService)}
                            style={bookButton}
                        >
                            {t('Book Treatment')}
                        </button>
                    </div>
                </motion.div>
            </AnimatePresence>

            <button onClick={prev} style={prevButton}><ChevronLeft size={30} /></button>
            <button onClick={next} style={nextButton}><ChevronRight size={30} /></button>

            <div style={dotsContainer}>
                {services.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        style={{
                            ...dot,
                            background: i === currentIndex ? 'var(--color-accent)' : 'rgba(255,255,255,0.2)'
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

// Styles
const sliderContainer = {
    position: 'relative',
    width: '100%',
    maxWidth: '1200px',
    margin: '2rem auto',
    height: '500px',
    background: 'var(--color-bg-secondary)',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
    border: '1px solid rgba(255,255,255,0.05)'
};

const sliderContent = {
    display: 'flex',
    height: '100%',
    width: '100%'
};

const imageWrapper = {
    flex: '1.2',
    position: 'relative',
    height: '100%'
};

const serviceImage = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
};

const imageOverlay = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(to right, transparent, var(--color-bg-secondary))'
};

const detailsWrapper = {
    flex: '1',
    padding: '3rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '1.5rem',
    zIndex: 1
};

const serviceTitle = {
    fontSize: '2.5rem',
    margin: 0,
    color: 'var(--color-accent)',
    fontFamily: 'serif'
};

const serviceDescription = {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'var(--color-text-secondary)',
    opacity: 0.9
};

const infoGrid = {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem'
};

const infoItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.2rem',
    fontWeight: 'bold'
};

const bookButton = {
    marginTop: 'auto',
    padding: '1.2rem 2.5rem',
    background: 'var(--color-accent)',
    color: 'var(--color-bg-primary)',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: 'fit-content',
    transition: 'transform 0.2s',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
};

const prevButton = {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.3)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backdropFilter: 'blur(5px)',
    zIndex: 10
};

const nextButton = {
    ...prevButton,
    left: 'auto',
    right: '1rem'
};

const dotsContainer = {
    position: 'absolute',
    bottom: '1.5rem',
    right: '3rem',
    display: 'flex',
    gap: '0.8rem',
    zIndex: 10
};

const dot = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background 0.3s'
};

export default ServiceSlider;
