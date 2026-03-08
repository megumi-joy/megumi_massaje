import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, CheckCircle, MessageSquare, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';

// CONFIGURABLE BOOKING LIMIT (Months)
const BOOKING_LIMIT_MONTHS = 3;

const BookingModal = ({ isOpen, onClose, preSelectedService }) => {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        location: 'Sitges',
        specialist: 'Any',
        serviceId: '',
        serviceName: '',
        notes: ''
    });

    const [activeSection, setActiveSection] = useState(1);
    const [startDate, setStartDate] = useState(new Date()); // Start of the visible week

    const availableTimes = [
        '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    useEffect(() => {
        if (isOpen) {
            setFormData(prev => ({
                ...prev,
                serviceId: preSelectedService?.id || '',
                serviceName: preSelectedService?.name?.[language] || preSelectedService?.name?.en || ''
            }));
            setActiveSection(1);
            setStartDate(new Date());
        }
    }, [isOpen, preSelectedService, language]);

    // Generate 7 days starting from startDate
    const weekDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            days.push(d);
        }
        return days;
    }, [startDate]);

    if (!isOpen) return null;

    const isSection1Complete = formData.name && formData.phone;
    const isSection2Complete = formData.date && formData.time;

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
            alert(t('Thank you! (Demo Mode) We will contact you soon.'));
            onClose();
        }
    };

    const nextWeek = () => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + 7);
        const limit = new Date();
        limit.setMonth(limit.getMonth() + BOOKING_LIMIT_MONTHS);
        if (d <= limit) setStartDate(d);
    };

    const prevWeek = () => {
        const d = new Date(startDate);
        d.setDate(d.getDate() - 7);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        if (d >= now || (new Date().setDate(new Date().getDate() - 7) < d)) {
            // Allow going back to current week but not deep past
            setStartDate(d < new Date() ? new Date() : d);
        }
    };

    const SectionHeader = ({ id, title, icon: Icon, isComplete }) => (
        <div
            onClick={() => setActiveSection(activeSection === id ? 0 : id)}
            style={{
                ...sectionHeaderStyle,
                borderColor: isComplete ? 'var(--color-nature-green)' : 'rgba(255,215,0,0.1)',
                background: activeSection === id ? 'rgba(255,215,0,0.05)' : 'rgba(255,255,255,0.02)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <Icon size={18} color={isComplete ? 'var(--color-nature-green)' : 'var(--color-accent)'} />
                <span style={{ fontWeight: '600', fontSize: '1rem' }}>{title}</span>
                {isComplete && <CheckCircle size={14} color="var(--color-nature-green)" />}
            </div>
            <motion.div animate={{ rotate: activeSection === id ? 180 : 0 }}>
                <ChevronDown size={18} opacity={0.5} />
            </motion.div>
        </div>
    );

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
                    initial={{ scale: 0.95, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 10 }}
                    style={modalStyle}
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} style={closeButtonStyle}><X size={20} /></button>

                    <h2 style={{ textAlign: 'center', marginBottom: '0.75rem', color: 'var(--color-accent)', fontSize: '1.2rem' }}>
                        {t('Book', { en: 'Book', es: 'Reserva', ru: 'Запись' })}: <span style={{ color: 'white' }}>{formData.serviceName || t('Session')}</span>
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', flex: 1, overflow: 'hidden' }}>

                        {/* 1. CONTACT INFO */}
                        <div style={{ ...sectionWrapper, flex: activeSection === 1 ? 1 : 'unset', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <SectionHeader id={1} title={t('Contact Info', { en: 'Contact Info', es: 'Info de contacto', ru: 'Контактная инфо' })} icon={User} isComplete={isSection1Complete} />
                            <AnimatePresence>
                                {activeSection === 1 && (
                                    <motion.div initial={foldInitial} animate={foldAnimate} exit={foldInitial} style={{ ...foldContent, flex: 1 }}>
                                        <div style={gridTwoCols}>
                                            <div style={inputGroup}>
                                                <label style={labelStyle}>{t('Name', { en: 'Name', es: 'Nombre', ru: 'Имя' })}</label>
                                                <input type="text" style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="..." />
                                            </div>
                                            <div style={inputGroup}>
                                                <label style={labelStyle}>{t('Phone', { en: 'Phone', es: 'Teléfono', ru: 'Телефон' })}</label>
                                                <input type="tel" style={inputStyle} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+34 ..." />
                                            </div>
                                        </div>
                                        <div style={gridTwoCols}>
                                            <div style={inputGroup}>
                                                <label style={labelStyle}>{t('Location', { en: 'Location', es: 'Ubicación', ru: 'Локация' })}</label>
                                                <div style={flexRow}>
                                                    {['Sitges', 'Murcia'].map(loc => (
                                                        <button key={loc} style={formData.location === loc ? activeTabStyle : tabStyle} onClick={() => setFormData({ ...formData, location: loc })}>{loc}</button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={inputGroup}>
                                                <label style={labelStyle}>{t('Specialist', { en: 'Specialist', es: 'Especialista', ru: 'Специалист' })}</label>
                                                <div style={flexRow}>
                                                    {['Any', 'Megumi'].map(spec => (
                                                        <button key={spec} style={formData.specialist === spec ? activeTabStyle : tabStyle} onClick={() => setFormData({ ...formData, specialist: spec })}>{spec === 'Any' ? t('Any', { en: 'Any', es: 'Cualquiera', ru: 'Любой' }) : spec}</button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setActiveSection(2)} disabled={!isSection1Complete} style={nextBtn}>{t('Next', { en: 'Next', es: 'Siguiente', ru: 'Далее' })} →</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {activeSection !== 1 && isSection1Complete && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={summaryLine}>
                                    {formData.name} • {formData.phone} • {formData.location}
                                </motion.div>
                            )}
                        </div>

                        {/* 2. DATE & TIME */}
                        <div style={{ ...sectionWrapper, flex: activeSection === 2 ? 1 : 'unset', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <SectionHeader id={2} title={t('Date & Time', { en: 'Date & Time', es: 'Fecha y Hora', ru: 'Дату и Время' })} icon={Calendar} isComplete={isSection2Complete} />
                            <AnimatePresence>
                                {activeSection === 2 && (
                                    <motion.div initial={foldInitial} animate={foldAnimate} exit={foldInitial} style={{ ...foldContent, flex: 1 }}>
                                        <div style={calendarContainer}>
                                            <div style={calendarHeader}>
                                                <button onClick={prevWeek} style={navBtn}><ChevronLeft size={16} /></button>
                                                <span style={{ fontWeight: '600', color: 'white', fontSize: '0.8rem' }}>
                                                    {weekDays[0].toLocaleDateString(language, { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString(language, { day: 'numeric', month: 'short' })}
                                                </span>
                                                <button onClick={nextWeek} style={navBtn}><ChevronRight size={16} /></button>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                                                {weekDays.map((date, i) => {
                                                    const dateStr = date.toISOString().split('T')[0];
                                                    const isSelected = formData.date === dateStr;
                                                    const isToday = new Date().toDateString() === date.toDateString();
                                                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                                    return (
                                                        <button key={i} disabled={isPast} onClick={() => setFormData({ ...formData, date: dateStr })}
                                                            style={{
                                                                ...dayGridCell,
                                                                flexDirection: 'column',
                                                                gap: '1px',
                                                                background: isSelected ? 'var(--color-nature-green)' : isToday ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
                                                                opacity: isPast ? 0.2 : 1,
                                                                borderColor: isSelected ? 'var(--color-nature-green)' : 'rgba(255,255,255,0.05)',
                                                                height: '52px'
                                                            }}
                                                        >
                                                            <span style={{ fontSize: '0.55rem', opacity: 0.5 }}>{date.toLocaleDateString(language, { weekday: 'short' })}</span>
                                                            <span style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{date.getDate()}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                        <div style={gridTime}>
                                            {availableTimes.map(time => (
                                                <button key={time} style={formData.time === time ? activeTimeStyle : timeStyle} onClick={() => setFormData({ ...formData, time: time })}>{time}</button>
                                            ))}
                                        </div>
                                        <button onClick={() => setActiveSection(3)} disabled={!isSection2Complete} style={nextBtn}>{t('Next', { en: 'Next', es: 'Siguiente', ru: 'Далее' })} →</button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {activeSection !== 2 && isSection2Complete && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={summaryLine}>
                                    {formData.date} @ {formData.time}
                                </motion.div>
                            )}
                        </div>

                        {/* 3. CONFIRMATION */}
                        <div style={{ ...sectionWrapper, borderBottom: 'none', flex: activeSection === 3 ? 1 : 'unset', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <SectionHeader id={3} title={t('Final Summary', { en: 'Final Summary', es: 'Resumen final', ru: 'Итого' })} icon={CheckCircle} isComplete={false} />
                            <AnimatePresence>
                                {activeSection === 3 && (
                                    <motion.div initial={foldInitial} animate={foldAnimate} exit={foldInitial} style={{ ...foldContent, flex: 1 }}>
                                        <div style={summaryBox}>
                                            <div style={summaryRow}><span>{t('Client', { en: 'Client', es: 'Cliente', ru: 'Клиент' })}</span> <strong>{formData.name}</strong></div>
                                            <div style={summaryRow}><span>{t('When', { en: 'When', es: 'Cuándo', ru: 'Когда' })}</span> <strong>{formData.date} @ {formData.time}</strong></div>
                                            <div style={summaryRow}><span>{t('Where', { en: 'Where', es: 'Dónde', ru: 'Где' })}</span> <strong>{formData.location}</strong></div>
                                        </div>
                                        <div style={inputGroup}>
                                            <label style={labelStyle}><MessageSquare size={14} /> {t('Notes', { en: 'Notes', es: 'Notas', ru: 'Заметки' })}</label>
                                            <textarea value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} style={textareaStyle} placeholder="..." />
                                        </div>
                                        <div style={hintText}>{t(`Available up to ${BOOKING_LIMIT_MONTHS} mo`, { en: `Next ${BOOKING_LIMIT_MONTHS} mo`, es: `Próximos ${BOOKING_LIMIT_MONTHS} meses`, ru: `На ${BOOKING_LIMIT_MONTHS} мес.` })}</div>
                                        <button onClick={handleSubmit} disabled={!isSection1Complete || !isSection2Complete} style={confirmBtn}>
                                            {t('Confirm Booking', { en: 'Confirm Booking', es: 'Confirmar Reserva', ru: 'Забронировать' })}
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Styles
const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 90, padding: '1rem', paddingTop: '4rem'
};

const modalStyle = {
    background: 'var(--color-bg-secondary)', borderRadius: '24px',
    width: '440px', height: '650px', padding: '1rem',
    display: 'flex', flexDirection: 'column', position: 'relative',
    border: '1px solid rgba(255,215,0,0.15)', boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
    overflow: 'hidden'
};

const sectionWrapper = { borderBottom: '1px solid rgba(255,255,255,0.05)' };
const sectionHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.8rem', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s ease', margin: '0.1rem 0' };
const foldInitial = { height: 0, opacity: 0, overflow: 'hidden' };
const foldAnimate = { height: 'auto', opacity: 1, marginTop: '0.2rem', display: 'flex', flexDirection: 'column' };
const foldContent = { display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0 0.4rem 0.6rem' };
const summaryLine = { padding: '0 0.8rem 0.4rem 2.5rem', fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontStyle: 'italic', opacity: 0.7 };
const gridTwoCols = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '0.15rem' };
const labelStyle = { fontSize: '0.7rem', opacity: 0.5, marginLeft: '2px' };
const inputStyle = { padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', outline: 'none', fontSize: '0.85rem' };
const flexRow = { display: 'flex', gap: '0.3rem' };
const tabStyle = { flex: 1, padding: '0.4rem', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'white', cursor: 'pointer', fontSize: '0.75rem' };
const activeTabStyle = { ...tabStyle, background: 'var(--color-accent)', color: 'var(--color-bg-primary)', fontWeight: 'bold' };
const calendarContainer = { background: 'rgba(255,255,255,0.01)', padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' };
const calendarHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' };
const navBtn = { background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', padding: '0.2rem' };
const dayGridCell = { display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '6px', border: '1px solid transparent', color: 'white', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s' };
const gridTime = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(55px, 1fr))', gap: '0.3rem' };
const timeStyle = { padding: '0.35rem', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', color: 'white', cursor: 'pointer', fontSize: '0.75rem', textAlign: 'center' };
const activeTimeStyle = { ...timeStyle, background: 'var(--color-accent)', color: 'var(--color-bg-primary)', fontWeight: 'bold' };
const summaryBox = { background: 'rgba(139, 154, 71, 0.05)', padding: '0.6rem', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '0.2rem' };
const summaryRow = { display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' };
const textareaStyle = { ...inputStyle, height: '40px', resize: 'none' };
const hintText = { fontSize: '0.65rem', opacity: 0.3, textAlign: 'center' };
const nextBtn = { padding: '0.4rem 1rem', borderRadius: '40px', background: 'rgba(255,215,0,0.03)', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem', alignSelf: 'flex-end', marginTop: '0.4rem' };
const confirmBtn = { padding: '0.7rem', borderRadius: '10px', background: 'var(--color-nature-green)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.95rem', marginTop: '0.4rem' };
const closeButtonStyle = { position: 'absolute', top: '0.75rem', right: '0.75rem', color: 'var(--color-text-secondary)', cursor: 'pointer', background: 'none', border: 'none' };

export default BookingModal;
