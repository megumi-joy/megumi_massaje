import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Play, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // We might need to install this, or use simple rendering for MVP

// Simple markdown renderer fallback if library not present
const MarkdownRenderer = ({ content }) => {
    return (
        <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h2 key={i} style={{ marginTop: '1rem' }}>{line.substring(2)}</h2>;
                if (line.startsWith('- ')) return <li key={i} style={{ marginLeft: '1rem' }}>{line.substring(2)}</li>;
                return <p key={i}>{line}</p>;
            })}
        </div>
    );
};

const LessonViewer = ({ lesson, onBack }) => {
    const { t, language } = useLanguage();
    const [activeQuiz, setActiveQuiz] = useState(null);
    const [quizResult, setQuizResult] = useState(null);

    const handleQuizAnswer = (qIndex, optionIndex) => {
        const isCorrect = lesson.quiz[qIndex].correct === optionIndex;
        setQuizResult({ qIndex, isCorrect });
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: 'var(--color-text-primary)' }}
        >
            <button
                onClick={onBack}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: 'var(--color-accent)', cursor: 'pointer', marginBottom: '1rem' }}
            >
                <ArrowLeft size={20} /> {t('Back to Course', { en: 'Back to Course', ru: 'Назад к курсу' })}
            </button>

            <h1 style={{ color: 'var(--color-nature-green)', marginBottom: '1.5rem' }}>
                {t(lesson.title[language] || lesson.title.en, lesson.title)}
            </h1>

            <div style={{ background: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
                <MarkdownRenderer content={lesson.content} />
            </div>

            {lesson.videoId && (
                <div style={{ marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--color-accent)' }}>
                    <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${lesson.videoId}`}
                        title="Lesson Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            )}

            {lesson.quiz && lesson.quiz.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={20} color="var(--color-accent)" />
                        {t('Knowledge Check', { en: 'Knowledge Check', ru: 'Проверка знаний' })}
                    </h3>

                    {lesson.quiz.map((q, idx) => (
                        <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginBottom: '1rem' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{t(q.question[language] || q.question.en, q.question)}</p>
                            <div style={{ display: 'grid', gap: '0.5rem' }}>
                                {q.options.map((opt, optIdx) => (
                                    <button
                                        key={optIdx}
                                        onClick={() => handleQuizAnswer(idx, optIdx)}
                                        style={{
                                            padding: '0.8rem',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            background: quizResult?.qIndex === idx && quizResult?.isCorrect && lesson.quiz[idx].correct === optIdx
                                                ? 'rgba(0, 255, 0, 0.2)'
                                                : quizResult?.qIndex === idx && !quizResult?.isCorrect && optIdx === activeQuiz
                                                    ? 'rgba(255, 0, 0, 0.2)'
                                                    : 'transparent',
                                            color: 'white',
                                            textAlign: 'left',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                            {quizResult?.qIndex === idx && (
                                <div style={{ marginTop: '1rem', color: quizResult.isCorrect ? 'var(--color-nature-green)' : 'var(--color-error)' }}>
                                    {quizResult.isCorrect ? t('Correct!', { en: 'Correct!', ru: 'Верно!' }) : t('Try Again', { en: 'Try Again', ru: 'Попробуйте снова' })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Vtuber / Assistant Placeholder */}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '120px',
                height: '180px',
                pointerEvents: 'none' // Click-through for now
            }}>
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Megumi&backgroundColor=ffdfbf"
                    alt="Assistant"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))' }}
                />
                <div style={{
                    position: 'absolute',
                    top: '-40px',
                    left: '-100px',
                    background: 'white',
                    color: 'black',
                    padding: '0.5rem',
                    borderRadius: '12px 12px 0 12px',
                    fontSize: '0.8rem',
                    width: '140px',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                    {t('Keep going! You are doing great!', { en: 'Keep going! You are doing great!', ru: 'Продолжай! Ты молодец!' })}
                </div>
            </div>

        </motion.div>
    );
};

export default LessonViewer;
