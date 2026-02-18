export const COURSES = [
    {
        id: 'spanish-basics',
        title: { en: 'Spanish Basics', es: 'Conceptos Básicos de Español', ru: 'Основы Испанского' },
        description: { en: 'Learn essential Spanish for daily life and travel.', ru: 'Изучите необходимый испанский для повседневной жизни и путешествий.' },
        icon: '🇪🇸',
        lessons: [
            {
                id: 'l1-greetings',
                title: { en: 'Greetings & Introductions', ru: 'Приветствия и Знакомство' },
                content: `
# Hola! (Hello!)
In this lesson, we will learn how to greet people in Spanish.

- **Hola** = Hello
- **Buenos días** = Good morning
- **Buenas tardes** = Good afternoon
- **Buenas noches** = Good evening / Good night
- **¿Cómo estás?** = How are you?

Watch the video below for pronunciation practice.
                `,
                videoId: 'dQw4w9WgXcQ', // Placeholder
                quiz: [
                    {
                        question: { en: 'How do you say "Good morning"?', ru: 'Как сказать "Доброе утро"?' },
                        options: ['Hola', 'Buenos días', 'Buenas noches'],
                        correct: 1
                    }
                ]
            },
            {
                id: 'l2-massage-terms',
                title: { en: 'Massage Vocabulary', ru: 'Словарь Массажа' },
                content: `
# Massage Terms
Key words for your appointment:

- **Masaje** = Massage
- **Dolor** = Pain
- **Espalda** = Back
- **Hombros** = Shoulders
- **Más fuerte** = Stronger
- **Más suave** = Softer
                `,
                videoId: '',
                quiz: [
                    {
                        question: { en: 'What implies "Back"?', ru: 'Что означает "Espalda"?' },
                        options: ['Leg', 'Back', 'Head'],
                        correct: 1
                    }
                ]
            }
        ]
    },
    {
        id: 'web-dev-101',
        title: { en: 'Web Development 101', es: 'Desarrollo Web 101', ru: 'Веб-разработка 101' },
        description: { en: 'Start your journey into coding with HTML & CSS.', ru: 'Начните свой путь в программировании с HTML и CSS.' },
        icon: '💻',
        lessons: [
            {
                id: 'l1-html',
                title: { en: 'Structure with HTML', ru: 'Структура с HTML' },
                content: `
# HTML Basics
HTML stands for HyperText Markup Language. It is the standard markup language for documents designed to be displayed in a web browser.

\`\`\`html
<h1>Hello World</h1>
<p>This is a paragraph.</p>
\`\`\`
                `,
                videoId: '',
                quiz: []
            }
        ]
    }
];
