import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SERVICES } from '../data/services';
import { supabase } from '../utils/supabaseClient';
import ServiceSlider from './ServiceSlider';
import InlineBooking from './InlineBooking';
import AuthModal from './AuthModal';
import UserDashboard from './UserDashboard';
import { Calendar, Phone, MapPin, Info, CheckCircle, Smartphone, User } from 'lucide-react';

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
    const navigate = useNavigate();
    const [selectedService, setSelectedService] = useState(null);
    const [activeLocation, setActiveLocation] = useState('Sitges');
    const [servicesData, setServicesData] = useState(SERVICES);
    const [events, setEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registerForm, setRegisterForm] = useState({ name: '', email: '' });
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [user, setUser] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);

    useEffect(() => {
        if (supabase) {
            fetchServices();
            fetchEvents();

            // Check auth status
            supabase.auth.getUser().then(({ data: { user } }) => {
                setUser(user);
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user ?? null);
            });

            return () => subscription.unsubscribe();
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

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .gte('date', new Date().toISOString())
                .order('date', { ascending: true });

            if (error) throw error;
            setEvents(data || []);
        } catch (err) {
            console.warn('Real-time events not available.', err);
            // Mock events for demo
            setEvents([
                { id: 1, title: 'Mafia Game Night', date: '2023-11-15T19:00:00', location: 'Sitges', type: 'game', description: 'Classic Mafia game. Meet new people!', price: 10 },
                { id: 2, title: 'Spanish Workshop', date: '2023-11-18T10:00:00', location: 'Online', type: 'class', description: 'Learn basic Spanish phrases for massage.', price: 15 },
            ]);
        }
    };

    const handleJoinEvent = (event) => {
        setSelectedEvent(event);
        setShowEventModal(true);
    };

    const submitRegistration = async (e) => {
        e.preventDefault();
        if (!registerForm.name || !registerForm.email) return;

        try {
            if (supabase) {
                const { error } = await supabase
                    .from('event_registrations')
                    .insert([{
                        event_id: selectedEvent.id,
                        user_name: registerForm.name,
                        user_email: registerForm.email
                    }]);
                if (error) throw error;
            }
            alert(`You have registered for ${selectedEvent.title}!`);
            setShowEventModal(false);
            setRegisterForm({ name: '', email: '' });
        } catch (err) {
            console.error('Registration failed:', err);
            alert('Registration failed. Please try again or contact us.');
        }
    };
    const whoWeAreRef = useRef(null);
    const treatmentsRef = useRef(null);
    const benefitsRef = useRef(null);
    const contactRef = useRef(null);
    const locationRef = useRef(null);

    const locations = {
        Sitges: {
            address: 'Sitges Center - Carrer de Sant Gaudenci (---)',
            phone: '---',
            map: ''
        },
        Murcia: {
            address: 'Murcia Center - Calle Mayor (---)',
            phone: '---',
            map: ''
        },
        Online: {
            address: 'Online Session (Zoom/WhatsApp)',
            phone: '---',
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
                <h2
                    onClick={scrollToMain}
                    style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer' }}
                >
                    Megumi Massaje
                </h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {user ? (
                        <button
                            onClick={() => setShowDashboard(!showDashboard)}
                            style={{
                                background: 'rgba(255,255,255,0.1)',
                                color: 'var(--color-text-primary)',
                                padding: '0.8rem',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid var(--color-accent)',
                                cursor: 'pointer'
                            }}
                        >
                            <User size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            style={{
                                background: 'transparent',
                                color: 'var(--color-text-primary)',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '50px',
                                fontWeight: 'bold',
                                border: '1px solid rgba(255,255,255,0.2)',
                                cursor: 'pointer'
                            }}
                        >
                            {t('Login', { en: 'Login', es: 'Entrar' })}
                        </button>
                    )}
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
                            boxShadow: '0 0 15px var(--color-accent-glow)',
                            cursor: 'pointer'
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
                </div>
            </header>

            {showDashboard ? (
                <UserDashboard />
            ) : (
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
                                {t('Book Now', { en: 'Book Now', es: 'Reservar', ru: 'Записаться', ua: 'Записатися', ca: 'Reservar' })}
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
                                    {t(item.key, {
                                        en: item.key,
                                        es: item.key === 'Who We Are' ? 'Quiénes Somos' :
                                            item.key === 'Treatments' ? 'Tratamientos' :
                                                item.key === 'Benefits' ? 'Beneficios' :
                                                    item.key === 'Contact' ? 'Contacto' :
                                                        'Ubicación'
                                    })}
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
                        <button
                            onClick={() => navigate('/fohow')}
                            style={{
                                marginTop: '2rem',
                                padding: '0.8rem 2rem',
                                background: 'transparent',
                                border: '1px solid var(--color-nature-green)',
                                color: 'var(--color-nature-green)',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'var(--color-nature-green)';
                                e.target.style.color = 'var(--color-bg-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = 'var(--color-nature-green)';
                            }}
                        >
                            {t('Learn More', { en: 'Learn More', es: 'Saber Más', ru: 'Подробнее', ua: 'Детальніше', ca: 'Saber Més' })}
                        </button>
                    </motion.section>

                    <div ref={treatmentsRef} />

                    {/* Events Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ padding: '4rem 0' }}
                    >
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                            {t('Upcoming Events & Games', { en: 'Upcoming Events & Games', es: 'Próximos Eventos y Juegos', ru: 'Предстоящие События и Игры', ua: 'Майбутні Події та Ігри', ca: 'Propers Esdeveniments i Jocs', va: 'Propers Esdeveniments i Jocs' })}
                        </h2>

                        {events.length === 0 ? (
                            <p style={{ textAlign: 'center', opacity: 0.7 }}>No upcoming events scheduled.</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                {events.map(event => (
                                    <motion.div
                                        key={event.id}
                                        whileHover={{ y: -5 }}
                                        style={{
                                            background: 'var(--color-bg-secondary)',
                                            borderRadius: '16px',
                                            overflow: 'hidden',
                                            border: '1px solid rgba(255, 215, 0, 0.1)'
                                        }}
                                    >
                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <span style={{ background: 'var(--color-accent)', color: 'var(--color-bg-primary)', padding: '0.2rem 0.8rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                    {event.type.toUpperCase()}
                                                </span>
                                                <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                                                    {new Date(event.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <h3 style={{ marginBottom: '0.5rem' }}>{event.title}</h3>
                                            <p style={{ opacity: 0.8, marginBottom: '1rem' }}>{event.description}</p>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                                    <MapPin size={16} color="var(--color-accent)" />
                                                    {event.location}
                                                </div>
                                                <div style={{ fontWeight: 'bold', color: 'var(--color-nature-green)' }}>
                                                    {event.price === 0 ? 'Free' : `€${event.price}`}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleJoinEvent(event)}
                                                style={{
                                                    width: '100%',
                                                    marginTop: '1.5rem',
                                                    padding: '0.8rem',
                                                    background: 'transparent',
                                                    border: '1px solid var(--color-accent)',
                                                    color: 'var(--color-accent)',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {t('Join / Register', { en: 'Join / Register', es: 'Unirse / Registrarse', ru: 'Присоединиться', ua: 'Приєднатися', ca: 'Unir-se', va: 'Unir-se' })}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.section>

                    {/* Event Registration Modal */}
                    <AnimatePresence>
                        {showEventModal && selectedEvent && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    position: 'fixed',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    background: 'rgba(0,0,0,0.8)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    zIndex: 1000
                                }}
                                onClick={() => setShowEventModal(false)}
                            >
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.9 }}
                                    style={{
                                        background: 'var(--color-bg-primary)',
                                        padding: '2rem',
                                        borderRadius: '16px',
                                        width: '90%',
                                        maxWidth: '400px',
                                        border: '1px solid var(--color-accent)'
                                    }}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{t('Join', { en: 'Join', es: 'Unirse a', ru: 'Присоединиться к', ua: 'Приєднатися до', ca: 'Unir-se a' })} {selectedEvent.title}</h3>
                                    <form onSubmit={submitRegistration} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder={t('Your Name', { en: 'Your Name', es: 'Tu Nombre', ru: 'Ваше Имя', ua: "Ваше Ім'я", ca: 'El teu Nom' })}
                                            required
                                            value={registerForm.name}
                                            onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-text-secondary)', background: 'transparent', color: 'white' }}
                                        />
                                        <input
                                            type="email"
                                            placeholder={t('Your Email', { en: 'Your Email', es: 'Tu Email', ru: 'Ваш Email', ua: 'Ваш Email', ca: 'El teu Email' })}
                                            required
                                            value={registerForm.email}
                                            onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                                            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--color-text-secondary)', background: 'transparent', color: 'white' }}
                                        />
                                        <div style={{ fontSize: '0.9rem', opacity: 0.8, textAlign: 'center' }}>
                                            {t('We will contact you with details.', { en: 'We will contact you with details.', es: 'Te contactaremos con los detalles.', ru: 'Мы свяжемся с вами с деталями.', ua: "Ми зв'яжемося з вами з деталями.", ca: 'Et contactarem amb els detalls.' })}
                                        </div>
                                        <button
                                            type="submit"
                                            style={{
                                                padding: '1rem',
                                                background: 'var(--color-accent)',
                                                color: 'var(--color-bg-primary)',
                                                borderRadius: '8px',
                                                fontWeight: 'bold',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {t('Confirm Registration', { en: 'Confirm Registration', es: 'Confirmar Registro', ru: 'Подтвердить Регистрацию', ua: 'Підтвердити Реєстрацію', ca: 'Confirmar Registre' })}
                                        </button>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
                            <div style={{ width: '100%', height: '300px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-accent)', position: 'relative' }}>
                                <img
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200"
                                    alt="Map Location"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.7)' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}>
                                    <h3 style={{ marginBottom: '1rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{t('View on Google Maps')}</h3>
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locations[activeLocation].address)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            background: 'var(--color-accent)',
                                            color: 'var(--color-bg-primary)',
                                            padding: '0.8rem 1.5rem',
                                            borderRadius: '50px',
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <MapPin size={18} />
                                        {t('Open Map')}
                                    </a>
                                </div>
                            </div>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locations[activeLocation].address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}
                            >
                                Open in Google Maps
                            </a>
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


                    {/* Partners Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{
                            padding: '4rem 2rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '24px',
                            margin: '4rem 0',
                            textAlign: 'center'
                        }}
                    >
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
                            {t('Friends & Partners', { en: 'Friends & Partners', es: 'Amigos y Socios', ru: 'Друзья и Партнеры', ua: 'Друзі та Партнери', ca: 'Amics i Socis' })}
                        </h2>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '2rem'
                        }}>
                            {[
                                { name: 'Spanish Classes', icon: '🇪🇸', desc: { en: 'Learn Spanish', es: 'Aprende Español' } },
                                { name: 'Web Development', icon: '💻', desc: { en: 'Programming & Tech', es: 'Programación y Tecnología' } },
                                { name: 'English Classes', icon: '🇬🇧', desc: { en: 'Learn English', es: 'Aprende Inglés' } }
                            ].map((partner, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    style={{
                                        background: 'var(--color-bg-secondary)',
                                        padding: '2rem',
                                        borderRadius: '16px',
                                        width: '250px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        border: '1px solid rgba(255, 215, 0, 0.1)'
                                    }}
                                >
                                    <span style={{ fontSize: '3rem' }}>{partner.icon}</span>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{partner.name}</h3>
                                    <p style={{ margin: 0, opacity: 0.7, fontSize: '0.9rem' }}>
                                        {t(partner.desc.en, partner.desc)}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                </main>
            )}

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

            <AuthModal
                isOpen={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onSuccess={() => {
                    setShowAuthModal(false);
                    // Optionally show dashboard or success toast
                }}
            />

            {/* Back to Top Button */}
            <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                onClick={scrollToMain}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    background: 'var(--color-accent)',
                    color: 'var(--color-bg-primary)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 90
                }}
            >
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>↑</span>
            </motion.button>
        </div>
    );
};

export default MainPage;
