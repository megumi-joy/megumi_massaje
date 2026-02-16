export const SERVICES = {
    massage: {
        title: {
            en: "Traditional Thai & Wellness Massages",
            es: "Masajes Tradicionales y de Bienestar",
            ru: "Традиционный Тайский и Велнес Массаж",
            ua: "Традиційний Тайський та Велнес Масаж",
            ca: "Massatges Tradicionals i de Benestar",
            va: "Massatges Tradicionals i de Benestar"
        },
        items: [
            {
                id: "thai-traditional",
                name: {
                    en: "Traditional Thai Massage",
                    es: "Masaje Tradicional Tailandés",
                    ru: "Традиционный Тайский Массаж",
                    ua: "Традиційний Тайський Масаж",
                    ca: "Massatge Tradicional Tailandès",
                    va: "Massatge Tradicional Tailandès"
                },
                description: {
                    en: "Ancient healing system combining acupressure and yoga stretching. Recognized by UNESCO.",
                    es: "Sistema de curación antiguo que combina acupresión y estiramientos de yoga. Reconocido por la UNESCO.",
                    ru: "Древняя система исцеления, сочетающая точечный массаж и растяжку йоги. Признано ЮНЕСКО.",
                    ua: "Стародавня система зцілення, що поєднує точковий масаж і розтяжку йоги. Визнано ЮНЕСКО.",
                    ca: "Antic sistema de curació que combina acupressió i estiraments de ioga. Reconegut per la UNESCO.",
                    va: "Antic sistema de curació que combina acupressió i estiraments de ioga. Reconegut per la UNESCO."
                },
                image: "https://images.unsplash.com/photo-1544161515-4ae6ce6dbec6?auto=format&fit=crop&q=80&w=1200",
                prices: [
                    { duration: 45, price: 46 },
                    { duration: 60, price: 60 },
                    { duration: 90, price: 85 },
                    { duration: 120, price: 115 }
                ]
            },
            {
                id: "thai-back",
                name: {
                    en: "Thai Back Massage",
                    es: "Masaje Tailandés de espalda",
                    ru: "Тайский массаж спины",
                    ua: "Тайський масаж спини",
                    ca: "Massatge Tailandès d'esquena",
                    va: "Massatge Tailandès d'esquena"
                },
                description: {
                    en: "Focuses on the entire back, shoulders, neck, and head. Ideal for neck and back pain.",
                    es: "Es un masaje en toda la espalda, hombros, cuello y cabeza, adecuado para personas con dolores cervicales.",
                    ru: "Массаж всей спины, плеч, шеи и головы. Идеально подходит при болях в шее и спине.",
                    ua: "Масаж всієї спини, плечей, шиї та голови. Ідеально підходить при болях у шиї та спині.",
                    ca: "És un massatge a tota l'esquena, espatlles, coll i cap, adequat per a persones amb dolors cervicals.",
                    va: "És un massatge a tota l'esquena, espatlles, coll i cap, adequat per a persones amb dolors cervicals."
                },
                image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc206e?auto=format&fit=crop&q=80&w=1200",
                prices: [
                    { duration: 30, price: 35 },
                    { duration: 45, price: 46 },
                    { duration: 60, price: 60 }
                ]
            },
            {
                id: "aromatherapy",
                name: {
                    en: "Aromatherapy Massage",
                    es: "Masaje Aromaterapia",
                    ru: "Ароматерапевтический массаж",
                    ua: "Ароматерапевтичний масаж",
                    ca: "Massatge Aromateràpia",
                    va: "Massatge Aromateràpia"
                },
                description: {
                    en: "Gentle and relaxing body massage with essential oils for body and mind relaxation.",
                    es: "Suave y relajante masaje corporal con aceites esenciales para la relajación de cuerpo y mente.",
                    ru: "Мягкий и расслабляющий массаж тела с эфирными маслами для расслабления тела и ума.",
                    ua: "М'який та розслаблюючий масаж тіла з ефірними оліями для розслаблення тіла та розуму.",
                    ca: "Suau i relaxant massatge corporal amb olis essencials per a la relaxació de cos i ment.",
                    va: "Suau i relaxant massatge corporal amb olis essencials per a la relaxació de cos i ment."
                },
                prices: [
                    { duration: 60, price: 65 },
                    { duration: 90, price: 89 },
                    { duration: 120, price: 119 }
                ]
            },
            {
                id: "thai-oil",
                name: {
                    en: "Thai Oil Massage",
                    es: "Masaje Aceite Tailandés",
                    ru: "Тайский Массаж с Маслом",
                    ua: "Тайський Масаж з Олією",
                    ca: "Massatge Tailandès amb Oli",
                    va: "Massatge Tailandès amb Oli"
                },
                description: {
                    en: "Intense massage with essential oils combining deep Thai techniques and pressure.",
                    es: "Masaje con aceite más intenso con técnicas tailandesas profundas y presiones para flexibilidad.",
                    ru: "Интенсивный массаж с маслами, сочетающий глубокие тайские техники и давление для гибкости.",
                    ua: "Інтенсивний масаж з оліями, що поєднує глибокі тайські техніки та тиск для гнучкості.",
                    ca: "Massatge amb oli més intens amb tècniques tailandeses profundes i pressions per a la flexibilitat.",
                    va: "Massatge amb oli més intens amb tècniques tailandeses profundes i pressions per a la flexibilitat."
                },
                prices: [
                    { duration: 60, price: 65 },
                    { duration: 90, price: 89 },
                    { duration: 120, price: 119 }
                ]
            },
            {
                id: "thai-herbal",
                name: {
                    en: "Thai Herbal Massage",
                    es: "Masaje Tailandés con Hierbas",
                    ru: "Тайский травяной массаж",
                    ua: "Тайський трав'яний масаж",
                    ca: "Massatge Tailandès amb Herbes",
                    va: "Massatge Tailandès amb Herbes"
                },
                description: {
                    en: "Thai technique using steamed herbal compresses to relax and soothe muscle pain.",
                    es: "Técnica que utiliza compresas de hierbas calientes al vapor para relajar y calmar el dolor muscular.",
                    ru: "Тайская техника с использованием распаренных травяных компрессов для снятия мышечной боли.",
                    ua: "Тайська техніка з використанням розпарених трав'яних компресів для зняття м'язового болю.",
                    ca: "Tècnica que utilitza compreses d'herbes calentes al vapor per relaxar i calmar el dolor muscular.",
                    va: "Tècnica que utilitza compreses d'herbes calentes al vapor per relaxar i calmar el dolor muscular."
                },
                image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200",
                prices: [
                    { duration: 60, price: 65 },
                    { duration: 90, price: 89 }
                ]
            },
            {
                id: "reflexology",
                name: {
                    en: "Thai Reflexology",
                    es: "Reflexología Tailandesa",
                    ru: "Тайская рефлексология",
                    ua: "Тайська рефлексологія",
                    ca: "Reflexologia Tailandesa",
                    va: "Reflexologia Tailandesa"
                },
                description: {
                    en: "Pressure therapy on specific foot points to balance biological systems and relieve leg pain.",
                    es: "Terapia de presión en puntos específicos de los pies para equilibrar sistemas y aliviar dolor.",
                    ru: "Терапия давления на точки стоп для балансировки систем организма и снятия боли в ногах.",
                    ua: "Терапія тиску на точки стоп для балансування систем організму та зняття болю в ногах.",
                    ca: "Teràpia de pressió en punts específics dels peus per equilibrar sistemes i alleujar dolor.",
                    va: "Teràpia de pressió en punts específics dels peus per equilibrar sistemes i alleujar dolor."
                },
                image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200",
                prices: [
                    { duration: 30, price: 30 },
                    { duration: 45, price: 44 }
                ]
            },
            {
                id: "lemongrass-special",
                name: {
                    en: "Lemongrass Special Massage",
                    es: "Masaje Especial Lemongrass",
                    ru: "Специальный массаж Лемонграсс",
                    ua: "Спеціальний масаж Лемонграс",
                    ca: "Massatge Especial Lemongrass",
                    va: "Massatge Especial Lemongrass"
                },
                description: {
                    en: "Premium combo of herbal massage, essential oil (Lemongrass/Orange), and reflexology.",
                    es: "Combinación especial de hierbas, masaje con aceite de Lemongrass o Naranja y reflexología.",
                    ru: "Премиальная комбинация травяного массажа, масел и рефлексологии.",
                    ua: "Преміальна комбінація трав'яного масажу, олій та рефлексології.",
                    ca: "Combinació especial d'herbes, massatge amb oli de Lemongrass o Taronja i reflexologia.",
                    va: "Combinació especial d'herbes, massatge amb oli de Lemongrass o Taronja i reflexologia."
                },
                image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200",
                prices: [
                    { duration: 90, price: 95 },
                    { duration: 120, price: 125 }
                ]
            }
        ]
    },
    manicure: {
        title: {
            en: "Manicure & Pedicure",
            es: "Manicura y Pedicura",
            ru: "Маникюр и Педикюр",
            ua: "Манікюр і Педикюр",
            ca: "Manicura i Pedicura",
            va: "Manicura i Pedicura"
        },
        items: [
            {
                id: "manicure-classic",
                name: {
                    en: "Classic Manicure",
                    es: "Manicura Clásica",
                    ru: "Классический Маникюр",
                    ua: "Класичний Манікюр",
                    ca: "Manicura Clàssica",
                    va: "Manicura Clàssica"
                },
                description: {
                    en: "Nail shaping, cuticle care, and polish.",
                    es: "Limado de uñas, cuidado de cutículas y esmaltado.",
                    ru: "Придание формы ногтям, уход за кутикулой и покрытие.",
                    ua: "Надання форми нігтям, догляд за кутикулою та покриття.",
                    ca: "Llimat d'ungles, cura de cutícules i esmaltat.",
                    va: "Llimat d'ungles, cura de cutícules i esmaltat."
                },
                prices: [
                    { duration: 45, price: 30 }
                ]
            }
        ]
    },
    fohow: {
        title: {
            en: "Fohow Therapy",
            es: "Terapia Fohow",
            ru: "Fohow Терапия",
            ua: "Fohow Терапія",
            ca: "Teràpia Fohow",
            va: "Teràpia Fohow"
        },
        items: [
            {
                id: "fohow-bioenergy",
                name: {
                    en: "Bioenergy Massage",
                    es: "Masaje Bioenergético",
                    ru: "Биоэнергетический Массаж",
                    ua: "Біоенергетичний Масаж",
                    ca: "Massatge Bioenergètic",
                    va: "Massatge Bioenergètic"
                },
                description: {
                    en: "Innovative technique using bio-currents to restore energy balance.",
                    es: "Técnica innovadora que utiliza biocorrientes para restaurar el equilibrio energético.",
                    ru: "Инновационная методика использования биотоков для восстановления энергетического баланса.",
                    ua: "Інноваційна методика використання біострумів для відновлення енергетичного балансу.",
                    ca: "Tècnica innovadora que utilitza biocorrents per restaurar l'equilibri energètic.",
                    va: "Tècnica innovadora que utilitza biocorrents per restaurar l'equilibri energètic."
                },
                prices: [
                    { duration: 60, price: 50 }
                ]
            }
        ]
    }
};
