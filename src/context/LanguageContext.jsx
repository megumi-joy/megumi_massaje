import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'ua', name: 'Українська', flag: '🇺🇦' },
    { code: 'ca', name: 'Català', flag: '🏴󠁥󠁳󠁣󠁴󠁿' }, // Using flag for Catalonia region representation or similar
    { code: 'va', name: 'Valencià', flag: '🥘' } // Added Valenciano
];

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('es'); // Default to Spanish as per locale

    const t = (key, customTranslations) => {
        if (typeof key === 'object' && key !== null) {
            return key[language] || key['en'] || '';
        }

        // Dynamic shared UI translations
        const translations = {
            'Harmonizing Mind, Body, and Soul': {
                en: 'Harmonizing Mind, Body, and Soul',
                es: 'Cuidando tu mente, cuerpo y alma.',
                ru: 'Гармония души, разума и тела',
                ua: 'Гармонія душі, розуму та тіла',
                ca: 'Cuidant la teva ment, cos i ànima.',
                va: 'Cuidant la teva ment, cos i ànima.'
            },
            'Who We Are': {
                en: 'Who We Are',
                es: 'Quien somos',
                ru: 'О нас',
                ua: 'Про нас',
                ca: 'Qui som',
                va: 'Qui som'
            },
            'Treatments': {
                en: 'Treatments',
                es: 'Tratamientos',
                ru: 'Процедуры',
                ua: 'Процедури',
                ca: 'Tractaments',
                va: 'Tractaments'
            },
            'Benefits': {
                en: 'Benefits',
                es: 'Beneficios',
                ru: 'Польза',
                ua: 'Користь',
                ca: 'Beneficis',
                va: 'Beneficis'
            },
            'Contact': {
                en: 'Contact',
                es: 'Contacto',
                ru: 'Контакты',
                ua: 'Контакти',
                ca: 'Contacte',
                va: 'Contacte'
            },
            'Location': {
                en: 'Location',
                es: 'Ubicación',
                ru: 'Адрес',
                ua: 'Адреса',
                ca: 'Ubicació',
                va: 'Ubicació'
            },
            'UNESCO Heritage': {
                en: 'UNESCO Intangible Cultural Heritage',
                es: 'Patrimonio Cultural Inmaterial de la UNESCO',
                ru: 'Нематериальное культурное наследие ЮНЕСКО',
                ua: 'Нематеріальна культурна спадщина ЮНЕСКО',
                ca: 'Patrimoni Cultural Inmaterial de la UNESCO',
                va: 'Patrimoni Cultural Inmaterial de la UNESCO'
            }
        };

        if (translations[key]) {
            return translations[key][language] || translations[key]['en'] || key;
        }

        if (customTranslations && customTranslations[language]) {
            return customTranslations[language];
        }
        if (customTranslations && customTranslations['en']) {
            return customTranslations['en'];
        }
        return key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
