import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';
import { MapPin, User, ArrowLeft } from 'lucide-react';

const EventsPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [registerForm, setRegisterForm] = useState({ name: '', email: '' });

    useEffect(() => {
        if (supabase) {
            fetchEvents();
        } else {
            // Mock events for demo
            setEvents([
                { id: 1, title: 'Mafia Game Night', date: '2023-11-15T19:00:00', location: 'Sitges', type: 'game', description: 'Classic Mafia game. Meet new people!', price: 10 },
                { id: 2, title: 'Spanish Workshop', date: '2023-11-18T10:00:00', location: 'Online', type: 'class', description: 'Learn basic Spanish phrases for massage.', price: 15 },
                { id: 3, title: 'English Workshop', date: '2023-11-20T10:00:00', location: 'Sitges', type: 'class', description: 'Improve your English skills.', price: 12 },
            ]);
        }
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .gte('date', new Date().toISOString())
                .order('date', { ascending: true });

            if (error) throw error;
            if (data && data.length > 0) {
                setEvents(data);
            } else {
                // Fallback mock if DB is empty
                setEvents([
                    { id: 1, title: 'Mafia Game Night', date: '2023-11-15T19:00:00', location: 'Sitges', type: 'game', description: 'Classic Mafia game. Meet new people!', price: 10 },
                    { id: 2, title: 'Spanish Workshop', date: '2023-11-18T10:00:00', location: 'Online', type: 'class', description: 'Learn basic Spanish phrases for massage.', price: 15 },
                ]);
            }
        } catch (err) {
            console.warn('Real-time events not available.', err);
            // Fallback mock
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

    return (
        <div className="events-page" style={{ paddingBottom: '4rem', minHeight: '100vh', background: 'var(--color-bg-primary)', color: 'white' }}>
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
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'transparent', border: 'none', color: 'var(--color-text-primary)',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem'
                    }}
                >
                    <ArrowLeft size={20} />
                    {t('Home', { en: 'Home', es: 'Inicio', ru: 'Домой', ua: 'Головна', ca: 'Inici' })}
                </button>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Megumi Events</h2>
                <div style={{ width: '24px' }}></div> {/* Spacer for centering */}
            </header>

            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}
            >
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
                    {t('Upcoming Events & Games', { en: 'Upcoming Events & Games', es: 'Próximos Eventos y Juegos', ru: 'Предстоящие События и Игры', ua: 'Майбутні Події та Ігри', ca: 'Propers Esdeveniments i Jocs', va: 'Propers Esdeveniments i Jocs' })}
                </h1>

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
        </div>
    );
};

export default EventsPage;
