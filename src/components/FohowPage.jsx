import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft, Calendar, Info } from 'lucide-react';

const FohowPage = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const benefitsRef = useRef(null);

    // Initial simple translations for this page specifically. 
    // In a real app we'd move these to the central context or a translation file.
    const localT = (key) => {
        const translations = {
            'Back to Home': {
                en: 'Back to Home',
                es: 'Volver al Inicio',
                ru: 'На главную',
                ua: 'На головну',
                ca: 'Tornar a l\'Inici',
                va: 'Tornar a l\'Inici'
            },
            'Book Session': {
                en: 'Book Session',
                es: 'Reservar Sesión',
                ru: 'Записаться',
                ua: 'Записатися',
                ca: 'Reservar Sessió',
                va: 'Reservar Sessió'
            },
            'Fohow Description': {
                en: 'Fohow Bioenergy Therapy is a revolutionary technique that combines traditional Chinese medicine with modern bioinformatics. By regulating the body\'s bioelectricity, it stimulates cellular regeneration, improves Qi flow, and detoxifies the body at a deep level.',
                es: 'La terapia de bioenergía Fohow es una técnica revolucionaria que combina la medicina tradicional china con la bioinformática moderna. Al regular la bioelectricidad del cuerpo, estimula la regeneración celular, mejora el flujo de Qi y desintoxica el cuerpo a un nivel profundo.',
                ru: 'Биоэнергетическая терапия Fohow — это революционная техника, сочетающая традиционную китайскую медицину с современной биоинформатикой. Регулируя биоэлектричество организма, она стимулирует клеточную регенерацию, улучшает поток Ци и глубоко очищает организм.',
                ua: 'Біоенергетична терапія Fohow — це революційна техніка, що поєднує традиційну китайську медицину з сучасною біоінформатикою. Регулюючи біоелектрику організму, вона стимулює клітинну регенерацію, покращує потік Ці та глибоко очищує організм.',
                ca: 'La teràpia de bioenergia Fohow és una tècnica revolucionària que combina la medicina tradicional xinesa amb la bioinformàtica moderna. En regular la bioelectricitat del cos, estimula la regeneració cel·lular, millora el flux de Qi i desintoxica el cos a un nivell profund.',
                va: 'La teràpia de bioenergia Fohow és una tècnica revolucionària que combina la medicina tradicional xinesa amb la bioinformàtica moderna. En regular la bioelectricitat del cos, estimula la regeneració cel·lular, millora el flux de Qi i desintoxica el cos a un nivell profund.'
            },
            'Key Benefits': {
                en: 'Key Benefits',
                es: 'Beneficios Clave',
                ru: 'Ключевые преимущества',
                ua: 'Ключові переваги',
                ca: 'Beneficis Clau',
                va: 'Beneficis Clau'
            }
        };
        return translations[key] ? (translations[key][t('lang') || 'en'] || translations[key]['en']) : t(key);
    };

    const benefits = [
        "Detoxification of blood",
        "Improvement of blood circulation",
        "Regulation of metabolism",
        "Relief from muscle and joint pain",
        "Strengthening of the immune system",
        "Correction of the spine",
        "Improvement of sleep quality",
        "Cellular activation"
    ];

    return (
        <div style={{ background: 'var(--color-bg-primary)', minHeight: '100vh', color: 'var(--color-text-primary)' }}>

            {/* Header / Nav */}
            <nav style={{
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'rgba(26, 11, 46, 0.95)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
            }}>
                <button
                    onClick={() => navigate('/')}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    <ArrowLeft size={20} />
                    {localT('Back to Home')}
                </button>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-accent)' }}>
                    FOHOW
                </div>
                <button
                    onClick={() => document.getElementById('fohow-booking')?.scrollIntoView({ behavior: 'smooth' })}
                    style={{
                        background: 'var(--color-accent)',
                        color: 'var(--color-bg-primary)',
                        padding: '0.6rem 1.2rem',
                        borderRadius: '50px',
                        fontWeight: 'bold',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center'
                    }}
                >
                    <Calendar size={16} />
                    {localT('Book Session')}
                </button>
            </nav>

            <main className="container" style={{ padding: '2rem' }}>

                {/* Hero Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ textAlign: 'center', margin: '2rem 0 4rem' }}
                >
                    <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--color-nature-green)' }}>
                        Fohow Bioenergetic Massage
                    </h1>
                    <p style={{
                        fontSize: '1.2rem',
                        lineHeight: '1.8',
                        color: 'var(--color-text-secondary)',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        {localT('Fohow Description')}
                    </p>
                </motion.section>

                {/* Info Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '3rem',
                    marginBottom: '4rem'
                }}>
                    {/* Image Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{
                            borderRadius: '24px',
                            overflow: 'hidden',
                            height: '400px',
                            background: 'url(https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=800) center/cover',
                            border: '1px solid var(--color-accent)',
                            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                        }}
                    >
                        {/* We can replace this URL with a real Fohow image later */}
                    </motion.div>

                    {/* Benefits List */}
                    <motion.div
                        ref={benefitsRef}
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>{localT('Key Benefits')}</h2>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {benefits.map((benefit, i) => (
                                <motion.li
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        marginBottom: '1rem',
                                        fontSize: '1.1rem',
                                        color: 'var(--color-text-secondary)'
                                    }}
                                >
                                    <CheckCircle size={20} color="var(--color-nature-green)" />
                                    {t(benefit)}
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Detailed Info Card */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        background: 'rgba(139, 154, 71, 0.1)',
                        padding: '3rem',
                        borderRadius: '24px',
                        marginBottom: '4rem',
                        borderLeft: '4px solid var(--color-nature-green)'
                    }}
                >
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                        <Info size={30} color="var(--color-nature-green)" />
                        <h3 style={{ fontSize: '1.5rem', margin: 0 }}>The Science Behind Fohow</h3>
                    </div>
                    <p style={{ lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
                        The Fohow Bioenergy Massager works by converting electrical impulses into bioelectricity, which matches the electric charge of human cells. Through the use of conductive gloves, the therapist delivers this energy into the client's meridians. This process helps to clear blockages, improve blood circulation, and restore the body's natural balance. It is often described as combining the effects of acupuncture, massage, cupping, and gua sha in a single treatment.
                    </p>
                </motion.section>

                {/* Booking Call to Action */}
                <div id="fohow-booking" style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Ready to experience the difference?</h2>
                    <button
                        onClick={() => navigate('/', { state: { scrollTo: 'treatments' } })}
                        style={{
                            background: 'var(--color-accent)',
                            color: 'var(--color-bg-primary)',
                            padding: '1rem 3rem',
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            fontSize: '1.2rem',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 0 20px var(--color-accent-glow)'
                        }}
                    >
                        {localT('Book Session')}
                    </button>
                    <p style={{ marginTop: '1rem', opacity: 0.7 }}>
                        *Select "Fohow Bioenergetic Massage" from our treatment list.
                    </p>
                </div>

            </main>
        </div>
    );
};

export default FohowPage;
