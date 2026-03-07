import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, CheckCircle, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';

const InlineBooking = ({ selectedService, onCancel }) => {
    const { t, language } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        location: 'Sitges',
        specialist: 'Any',
        notes: ''
    });

    const [availableDates, setAvailableDates] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const availableTimes = [
        '10:00', '11:00', '12:00', '13:00', '16:00', '17:00', '18:00', '19:00', '20:00'
    ];

    useEffect(() => {
        // Generate next 10 days
        const dates = [];
        for (let i = 0; i < 10; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            dates.push(d);
        }
        setAvailableDates(dates);
        if (dates.length > 0) {
            setFormData(prev => ({ ...prev, date: dates[0].toISOString().split('T')[0] }));
        }

        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isStep1Ready = formData.name && formData.phone;
    const isStep2Ready = formData.date && formData.time;
    const isReady = isStep1Ready && isStep2Ready;

    const handleSubmit = async () => {
        if (!isReady) return;

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
                        service_id: selectedService?.id,
                        service_name: selectedService?.name?.en
                    }]);

                if (error) throw error;
                alert(t('Booking successful! We will contact you soon.', { en: 'Booking successful! We will contact you soon.', es: '¡Reserva exitosa! Te contactaremos pronto.', ru: 'Бронирование успешно! Мы свяжемся с вами скоро.', ua: "Бронювання успішне! Ми зв'яжемося з вами скоро.", ca: 'Reserva exitosa! Et contactarem aviat.' }));
                onCancel();
            } catch (error) {
                console.error('Error:', error);
                alert('Error: ' + error.message);
            }
        } else {
            console.log('Mock Booking:', formData);
            alert(t('Thank you! (Demo Mode) We will contact you soon.', { en: 'Thank you! (Demo Mode) We will contact you soon.', es: '¡Gracias! (Modo Demo) Te contactaremos pronto.', ru: 'Спасибо! (Демо режим) Мы свяжемся с вами скоро.', ua: "Дякуємо! (Демо режим) Ми зв'яжемося з вами скоро.", ca: 'Gràcies! (Mode Demo) Et contactarem aviat.' }));
            onCancel();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={containerStyle}
        >
            <div style={titleHeader}>
                <h2>{t('Complete Your Booking', { en: 'Complete Your Booking', es: 'Completa tu Reserva', ru: 'Завершите Бронирование', ua: 'Завершіть Бронювання', ca: 'Completa la teva Reserva' })}: <span style={{ color: 'var(--color-accent)' }}>{t(selectedService.name)}</span></h2>
                <button onClick={onCancel} style={cancelButton}>{t('Cancel', { en: 'Cancel', es: 'Cancelar', ru: 'Отмена', ua: 'Скасувати', ca: 'Cancel·lar' })}</button>
            </div>

            <div style={{
                ...threePanelLayout,
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr 1fr'
            }}>
                {/* Panel 1: Contact */}
                {(true) && (
                    <div style={panelStyle}>
                        <h3 style={panelTitle}><User size={18} /> {t('Contact Info', { en: 'Contact Info', es: 'Información de Contacto', ru: 'Контактная Информация', ua: 'Контактна Інформація', ca: 'Informació de Contacte' })}</h3>
                        <div style={panelBody}>
                            <div style={inputField}>
                                <label>{t('Name', { en: 'Name', es: 'Nombre', ru: 'Имя', ua: "Ім'я", ca: 'Nom' })}</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={t('Your full name', { en: 'Your full name', es: 'Tu nombre completo' })}
                                />
                            </div>
                            <div style={inputField}>
                                <label>{t('Phone', { en: 'Phone', es: 'Teléfono', ru: 'Телефон', ua: 'Телефон', ca: 'Telèfon' })}</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+34 ..."
                                />
                            </div>
                            <div style={inputField}>
                                <label>{t('Location', { en: 'Location', es: 'Ubicación', ru: 'Локация', ua: 'Локація', ca: 'Ubicació' })}</label>
                                <div style={radioGroup}>
                                    {['Sitges', 'Murcia'].map(loc => (
                                        <button
                                            key={loc}
                                            style={formData.location === loc ? activeRadio : radioStyle}
                                            onClick={() => setFormData({ ...formData, location: loc })}
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={inputField}>
                                <label>{t('Specialist', { en: 'Specialist', es: 'Especialista', ru: 'Специалист', ua: 'Спеціаліст', ca: 'Especialista' })}</label>
                                <div style={radioGroup}>
                                    {['Any', 'Megumi'].map(spec => (
                                        <button
                                            key={spec}
                                            style={formData.specialist === spec ? activeRadio : radioStyle}
                                            onClick={() => setFormData({ ...formData, specialist: spec })}
                                        >
                                            {spec === 'Any' ? t('Any', { en: 'Any', es: 'Cualquiera', ru: 'Любой', ua: 'Будь-хто', ca: 'Qualsevol' }) : spec}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Panel 2: Date & Time */}
                {(true) && (
                    <div style={{ ...panelStyle, flex: 2 }}>
                        <h3 style={panelTitle}><Calendar size={18} /> {t('Select Date & Time', { en: 'Select Date & Time', es: 'Seleccionar Fecha y Hora' })}</h3>
                        <div style={panelBody}>
                            <div style={dateScroll}>
                                {availableDates.map((date, i) => {
                                    const dateStr = date.toISOString().split('T')[0];
                                    return (
                                        <button
                                            key={i}
                                            style={formData.date === dateStr ? activeDateTile : dateTile}
                                            onClick={() => setFormData({ ...formData, date: dateStr })}
                                        >
                                            <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{date.toLocaleDateString(language, { weekday: 'short' })}</span>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{date.getDate()}</span>
                                        </button>
                                    );
                                })}
                            </div>
                            <div style={timeGrid}>
                                {availableTimes.map(time => (
                                    <button
                                        key={time}
                                        style={formData.time === time ? activeTimeChip : timeChip}
                                        onClick={() => setFormData({ ...formData, time: time })}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                            <div style={transparencyInfo}>
                                <Info size={14} />
                                <span>{t('All appointments are confirmed manually via WhatsApp/Phone after you book.', { en: 'All appointments are confirmed manually via WhatsApp/Phone after you book.', es: 'Todas las citas se confirman manualmente por WhatsApp/Teléfono después de reservar.' })}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Panel 3: Summary & Action */}
                {(true) && (
                    <div style={panelStyle}>
                        <h3 style={panelTitle}><CheckCircle size={18} /> {t('Summary', { en: 'Summary', es: 'Resumen' })}</h3>
                        <div style={panelBody}>
                            <div style={summaryPreview}>
                                <div style={summaryItem}>
                                    <strong>{t('Service')}:</strong> <span>{t(selectedService.name)}</span>
                                </div>
                                <div style={summaryItem}>
                                    <strong>{t('Where', { en: 'Where', es: 'Dónde' })}:</strong> <span>{formData.location}</span>
                                </div>
                                <div style={summaryItem}>
                                    <strong>{t('With', { en: 'With', es: 'Con' })}:</strong> <span>{formData.specialist === 'Any' ? t('Any', { en: 'Any', es: 'Cualquiera' }) : formData.specialist}</span>
                                </div>
                                <div style={summaryItem}>
                                    <strong>{t('When', { en: 'When', es: 'Cuándo' })}:</strong> <span>{formData.date || '---'} {formData.time ? `@ ${formData.time}` : ''}</span>
                                </div>
                                <div style={summaryItem}>
                                    <strong>{t('Price', { en: 'Price', es: 'Precio' })}:</strong> <span style={{ color: 'var(--color-accent)' }}>{selectedService.price}€</span>
                                </div>
                            </div>

                            <div style={inputField}>
                                <label>{t('Notes', { en: 'Notes', es: 'Notas' })}</label>
                                <textarea
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    style={{ height: '60px' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isReady}
                                    style={isReady ? confirmButton : disabledButton}
                                >
                                    {t('Book Now')}
                                </button>
                            </div>

                            {!supabase && (
                                <div style={offlineNotice}>
                                    <Info size={14} /> {t('Offline fallback active')}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// Styles
const containerStyle = {
    background: 'rgba(255,255,255,0.02)',
    padding: '2rem',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.05)',
    margin: '2rem 0',
    overflow: 'hidden'
};

const titleHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
};

const cancelButton = {
    background: 'transparent',
    border: '1px solid var(--color-accent)',
    color: 'var(--color-accent)',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    cursor: 'pointer'
};

const threePanelLayout = {
    display: 'grid',
    gridTemplateColumns: '1fr 1.5fr 1fr',
    gap: '1.5rem',
    alignItems: 'start'
};

const panelStyle = {
    background: 'rgba(255,255,255,0.03)',
    padding: '1.5rem',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: '100%',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
};

const transparencyInfo = {
    marginTop: '1rem',
    padding: '0.8rem',
    background: 'rgba(255, 215, 0, 0.05)',
    borderRadius: '8px',
    fontSize: '0.8rem',
    color: 'var(--color-text-secondary)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    lineHeight: '1.4'
};

const panelTitle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.2rem',
    color: 'var(--color-accent)',
    margin: 0,
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    paddingBottom: '0.5rem'
};

const panelBody = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem'
};

const inputField = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem'
};

const radioGroup = {
    display: 'flex',
    gap: '0.5rem'
};

const radioStyle = {
    flex: 1,
    padding: '0.8rem',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    cursor: 'pointer'
};

const activeRadio = {
    ...radioStyle,
    background: 'var(--color-accent)',
    color: 'var(--color-bg-primary)',
    fontWeight: 'bold'
};

const dateScroll = {
    display: 'flex',
    gap: '0.5rem',
    overflowX: 'auto',
    paddingBottom: '0.5rem'
};

const dateTile = {
    flex: '0 0 60px',
    height: '60px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: 'white',
    cursor: 'pointer'
};

const activeDateTile = {
    ...dateTile,
    background: 'var(--color-nature-green)',
    borderColor: 'var(--color-nature-green)'
};

const timeGrid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '0.5rem'
};

const timeChip = {
    padding: '0.6rem',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: '0.9rem',
    cursor: 'pointer'
};

const activeTimeChip = {
    ...timeChip,
    background: 'var(--color-accent)',
    color: 'var(--color-bg-primary)',
    fontWeight: 'bold'
};

const summaryPreview = {
    background: 'rgba(139, 154, 71, 0.1)',
    padding: '1rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem'
};

const summaryItem = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem'
};

const confirmButton = {
    padding: '1rem',
    background: 'var(--color-nature-green)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
};

const disabledButton = {
    ...confirmButton,
    opacity: 0.3,
    cursor: 'not-allowed'
};

const offlineNotice = {
    fontSize: '0.8rem',
    color: 'var(--color-accent)',
    opacity: 0.7,
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    justifyContent: 'center'
};

const stepIndicator = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1.5rem'
};

const stepDot = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    transition: 'background 0.3s ease'
};

export default InlineBooking;
