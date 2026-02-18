import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, Calendar, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const UserDashboard = () => {
    const { t } = useLanguage();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (user) {
            // Fetch bookings for this user using their email (MVP approach) or user_id if linked
            // Assuming bookings are linked by email for now as per schema
            const { data } = await supabase
                .from('appointments')
                .select('*')
                .eq('phone', user.user_metadata.phone) // Or email if we updated schema
                .order('date', { ascending: false });

            // Also fetch event registrations
            const { data: events } = await supabase
                .from('event_registrations')
                .select('*, events(*)')
                .eq('user_email', user.email);

            // Combine or just show bookings for now
            setBookings(data || []);
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (!user) return <div style={{ padding: '4rem', textAlign: 'center' }}>Please log in.</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ marginBottom: '0.5rem' }}>{t('Welcome', { en: 'Welcome', es: 'Bienvenido' })}, {user.user_metadata.full_name || 'User'}</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>{user.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', borderRadius: '50px', border: '1px solid var(--color-error)', background: 'transparent', color: 'var(--color-error)', cursor: 'pointer' }}
                >
                    <LogOut size={18} /> {t('Logout', { en: 'Logout', es: 'Cerrar Sesión' })}
                </button>
            </div>

            <div style={{ display: 'grid', gap: '2rem' }}>
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '24px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(255,215,0,0.1)', borderRadius: '12px', color: 'var(--color-accent)' }}>
                            <Calendar size={24} />
                        </div>
                        <h2 style={{ margin: 0 }}>{t('My Bookings', { en: 'My Bookings', es: 'Mis Reservas' })}</h2>
                    </div>

                    {bookings.length === 0 ? (
                        <p style={{ opacity: 0.6, fontStyle: 'italic' }}>{t('No bookings found.', { en: 'No bookings found.', es: 'No se encontraron reservas.' })}</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {bookings.map(booking => (
                                <div key={booking.id} style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{booking.service_name}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{booking.time}</span>
                                        <span>•</span>
                                        <span>{booking.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    style={{ background: 'var(--color-bg-secondary)', padding: '2rem', borderRadius: '24px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
                            <User size={24} />
                        </div>
                        <h2 style={{ margin: 0 }}>{t('Profile Settings', { en: 'Profile Settings', es: 'Ajustes de Perfil' })}</h2>
                    </div>
                    <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <input type="text" value={user.user_metadata.full_name} disabled style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', opacity: 0.7 }} />
                        <input type="email" value={user.email} disabled style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'white', opacity: 0.7 }} />
                        <button type="button" disabled style={{ gridColumn: 'span 2', padding: '1rem', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'not-allowed' }}>
                            Edit Profile (Coming Soon)
                        </button>
                    </form>
                </motion.section>
            </div>
        </div>
    );
};

export default UserDashboard;
