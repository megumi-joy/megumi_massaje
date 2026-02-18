import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Phone } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useLanguage();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: {
                            full_name: formData.fullName,
                            phone: formData.phone,
                        },
                    },
                });
                if (error) throw error;
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2000
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    style={{
                        background: 'var(--color-bg-secondary)',
                        padding: '2rem',
                        borderRadius: '24px',
                        width: '90%',
                        maxWidth: '400px',
                        border: '1px solid var(--color-accent)',
                        position: 'relative'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--color-text-primary)', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>

                    <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--color-accent)' }}>
                        {isLogin ? t('Login', { en: 'Login', es: 'Iniciar Sesión' }) : t('Create Account', { en: 'Create Account', es: 'Crear Cuenta' })}
                    </h2>

                    {error && (
                        <div style={{ background: 'rgba(255,0,0,0.1)', color: 'var(--color-error)', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {!isLogin && (
                            <>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder={t('Full Name', { en: 'Full Name', es: 'Nombre Completo' })}
                                        required
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder={t('Phone', { en: 'Phone', es: 'Teléfono' })}
                                        value={formData.phone}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                    />
                                </div>
                            </>
                        )}

                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
                            <input
                                type="password"
                                name="password"
                                placeholder={t('Password', { en: 'Password', es: 'Contraseña' })}
                                required
                                value={formData.password}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: '1rem',
                                background: 'var(--color-accent)',
                                color: 'var(--color-bg-primary)',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '0.5rem',
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? 'Processing...' : (isLogin ? t('Login') : t('Sign Up', { en: 'Sign Up', es: 'Registrarse' }))}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                        {isLogin ? t("Don't have an account?", { en: "Don't have an account?", es: "¿No tienes cuenta?" }) : t("Already have an account?", { en: "Already have an account?", es: "¿Ya tienes cuenta?" })}{' '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-accent)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            {isLogin ? t('Sign Up') : t('Login')}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AuthModal;
