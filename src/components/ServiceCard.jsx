import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Clock } from 'lucide-react';

const ServiceCard = ({ service, onBook }) => {
    const { t } = useLanguage();

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
            style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                backdropFilter: 'blur(5px)'
            }}
        >
            <h3 style={{ margin: 0, color: 'var(--color-nature-green)' }}>{t(service.name)}</h3>
            <p style={{ color: 'var(--color-text-secondary)', flexGrow: 1 }}>
                {t(service.description)}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                {service.prices.map((priceOption, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '8px'
                    }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)' }}>
                            <Clock size={14} /> {priceOption.duration} min
                        </span>
                        <span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>
                            {priceOption.price}€
                        </span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onBook(service)}
                style={{
                    marginTop: '1rem',
                    padding: '0.8rem',
                    background: 'var(--color-bg-secondary)',
                    color: 'var(--color-text-primary)',
                    border: '1px solid var(--color-accent)',
                    borderRadius: '8px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = 'var(--color-accent)';
                    e.currentTarget.style.color = 'var(--color-bg-primary)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'var(--color-bg-secondary)';
                    e.currentTarget.style.color = 'var(--color-text-primary)';
                }}
            >
                {t('Select', { en: 'Select', es: 'Seleccionar', ru: 'Выбрать', ua: 'Обрати', ca: 'Seleccionar' })}
            </button>
        </motion.div>
    );
};

export default ServiceCard;
