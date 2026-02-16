import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { SERVICES } from '../data/services';
import { supabase } from '../utils/supabaseClient';
import ServiceSlider from './ServiceSlider';
import InlineBooking from './InlineBooking';
import { Calendar, Phone, MapPin, Info, CheckCircle, Smartphone } from 'lucide-react';

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
    const [selectedService, setSelectedService] = useState(null);
    const [activeLocation, setActiveLocation] = useState('Sitges');
    const [servicesData, setServicesData] = useState(SERVICES);

    useEffect(() => {
        if (supabase) {
            fetchServices();
        }
    }, []);

    const fetchServices = async () => {
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*');

            if (error) throw error;
            if (data && data.length > 0) {
                // Group by category to match the UI structure
                const grouped = data.reduce((acc, service) => {
                    const cat = service.category || 'massage';
                    if (!acc[cat]) acc[cat] = { title: service.category_title || { en: cat }, items: [] };
                    acc[cat].items.push(service);
                    return acc;
                }, {});
                setServicesData(grouped);
            }
        } catch (err) {
            console.warn('Real-time services not available, using local data.', err);
        }
    };
    const whoWeAreRef = useRef(null);
    const treatmentsRef = useRef(null);
    const benefitsRef = useRef(null);
    const contactRef = useRef(null);
    const locationRef = useRef(null);

    const locations = {
        Sitges: {
            address: 'Carrer de Sant Gaudenci 26, Sitges 08870',
            phone: '+34 635 243 458',
            map: ''
        },
        Murcia: {
            address: 'Calle Mayor 42, Murcia 30001',
            phone: '+34 635 243 458',
            map: ''
        }
    };

    const handleBook = (service) => {
        setSelectedService(service);
        // We will scroll to the booking section automatically
        setTimeout(() => {
            document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const scrollToSection = (key) => {
        const refMap = {
            'Who We Are': whoWeAreRef,
            'Treatments': treatmentsRef,
            'Benefits': benefitsRef,
            'Contact': contactRef,
            'Location': locationRef
        };
        refMap[key]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                    onClick={() => treatmentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
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

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.8 }}
                        style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem', flexWrap: 'wrap' }}
                    >
                        <button
                            onClick={() => treatmentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '1rem 2.5rem',
                                background: 'transparent',
                                border: '2px solid var(--color-accent)',
                                color: 'var(--color-accent)',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                cursor: 'pointer'
                            }}
                        >
                            {t('View Treatments', { en: 'View Treatments', es: 'Ver Tratamientos', ru: 'Процедуры', ua: 'Процедури', ca: 'Veure Tractaments', va: 'Veure Tractaments' })}
                        </button>
                        <button
                            onClick={() => treatmentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
                            style={{
                                padding: '1rem 2.5rem',
                                background: 'var(--color-accent)',
                                border: '2px solid var(--color-accent)',
                                color: 'var(--color-bg-primary)',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                boxShadow: '0 0 20px var(--color-accent-glow)'
                            }}
                        >
                            {t('Book Now')}
                        </button>
                    </motion.div>
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
                                onClick={() => scrollToSection(item.key)}
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

                {/* Who We Are Section */}
                <motion.section
                    ref={whoWeAreRef}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ padding: '4rem 0', textAlign: 'center' }}
                >
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                        <Info size={40} color="var(--color-accent)" />
                    </div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{t('Who We Are')}</h2>
                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.8',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        {t('WhoWeAreContent')}
                    </p>
                </motion.section>

                {/* Benefits Section */}
                <motion.section
                    ref={benefitsRef}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        padding: '4rem 2rem',
                        background: 'rgba(139, 154, 71, 0.1)',
                        borderRadius: '24px',
                        margin: '4rem 0'
                    }}
                >
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                        {t('Benefits')}
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '2rem'
                    }}>
                        {t('BenefitsContent').split('\n').map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '1rem',
                                    background: 'var(--color-bg-secondary)',
                                    padding: '1.5rem',
                                    borderRadius: '12px'
                                }}
                            >
                                <CheckCircle size={24} color="var(--color-nature-green)" style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: '1.1rem' }}>{benefit.replace('• ', '')}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                <div ref={treatmentsRef} />

                {/* Fohow Special Section */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    style={{
                        padding: '4rem 2rem',
                        background: 'linear-gradient(135deg, var(--color-bg-secondary) 0%, #2d3e2d 100%)',
                        borderRadius: '24px',
                        margin: '4rem 0',
                        border: '1px solid var(--color-nature-green)',
                        textAlign: 'center'
                    }}
                >
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--color-nature-green)' }}>
                        Fohow Bioenergy Therapy
                    </h2>
                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.8',
                        color: 'var(--color-text-primary)',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        {t('FohowContent')}
                    </p>
                </motion.section>

                <div ref={treatmentsRef} />

                {/* Services Sections - Now as Sliders */}
                {Object.entries(servicesData).map(([key, category], index) => (
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
                            display: 'inline-block',
                            marginBottom: '2rem'
                        }}>
                            <AnimatedText text={t(category.title)} />
                        </h2>

                        <ServiceSlider
                            services={category.items}
                            onSelect={handleBook}
                        />
                    </motion.section>
                ))}

                {/* Inline Booking Section */}
                <div id="booking-section">
                    <AnimatePresence>
                        {selectedService && (
                            <InlineBooking
                                selectedService={selectedService}
                                onCancel={() => setSelectedService(null)}
                            />
                        )}
                    </AnimatePresence>
                </div>
                {/* Location Selector Section */}
                <motion.section
                    ref={locationRef}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ padding: '4rem 0' }}
                >
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                        {t('Location')}
                    </h2>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                        {Object.keys(locations).map(loc => (
                            <button
                                key={loc}
                                onClick={() => setActiveLocation(loc)}
                                style={{
                                    padding: '0.8rem 2rem',
                                    borderRadius: '50px',
                                    background: activeLocation === loc ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)',
                                    color: activeLocation === loc ? 'var(--color-bg-primary)' : 'var(--color-text-primary)',
                                    border: '1px solid var(--color-accent)',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {loc}
                            </button>
                        ))}
                    </div>

                    <div style={{
                        background: 'var(--color-bg-secondary)',
                        padding: '2rem',
                        borderRadius: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}>
                        <MapPin size={32} color="var(--color-accent)" />
                        <h3 style={{ margin: 0 }}>{activeLocation}</h3>
                        <p style={{ textAlign: 'center', maxWidth: '400px', fontSize: '1.1rem' }}>
                            {locations[activeLocation].address}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)' }}>
                            <Smartphone size={18} />
                            <strong>{locations[activeLocation].phone}</strong>
                        </div>
                    </div>
                </motion.section>
            </main>

            {/* Footer */}
            <footer ref={contactRef} style={{
                background: 'var(--color-bg-secondary)',
                padding: '4rem 2rem',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                borderTop: '1px solid rgba(255,215,0,0.1)'
            }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Megumi Massaje</h2>
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{t('Harmonizing Mind, Body, and Soul')}</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Phone size={20} /> {locations['Sitges'].phone}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={20} /> Sitges • Murcia
                        </div>
                    </div>
                </div>
                <p style={{ marginTop: '2rem', opacity: 0.6 }}>&copy; {new Date().getFullYear()} Megumi Massaje. All rights reserved.</p>
            </footer>

        </div>
    );
};

export default MainPage;
