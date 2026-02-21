import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, User, Phone, CheckCircle, ChevronRight, ChevronLeft, MessageSquare } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';

const BookingModal = ({ isOpen, onClose, preSelectedService }) => {
    const { t, language } = useLanguage();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        location: 'Sitges',
        specialist: 'Any',
        serviceId: preSelectedService?.id || '',
        serviceName: preSelectedService?.name?.en || '',
        notes: ''
    });

    const [availableDates, setAvailableDates] = useState([]);
    const availableTimes = [
        '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    useEffect(() => {
        if (isOpen) {
            // Generate next 10 days
            const dates = [];
            for (let i = 0; i < 10; i++) {
                const d = new Date();
                d.setDate(d.getDate() + i);
                dates.push(d);
            }
            setAvailableDates(dates);
            if (preSelectedService) {
                setFormData(prev => ({
                    ...prev,
                    serviceId: preSelectedService.id,
                    serviceName: preSelectedService.name?.en
                }));
            }
        }
    }, [isOpen, preSelectedService]);

    if (!isOpen) return null;

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleSubmit = async () => {
        if (supabase) {
            try {
                const { error } = await supabase
                    .from('appointments')
                    .insert([{
                        name: formData.name,
                        phone: formData.phone,
                        date: formData.date,
                        time: formData.time,
                        location: formData.location.toLowerCase(),
                        notes: `[Specialist: ${formData.specialist}] ${formData.notes}`,
                        service_id: formData.serviceId,
                        service_name: formData.serviceName
                    }]);

                if (error) throw error;
                alert(t('Booking successful! We will contact you soon.'));
                onClose();
            } catch (error) {
                console.error('Error:', error);
                alert('Error: ' + error.message);
            }
        } else {
            console.log('Mock Booking:', formData);
            alert(t('Thank you! (Demo Mode) We will contact you soon.'));
            onClose();
        }
    };


    const isStep1Valid = formData.name && formData.phone;
    const isStep2Valid = formData.date && formData.time;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={overlayStyle}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    style={modalStyle}
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} style={closeButtonStyle}><X /></button>

                    <div style={progressContainer}>
                        <div style={{ ...progressBar, width: `${(step / 3) * 100}%` }} />
                    </div>

                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>
                        {t('Book Your Session')}
                    </h2>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div style={inputGroup}>
                                    <label style={labelStyle}><User size={16} /> {t('Name')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('Enter your name')}
                                        style={inputStyle}
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div style={inputGroup}>
                                    <label style={labelStyle}><Phone size={16} /> {t('Phone')}</label>
                                    <input
                                        type="tel"
                                        placeholder="+34 ..."
                                        style={inputStyle}
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div style={inputGroup}>
                                    <label style={labelStyle}><MapPin size={16} /> {t('Location')}</label>
                                    <div style={flexRow}>
                                        {['Sitges', 'Murcia'].map(loc => (
                                            <button
                                                key={loc}
                                                style={formData.location === loc ? activeTabStyle : tabStyle}
                                                onClick={() => setFormData({ ...formData, location: loc })}
                                            >
                                                {loc}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div style={inputGroup}>
                                    <label style={labelStyle}><User size={16} /> {t('Specialist', { en: 'Specialist', es: 'Especialista', ru: 'Специалист', ua: 'Спеціаліст', ca: 'Especialista' })}</label>
                                    <div style={flexRow}>
                                        {['Any', 'Megumi'].map(spec => (
                                            <button
                                                key={spec}
                                                style={formData.specialist === spec ? activeTabStyle : tabStyle}
                                                onClick={() => setFormData({ ...formData, specialist: spec })}
                                            >
                                                {spec === 'Any' ? t('Any', { en: 'Any', es: 'Cualquiera', ru: 'Любой', ua: 'Будь-хто', ca: 'Qualsevol' }) : spec}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <label style={labelStyle}><Calendar size={16} /> {t('Select Date')}</label>
                                <div style={scrollRow}>
                                    {availableDates.map((date, i) => {
                                        const dateStr = date.toISOString().split('T')[0];
                                        return (
                                            <button
                                                key={i}
                                                style={formData.date === dateStr ? activeDayStyle : dayStyle}
                                                onClick={() => setFormData({ ...formData, date: dateStr })}
                                            >
                                                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{date.toLocaleDateString(language, { weekday: 'short' })}</span>
                                                <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{date.getDate()}</span>
                                                <span style={{ fontSize: '0.7rem' }}>{date.toLocaleDateString(language, { month: 'short' })}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <label style={{ ...labelStyle, marginTop: '1.5rem' }}><Clock size={16} /> {t('Select Time')}</label>
                                <div style={gridRow}>
                                    {availableTimes.map(time => (
                                        <button
                                            key={time}
                                            style={formData.time === time ? activeTimeStyle : timeStyle}
                                            onClick={() => setFormData({ ...formData, time: time })}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div style={summaryCard}>
                                    <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle color="var(--color-nature-green)" /> {t('Summary')}</h3>
                                    <p><strong>{t('Service')}:</strong> {preSelectedService ? t(preSelectedService.name) : t('General Wellness')}</p>
                                    <p><strong>{t('Client')}:</strong> {formData.name}</p>
                                    <p><strong>{t('Location')}:</strong> {formData.location}</p>
                                    <p><strong>{t('With', { en: 'With', es: 'Con' })}:</strong> {formData.specialist === 'Any' ? t('Any', { en: 'Any', es: 'Cualquiera' }) : formData.specialist}</p>
                                    <p><strong>{t('When')}:</strong> {formData.date} {t('at')} {formData.time}</p>
                                </div>
                                <textarea
                                    placeholder={t('Additional notes...')}
                                    style={{ ...inputStyle, height: '100px', width: '100%', marginTop: '1rem' }}
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />

                                {!supabase && (
                                    <div style={warningBox}>
                                        <MessageSquare size={16} />
                                        <span>{t('Offline mode: Booking will be sent via mock.')}</span>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    <div style={footerStyle}>
                        {step > 1 && (
                            <button onClick={handleBack} style={backButtonStyle}>
                                <ChevronLeft size={20} /> {t('Back')}
                            </button>
                        )}
                        <div style={{ flex: 1 }} />
                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                                style={step === 1 ? (isStep1Valid ? nextButtonStyle : disabledButtonStyle) : (isStep2Valid ? nextButtonStyle : disabledButtonStyle)}
                            >
                                {t('Next')} <ChevronRight size={20} />
                            </button>
                        ) : (
                            <button onClick={handleSubmit} style={confirmButtonStyle}>
                                {t('Confirm')}
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Styles
const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', padding: '1rem'
};

const modalStyle = {
    background: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '24px',
    width: '100%', maxWidth: '500px', maxHeight: '90vh', display: 'flex',
    flexDirection: 'column', position: 'relative', border: '1px solid rgba(255,215,0,0.1)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
};

const closeButtonStyle = {
    position: 'absolute', top: '1.5rem', right: '1.5rem',
    color: 'var(--color-text-secondary)', cursor: 'pointer', background: 'none', border: 'none'
};

const progressContainer = {
    height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px',
    marginBottom: '2rem', overflow: 'hidden'
};

const progressBar = {
    height: '100%', background: 'var(--color-accent)', transition: 'width 0.3s ease'
};

const inputGroup = { marginBottom: '1.5rem' };
const labelStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', opacity: 0.8 };
const inputStyle = {
    width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white',
    outline: 'none', fontSize: '1rem', transition: 'border-color 0.2s'
};

const flexRow = { display: 'flex', gap: '1rem' };
const tabStyle = { flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' };
const activeTabStyle = { ...tabStyle, background: 'var(--color-accent)', color: 'var(--color-bg-primary)', fontWeight: 'bold' };

const scrollRow = { display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem' };
const dayStyle = {
    flex: '0 0 70px', height: '90px', display: 'flex', flexDirection: 'column',
    justifyContent: 'center', alignItems: 'center', borderRadius: '12px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    color: 'white', cursor: 'pointer'
};
const activeDayStyle = { ...dayStyle, background: 'var(--color-nature-green)', borderColor: 'var(--color-nature-green)' };

const gridRow = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' };
const timeStyle = { padding: '0.8rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer' };
const activeTimeStyle = { ...timeStyle, background: 'var(--color-accent)', color: 'var(--color-bg-primary)', fontWeight: 'bold' };

const summaryCard = { padding: '1.5rem', background: 'rgba(139, 154, 71, 0.1)', borderRadius: '16px', border: '1px solid rgba(139, 154, 71, 0.3)' };

const footerStyle = { display: 'flex', alignItems: 'center', marginTop: '2rem', gap: '1rem' };
const backButtonStyle = { background: 'none', border: 'none', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' };
const nextButtonStyle = { background: 'var(--color-accent)', color: 'var(--color-bg-primary)', padding: '1rem 2rem', borderRadius: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: 'none' };
const disabledButtonStyle = { ...nextButtonStyle, opacity: 0.3, cursor: 'not-allowed' };
const confirmButtonStyle = { ...nextButtonStyle, background: 'var(--color-nature-green)', color: 'white' };

const warningBox = { marginTop: '1rem', padding: '0.8rem', borderRadius: '8px', background: 'rgba(212,163,115,0.1)', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' };

export default BookingModal;
