import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { SERVICES } from '../data/services';
import { supabase } from '../utils/supabaseClient';
import ServiceCard from './ServiceCard';
import BookingModal from './BookingModal';
import { Calendar, Phone } from 'lucide-react';

const AnimatedText = ({ text, className, style, delay = 0 }) => {
    const words = text.split(' ');

    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.04 * i + delay },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", ...style }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={className}
        >
            {words.map((word, index) => (
                <motion.span
                    variants={child}
                    style={{ marginRight: "0.5rem", display: "inline-block" }}
                    key={index}
                >
                    {word}
                </motion.span>
            ))}
        </motion.div>
    );
};

const MainPage = () => {
    const { t } = useLanguage();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const handleBook = (service) => {
        setSelectedService(service);
        setIsBookingOpen(true);
    };

    return (
        <div className="main-page">
            <header style={{
                padding: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(26, 11, 46, 0.9)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
            }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Megumi Massaje</h2>
                <button
                    onClick={() => setIsBookingOpen(true)}
                    style={{
                        background: 'var(--color-accent)',
                        color: 'var(--color-bg-primary)',
                        padding: '0.8rem 1.5rem',
                        borderRadius: '50px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 0 15px var(--color-accent-glow)'
                    }}
                >
                    <Calendar size={18} />
                    {t('Book Now', {
                        en: 'Book Now',
                        es: 'Reservar',
                        ru: 'Записаться',
                        ua: 'Записатися',
                        ca: 'Reservar'
                    })}
                </button>
            </header>

            <main className="container" style={{ paddingBottom: '4rem' }}>

                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', padding: '4rem 0' }}
                >
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>
                        <AnimatedText text={t('Relax & Rejuvenate', {
                            en: 'Relax & Rejuvenate',
                            es: 'Relájate y Rejuvenece',
                            ru: 'Расслабление и Омоложение',
                            ua: 'Розслаблення та Омолодження',
                            ca: 'Relaxa\'t i Re rejoveneix',
                            va: 'Relaxa\'t i Re rejoveneix'
                        })} />
                    </h1>
                    <AnimatedText
                        delay={0.5}
                        style={{ color: 'var(--color-text-secondary)', maxWidth: '600px', margin: '0 auto' }}
                        text={t('Experience ancient healing techniques in a modern sanctuary.', {
                            en: 'Experience ancient healing techniques in a modern sanctuary.',
                            es: 'Experimenta técnicas de curación antiguas en un santuario moderno.',
                            ru: 'Откройте для себя древние техники исцеления в современном святилище.',
                            ua: 'Відкрийте для себе стародавні техніки зцілення в сучасному святилищі.',
                            ca: 'Experimenta tècniques de curació antigues en un santuario modern.',
                            va: 'Experimenta tècniques de curació antigues en un santuario modern.'
                        })}
                    />
                </motion.section>

                {/* UNESCO Highlight */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        padding: '2rem',
                        margin: '2rem 0',
                        background: 'rgba(255, 215, 0, 0.05)',
                        border: '1px solid var(--color-accent)',
                        borderRadius: '16px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                    }}
                >
                    <div style={{ color: 'var(--color-accent)', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '2px' }}>
                        {t('UNESCO Heritage').toUpperCase()}
                    </div>
                    <p style={{ margin: 0, fontSize: '1.2rem', fontStyle: 'italic' }}>
                        {t('Thai Traditional Massage was added to the UNESCO Intangible Cultural Heritage list in December 2019.', {
                            en: 'Thai Traditional Massage was added to the UNESCO Intangible Cultural Heritage list in December 2019.',
                            es: 'El masaje tradicional tailandés se agregó a la lista del patrimonio cultural de la UNESCO en diciembre de 2019.',
                            ru: 'Традиционный тайский массаж был включен в список нематериального культурного наследия ЮНЕСКО в декабре 2019 года.',
                            ua: 'Традиційний тайський масаж був внесений до списку нематеріальної культурної спадщини ЮНЕСКО в грудні 2019 року.',
                            ca: 'El massatge tradicional tailandès es va afegir a la llista del patrimoni cultural de la UNESCO al desembre de 2019.',
                            va: 'El massatge tradicional tailandès es va afegir a la llista del patrimoni cultural de la UNESCO al desembre de 2019.'
                        })}
                    </p>
                </motion.section>

                {/* Mind, Body, Soul Grid Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{
                        height: '600px',
                        margin: '4rem 0',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=1200")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <h2 style={{ fontSize: '3rem', marginBottom: '2rem', textAlign: 'center', padding: '0 1rem' }}>
                        <AnimatedText text={t('Harmonizing Mind, Body, and Soul')} />
                    </h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        width: '90%',
                        maxWidth: '800px'
                    }}>
                        {[
                            { key: 'Who We Are', delay: 0.1 },
                            { key: 'Treatments', delay: 0.2 },
                            { key: 'Benefits', delay: 0.3 },
                            { key: 'Contact', delay: 0.4 },
                            { key: 'Location', delay: 0.5 }
                        ].map((item, i) => (
                            <motion.button
                                key={item.key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: item.delay }}
                                whileHover={{ scale: 1.05, background: 'var(--color-accent)', color: 'var(--color-bg-primary)' }}
                                style={{
                                    gridColumn: i === 3 ? 'span 1.5' : i === 4 ? 'span 1.5' : 'auto',
                                    padding: '1.5rem',
                                    background: 'rgba(139, 154, 71, 0.8)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: 'white',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(5px)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                }}
                            >
                                {t(item.key)}
                            </motion.button>
                        ))}
                    </div>
                </motion.section>

                {/* Services Sections */}
                {Object.entries(SERVICES).map(([key, category], index) => (
                    <motion.section
                        key={key}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        style={{ marginBottom: '4rem' }}
                    >
                        <h2 style={{
                            borderBottom: '2px solid var(--color-bg-secondary)',
                            paddingBottom: '0.5rem',
                            display: 'inline-block'
                        }}>
                            <AnimatedText text={t(category.title)} />
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '2rem',
                            marginTop: '2rem'
                        }}>
                            {category.items.map((item, i) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                >
                                    <ServiceCard service={item} onBook={handleBook} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                ))}
            </main>

            {/* Footer */}
            <footer style={{
                background: 'var(--color-bg-secondary)',
                padding: '2rem',
                textAlign: 'center',
                color: 'var(--color-text-secondary)'
            }}>
                <div style={{ maxWidth: '600px', margin: '1rem auto' }}>
                    <p style={{ margin: '0.5rem 0' }}>Plaza soler i gustems 13, bajos derecha</p>
                    <p style={{ margin: '0.5rem 0' }}>Vilanova i la Geltru, Barcelona 08800</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={20} /> +34 635 243 458
                    </div>
                </div>
            </footer>

            <BookingModal
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
                preSelectedService={selectedService}
            />
        </div>
    );
};

export default MainPage;
