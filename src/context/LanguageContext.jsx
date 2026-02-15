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
            },
            'WhoWeAreContent': {
                en: 'At Megumi Massaje, we combine millenary Oriental wisdom with modern comfort. Our mission is to restore your natural balance through authentic techniques and personalized care.',
                es: 'En Megumi Massaje, combinamos la sabiduría milenaria oriental con el confort moderno. Nuestra misión es restaurar tu equilibrio natural a través de técnicas auténticas y atención personalizada.',
                ru: 'В Megumi Massaje мы сочетаем тысячелетнюю восточную мудрость с современным комфортом. Наша миссия — восстановить ваш естественный баланс с помощью аутентичных техник и индивидуального подхода.',
                ua: 'У Megumi Massaje ми поєднуємо тисячолітню східну мудрість із сучасним комфортом. Наша місія — відновити ваш природний баланс за допомогою автентичних технік та індивідуального підходу.',
                ca: 'A Megumi Massaje, combinem la saviesa mil·lenària oriental amb el confort modern. La nostra missió és restaurar el teu equilibri natural a través de tècniques autèntiques i atenció personalitzada.',
                va: 'A Megumi Massaje, combinem la saviesa mil·lenària oriental amb el confort modern. La nostra missió és restaurar el teu equilibri natural a través de tècniques autèntiques i atenció personalitzada.'
            },
            'BenefitsContent': {
                en: '• Reduces stress and anxiety\n• Improves blood circulation\n• Relieves chronic muscle pain\n• Increases flexibility and range of motion\n• Boosts immune system function',
                es: '• Reduce el estrés y la ansiedad\n• Mejora la circulación sanguínea\n• Alivia el dolor muscular crónico\n• Aumenta la flexibilidad y el rango de movimiento\n• Refuerza el sistema inmunológico',
                ru: '• Снижает стресс и тревожность\n• Улучшает кровообращение\n• Облегчает хроническую мышечную боль\n• Увеличивает гибкость и диапазон движений\n• Укрепляет иммунную систему',
                ua: '• Знижує стрес та тривожність\n• Покращує кровообіг\n• Полегшує хронічний м’язовий біль\n• Збільшує гнучкість та діапазон рухів\n• Зміцнює імунну систему',
                ca: '• Redueix l\'estrès i l\'ansietat\n• Millora la circulació sanguínia\n• Alivia el dolor muscular crònic\n• Augmenta la flexibilitat i el rang de moviment\n• Reforça el sistema immunològic',
                va: '• Redueix l\'estrès i l\'ansietat\n• Millora la circulació sanguínia\n• Alivia el dolor muscular crònic\n• Augmenta la flexibilitat i el rang de movimento\n• Reforça el sistema immunològic'
            },
            'FohowContent': {
                en: 'FOHOW Bioenergy Therapy combines traditional Chinese medicine with modern technology. It uses a specialized device to regulate bioelectricity, improve Qi flow, and promote deep cellular detoxification and healing.',
                es: 'La terapia de bioenergía FOHOW combina la medicina tradicional china con la tecnología moderna. Utiliza un dispositivo especializado para regular la bioelectricidad, mejorar el flujo de Qi y promover la desintoxicación y curación celular profunda.',
                ru: 'Биоэнерготерапия FOHOW сочетает в себе традиционную китайскую медицину с современными технологиями. С помощью специального прибора она регулирует биоэлектричество, улучшает ток энергии Ци и способствует глубокой клеточной детоксикации и заживлению.',
                ua: 'Біоенерготерапія FOHOW поєднує в собі традиційну китайську медицину з сучасними технологіями. За допомогою спеціального приладу вона регулює біоелектрику, покращує потік енергії Ці та сприяє глибокій клітинній детоксикації та загоєнню.',
                ca: 'La teràpia de bioenergia FOHOW combina la medicina tradicional xinesa amb la tecnologia moderna. Utilitza un dispositiu especialitzat per regular la bioelectricitat, millorar el flux de Qi i promoure la desintoxicació i curació cel·lular profunda.',
                va: 'La teràpia de bioenergia FOHOW combina la medicina tradicional xinesa amb la tecnologia moderna. Utilitza un dispositiu especialitzat per regular la bioelectricitat, millorar el flux de Qi i promoure la desintoxicació i curació cel·lular profunda.'
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
