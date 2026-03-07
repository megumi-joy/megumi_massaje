
with open("c:/Users/user/Documents/GitHub/megumi_massaje/src/components/BookingModal.jsx", "r", encoding="utf-8") as f:
    code = f.read()

import re

# Remove step state
code = code.replace("    const [step, setStep] = useState(1);\n", "")

# Remove handleNext, handleBack
code = code.replace("    const handleNext = () => setStep(s => s + 1);\n    const handleBack = () => setStep(s => s - 1);\n", "")

# Replace main return block
start_idx = code.find("    const isStep1Valid = formData.name && formData.phone;")
end_idx = code.find("    );\n};", start_idx) + 7

new_return = """    const isStep1Valid = formData.name && formData.phone;
    const isStep2Valid = formData.date && formData.time;
    const isReady = isStep1Valid && isStep2Valid;

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
                    style={{
                        ...modalStyle,
                        padding: isMobile ? '1.5rem 1rem' : '2rem',
                        maxHeight: isMobile ? '95vh' : '90vh',
                        borderRadius: isMobile ? '16px' : '24px'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button onClick={onClose} style={closeButtonStyle}><X /></button>

                    <h2 style={{ textAlign: 'center', margin: '0.5rem 0 1.5rem 0', color: 'var(--color-accent)', paddingRight: '2rem' }}>
                        {t('Book', { en: 'Book', es: 'Reservar', ru: 'Забронировать', ua: 'Забронювати', ca: 'Reservar' })} {preSelectedService ? `- ${t(preSelectedService.name)}` : ''}
                    </h2>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
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
                                    placeholder={t('Enter your phone')}
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
                        </div>

                        <div>
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
                        </div>

                        <div>
                            <label style={labelStyle}><MessageSquare size={16} /> {t('Notes', { en: 'Notes', es: 'Notas' })}</label>
                            <textarea
                                placeholder={t('Additional notes...')}
                                style={{ ...inputStyle, height: '80px', width: '100%' }}
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            />

                            {!supabase && (
                                <div style={warningBox}>
                                    <MessageSquare size={16} />
                                    <span>{t('Offline mode: Booking will be sent via mock.')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={footerStyle}>
                        <button
                            onClick={handleSubmit}
                            disabled={!isReady}
                            style={isReady ? confirmButtonStyle : disabledButtonStyle}
                        >
                            {t('Confirm')}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );"""

code = code[:start_idx] + new_return + code[end_idx:]

with open("c:/Users/user/Documents/GitHub/megumi_massaje/src/components/BookingModal.jsx", "w", encoding="utf-8") as f:
    f.write(code)

print("Updated BookingModal.jsx")
