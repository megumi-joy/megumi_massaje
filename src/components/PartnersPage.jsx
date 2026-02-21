import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ExternalLink } from 'lucide-react';

const PartnersPage = () => {
    const { t } = useLanguage();

    const partners = [
        {
            name: 'Escuela de Masaje Tailandés',
            logo: '🇹🇭',
            description: {
                en: 'Traditional Thai Massage training and certification.',
                es: 'Formación y certificación en Masaje Tailandés Tradicional.',
                ru: 'Обучение и сертификация традиционному тайскому массажу.',
                ua: 'Навчання та сертифікація з традиційного тайського масажу.',
                ca: 'Formació i certificació en Massatge Tailandès Tradicional.'
            },
            link: '#'
        },
        {
            name: 'Fohow International',
            logo: '☯️',
            description: {
                en: 'Bioenergy therapy and wellness products.',
                es: 'Terapia de bioenergía y productos de bienestar.',
                ru: 'Биоэнерготерапия и велнес-продукты.',
                ua: 'Біоенерготерапія та велнес-продукти.',
                ca: 'Teràpia de bioenergia i productes de benestar.'
            },
            link: '#'
        },
        {
            name: 'Sitges Wellness Community',
            logo: '🏖️',
            description: {
                en: 'Local network of wellness professionals in Sitges.',
                es: 'Red local de profesionales del bienestar en Sitges.',
                ru: 'Местная сеть специалистов по оздоровлению в Ситжесе.',
                ua: 'Місцева мережа професіоналів оздоровлення в Сітжесі.',
                ca: 'Xarxa local de professionals del benestar a Sitges.'
            },
            link: '#'
        }
    ];

    return (
        <div style={containerStyle}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={headerStyle}
            >
                <h1 style={titleStyle}>{t('Our Partners', { en: 'Our Partners', es: 'Nuestros Socios', ru: 'Наши Партнеры', ua: 'Наші Партнери', ca: 'Els Nostres Socis' })}</h1>
                <p style={subtitleStyle}>
                    {t('We work with the best professionals to provide you with a comprehensive wellness experience.', {
                        en: 'We work with the best professionals to provide you with a comprehensive wellness experience.',
                        es: 'Trabajamos con los mejores profesionales para brindarte una experiencia completa de bienestar.',
                        ru: 'Мы работаем с лучшими профессионалами, чтобы предоставить вам комплексный оздоровительный опыт.',
                        ua: 'Ми працюємо з найкращими професіоналами, щоб надати вам комплексний оздоровчий досвід.',
                        ca: 'Treballem amb els millors professionals per oferir-te una experiència completa de benestar.'
                    })}
                </p>
            </motion.div>

            <div style={gridStyle}>
                {partners.map((partner, index) => (
                    <motion.div
                        key={partner.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={cardStyle}
                        whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                    >
                        <div style={logoWrapperStyle}>{partner.logo}</div>
                        <h3 style={partnerNameStyle}>{partner.name}</h3>
                        <p style={partnerDescStyle}>{t(partner.description)}</p>
                        <a href={partner.link} style={linkStyle} target="_blank" rel="noopener noreferrer">
                            {t('Visit Website', { en: 'Visit Website', es: 'Visitar Sitio', ru: 'Перейти на сайт', ua: 'Перейти на сайт', ca: 'Visitar Lloc Web' })} <ExternalLink size={14} />
                        </a>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const containerStyle = {
    padding: '8rem 2rem 4rem',
    maxWidth: '1200px',
    margin: '0 auto',
    minHeight: '80vh'
};

const headerStyle = {
    textAlign: 'center',
    marginBottom: '4rem'
};

const titleStyle = {
    fontSize: '3rem',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #fff 0%, #aaa 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
};

const subtitleStyle = {
    color: 'rgba(255,255,255,0.6)',
    maxWidth: '600px',
    margin: '0 auto',
    fontSize: '1.2rem'
};

const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem'
};

const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '24px',
    padding: '2rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    transition: 'all 0.3s ease'
};

const logoWrapperStyle = {
    fontSize: '3rem',
    marginBottom: '1rem'
};

const partnerNameStyle = {
    fontSize: '1.5rem',
    color: 'var(--color-accent)'
};

const partnerDescStyle = {
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.6',
    fontSize: '1rem'
};

const linkStyle = {
    marginTop: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--color-nature-green)',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    background: 'rgba(139, 154, 71, 0.1)',
    transition: 'all 0.2s ease'
};

export default PartnersPage;
