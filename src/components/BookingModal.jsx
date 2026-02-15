import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../utils/supabaseClient';

const BookingModal = ({ isOpen, onClose, preSelectedService }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        date: '',
        time: '',
        location: 'sitges', // Default to Sitges
        notes: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (supabase) {
            try {
                const { error } = await supabase
                    .from('appointments')
                    .insert([
                        {
                            name: formData.name,
                            phone: formData.phone,
                            date: formData.date,
                            time: formData.time,
                            location: formData.location,
                            notes: formData.notes,
                            service_id: preSelectedService?.id,
                            service_name: preSelectedService?.name?.en // Store English name as fallback/reference
                        }
                    ]);

                if (error) throw error;

                alert(t('Thank you! We will contact you shortly.', {
                    en: 'Thank you! We will contact you shortly.',
                    es: '¡Gracias! Nos pondremos en contacto contigo en breve.',
                    ru: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
                    ua: 'Дякуємо! Ми зв\'яжемося з вами найближчим часом.',
                    ca: 'Gràcies! Ens posarem en contacte amb tu ben aviat.'
                }));
            } catch (error) {
                console.error('Error submitting booking:', error);
                alert('Error: ' + error.message);
            }
        } else {
            // Mock mode
            console.log('Booking submitted (Mock):', { ...formData, service: preSelectedService });
            alert(t('Thank you! We will contact you shortly.', {
                en: 'Thank you! We will contact you shortly.',
                es: '¡Gracias! Nos pondremos en contacto contigo en breve.',
                ru: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
                ua: 'Дякуємо! Ми зв\'яжемося з вами найближчим часом.',
                ca: 'Gràcies! Ens posarem en contacte amb tu ben aviat.'
            }));
        }

        onClose();
    };

    return (
        <AnimatePresence>
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
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    style={{
                        background: 'var(--color-bg-secondary)',
                        padding: '2rem',
                        borderRadius: '16px',
                        width: '90%',
                        maxWidth: '500px',
                        border: '1px solid var(--color-accent)',
                        boxShadow: 'var(--shadow-glow)',
                        position: 'relative'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            color: 'var(--color-text-secondary)'
                        }}
                    >
                        <X />
                    </button>

                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        {t('Book Appointment', {
                            en: 'Book Appointment',
                            es: 'Reservar Cita',
                            ru: 'Записаться на прием',
                            ua: 'Записатися на прийом',
                            ca: 'Reservar Cita'
                        })}
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {preSelectedService && (
                            <div style={{
                                padding: '0.5rem',
                                background: 'rgba(255,215,0,0.1)',
                                borderRadius: '8px',
                                textAlign: 'center',
                                color: 'var(--color-accent)'
                            }}>
                                {t('Selected Service', { en: 'Selected:', es: 'Seleccionado:', ru: 'Выбрано:', ua: 'Вибрано:', ca: 'Seleccionat:' })} {t(preSelectedService.name)}
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder={t('Name', { en: 'Name', es: 'Nombre', ru: 'Имя', ua: 'Ім\'я', ca: 'Nom' })}
                            required
                            style={inputStyle}
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />

                        <input
                            type="tel"
                            placeholder={t('Phone', { en: 'Phone', es: 'Teléfono', ru: 'Телефон', ua: 'Телефон', ca: 'Telèfon' })}
                            required
                            style={inputStyle}
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                            <label style={{ flex: 1, cursor: 'pointer', background: formData.location === 'sitges' ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)', color: formData.location === 'sitges' ? 'var(--color-bg-primary)' : 'inherit', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <input
                                    type="radio"
                                    name="location"
                                    value="sitges"
                                    checked={formData.location === 'sitges'}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    style={{ display: 'none' }}
                                />
                                Sitges
                            </label>
                            <label style={{ flex: 1, cursor: 'pointer', background: formData.location === 'murcia' ? 'var(--color-accent)' : 'rgba(255,255,255,0.05)', color: formData.location === 'murcia' ? 'var(--color-bg-primary)' : 'inherit', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <input
                                    type="radio"
                                    name="location"
                                    value="murcia"
                                    checked={formData.location === 'murcia'}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    style={{ display: 'none' }}
                                />
                                Murcia
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="date"
                                required
                                style={{ ...inputStyle, flex: 1 }}
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                            <input
                                type="time"
                                required
                                style={{ ...inputStyle, flex: 1 }}
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>

                        <textarea
                            placeholder={t('Notes', { en: 'Notes (optional)', es: 'Notas (opcional)', ru: 'Примечания (необязательно)', ua: 'Примітки (необов\'язково)', ca: 'Notes (opcional)' })}
                            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />

                        <button
                            type="submit"
                            style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: 'var(--color-accent)',
                                color: 'var(--color-bg-primary)',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                transition: 'transform 0.1s'
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {t('Confirm Booking', {
                                en: 'Confirm Booking',
                                es: 'Confirmar Reserva',
                                ru: 'Подтвердить Запись',
                                ua: 'Підтвердити Запис',
                                ca: 'Confirmar Reserva'
                            })}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const inputStyle = {
    padding: '0.8rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: 'var(--color-text-primary)',
    fontSize: '1rem',
    outline: 'none'
};

export default BookingModal;
