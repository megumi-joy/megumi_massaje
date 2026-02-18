import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { COURSES } from '../data/courses';
import LessonViewer from './LessonViewer';
import { BookOpen, Award, Terminal } from 'lucide-react';

const TeachingPlatform = () => {
    const { t, language } = useLanguage();
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);

    if (selectedLesson) {
        return <LessonViewer lesson={selectedLesson} onBack={() => setSelectedLesson(null)} />;
    }

    return (
        <div style={{ padding: '2rem', minHeight: '80vh', maxWidth: '1200px', margin: '0 auto', paddingTop: '6rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', marginBottom: '4rem' }}
            >
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #ffd700, #ff8c00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {t('Megumi Academy', { en: 'Megumi Academy', ru: 'Академия Мегуми' })}
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
                    {t('Learn languages, programming, and wellness skills in an interactive environment.', { en: 'Learn languages, programming, and wellness skills in an interactive environment.', ru: 'Изучайте языки, программирование и навыки велнеса в интерактивной среде.' })}
                </p>
            </motion.div>

            {selectedCourse ? (
                // Course Detail View
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <button
                        onClick={() => setSelectedCourse(null)}
                        style={{ marginBottom: '2rem', background: 'transparent', border: '1px solid var(--color-accent)', padding: '0.5rem 1rem', borderRadius: '8px', color: 'var(--color-accent)', cursor: 'pointer' }}
                    >
                        ← {t('All Courses', { en: 'All Courses', ru: 'Все курсы' })}
                    </button>

                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t(selectedCourse.title[language] || selectedCourse.title.en, selectedCourse.title)}</h2>
                            <p style={{ lineHeight: '1.6', opacity: 0.8, marginBottom: '2rem' }}>
                                {t(selectedCourse.description[language] || selectedCourse.description.en, selectedCourse.description)}
                            </p>
                            <div style={{ background: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '16px' }}>
                                <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                                    {t('Course Curriculum', { en: 'Course Curriculum', ru: 'Программа Курса' })}
                                </h3>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {selectedCourse.lessons.map((lesson, idx) => (
                                        <div
                                            key={lesson.id}
                                            onClick={() => setSelectedLesson(lesson)}
                                            style={{
                                                padding: '1rem',
                                                background: 'rgba(0,0,0,0.2)',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,215,0,0.1)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--color-accent)', color: 'var(--color-bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                    {idx + 1}
                                                </div>
                                                <span>{t(lesson.title[language] || lesson.title.en, lesson.title)}</span>
                                            </div>
                                            <Play size={16} color="var(--color-text-secondary)" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                // Courses List View
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {COURSES.map(course => (
                        <motion.div
                            key={course.id}
                            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                            onClick={() => setSelectedCourse(course)}
                            style={{
                                background: 'var(--color-bg-secondary)',
                                borderRadius: '24px',
                                padding: '2rem',
                                border: '1px solid rgba(255,215,0,0.1)',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{course.icon}</div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                {t(course.title[language] || course.title.en, course.title)}
                            </h3>
                            <p style={{ opacity: 0.7, lineHeight: '1.6' }}>
                                {t(course.description[language] || course.description.en, course.description)}
                            </p>
                            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-accent)', fontWeight: 'bold' }}>
                                <BookOpen size={18} /> {course.lessons.length} {t('Lessons', { en: 'Lessons', ru: 'Уроков' })}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeachingPlatform;
