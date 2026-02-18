import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useLanguage } from '../context/LanguageContext';
import { SERVICES } from '../data/services';
import { Edit, LogOut } from 'lucide-react';

const AdminDashboard = () => {
    const { t } = useLanguage();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [activeTab, setActiveTab] = useState('bookings'); // bookings, services, events
    const [selectedLocation, setSelectedLocation] = useState('sitges');
    const [bookings, setBookings] = useState([]);
    const [servicesData, setServicesData] = useState(SERVICES);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', date: '', location: 'Sitges', type: 'game', price: 0, description: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Simple PIN auth for MVP as requested
    const handleLogin = (e) => {
        e.preventDefault();
        if (pin === '1234') { // TODO: Move to Env var or real Auth
            setIsAuthenticated(true);
        } else {
            alert('Invalid PIN');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            if (activeTab === 'bookings' && supabase) {
                fetchBookings();
            } else if (activeTab === 'services' && supabase) {
                fetchServicesFromDB();
            } else if (activeTab === 'events' && supabase) {
                fetchEvents();
            }
        }
    }, [isAuthenticated, activeTab, fetchBookings, fetchServicesFromDB]);

    const fetchEvents = async () => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (error) console.error('Error fetching events:', error);
        else setEvents(data || []);
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            if (supabase) {
                const { error } = await supabase
                    .from('events')
                    .insert([newEvent]);

                if (error) throw error;
                alert('Event created successfully!');
                setNewEvent({ title: '', date: '', location: 'Sitges', type: 'game', price: 0, description: '' });
                fetchEvents();
            }
        } catch (err) {
            console.error('Error creating event:', err);
            alert('Failed to create event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        try {
            if (supabase) {
                const { error } = await supabase
                    .from('events')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                fetchEvents();
            }
        } catch (err) {
            console.error('Error deleting event:', err);
        }
    };

    const fetchServicesFromDB = useCallback(async () => {
        if (!supabase) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*');

            if (error) throw error;
            if (data && data.length > 0) {
                // For MVP, we still group them by category if we want to match the UI
                const grouped = data.reduce((acc, service) => {
                    const cat = service.category || 'massage';
                    if (!acc[cat]) acc[cat] = { title: service.category_title || { en: cat }, items: [] };
                    acc[cat].items.push(service);
                    return acc;
                }, {});
                setServicesData(grouped);
            }
        } catch (err) {
            console.error('Error fetching services:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchBookings = useCallback(async () => {
        if (!supabase) return;
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .eq('location', selectedLocation)
            .order('date', { ascending: true });

        if (error) console.error('Error fetching bookings:', error);
        else setBookings(data || []);
    }, [selectedLocation]);

    if (!isAuthenticated) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--color-bg-primary)' }}>
                <form onSubmit={handleLogin} style={{ padding: '2rem', background: 'var(--color-bg-secondary)', borderRadius: '16px', border: '1px solid var(--color-accent)' }}>
                    <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Admin Login</h2>
                    <input
                        type="password"
                        placeholder="Enter PIN"
                        value={pin}
                        onChange={e => setPin(e.target.value)}
                        style={{ padding: '0.8rem', borderRadius: '8px', border: 'none', marginBottom: '1rem', width: '100%' }}
                    />
                    <button type="submit" style={{ width: '100%', padding: '0.8rem', background: 'var(--color-accent)', color: 'var(--color-bg-primary)', borderRadius: '8px', fontWeight: 'bold' }}>Login</button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Admin Dashboard</h1>
                <button onClick={() => setIsAuthenticated(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-error)' }}>
                    <LogOut size={20} /> Logout
                </button>
            </header>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('bookings')}
                    style={{
                        padding: '1rem',
                        background: activeTab === 'bookings' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                        color: activeTab === 'bookings' ? 'var(--color-bg-primary)' : 'inherit',
                        borderRadius: '8px',
                        flex: 1
                    }}
                >
                    Bookings
                </button>
                <button
                    onClick={() => setActiveTab('services')}
                    style={{
                        padding: '1rem',
                        background: activeTab === 'services' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                        color: activeTab === 'services' ? 'var(--color-bg-primary)' : 'inherit',
                        borderRadius: '8px',
                        flex: 1
                    }}
                >
                    Manage Services
                </button>
                <button
                    onClick={() => setActiveTab('events')}
                    style={{
                        padding: '1rem',
                        background: activeTab === 'events' ? 'var(--color-accent)' : 'var(--color-bg-secondary)',
                        color: activeTab === 'events' ? 'var(--color-bg-primary)' : 'inherit',
                        borderRadius: '8px',
                        flex: 1
                    }}
                >
                    Manage Events
                </button>
            </div>

            {activeTab === 'bookings' && (
                <div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <button onClick={() => setSelectedLocation('sitges')} style={{ padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--color-accent)', background: selectedLocation === 'sitges' ? 'var(--color-accent)' : 'transparent', color: selectedLocation === 'sitges' ? 'var(--color-bg-primary)' : 'var(--color-accent)' }}>Sitges</button>
                        <button onClick={() => setSelectedLocation('murcia')} style={{ padding: '0.5rem 1rem', borderRadius: '50px', border: '1px solid var(--color-accent)', background: selectedLocation === 'murcia' ? 'var(--color-accent)' : 'transparent', color: selectedLocation === 'murcia' ? 'var(--color-bg-primary)' : 'var(--color-accent)' }}>Murcia</button>
                    </div>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {bookings.length === 0 ? (
                            <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No bookings found for {selectedLocation}.</p>
                        ) : (
                            bookings.map(booking => (
                                <div key={booking.id} style={{ padding: '1rem', background: 'var(--color-bg-secondary)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h3 style={{ margin: 0 }}>{booking.name}</h3>
                                        <p>{booking.date} at {booking.time}</p>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>{booking.phone}</p>
                                        {booking.notes && <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>&quot;{booking.notes}&quot;</p>}
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ background: 'var(--color-nature-green)', color: 'var(--color-bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                                            {booking.service_name}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'services' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2>Current Services</h2>
                        <button
                            disabled
                            style={{ padding: '0.5rem 1rem', background: 'var(--color-nature-green)', color: 'white', borderRadius: '4px', opacity: 0.5 }}
                        >
                            + Add New (Coming Soon)
                        </button>
                    </div>

                    {isLoading ? (
                        <p>Loading services...</p>
                    ) : (
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {Object.entries(servicesData).map(([catKey, category]) => (
                                <div key={catKey} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                    <h3 style={{ color: 'var(--color-accent)' }}>{t(category.title)}</h3>
                                    <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {category.items.map(service => (
                                            <div key={service.id} style={{ padding: '0.5rem 1rem', background: 'var(--color-bg-secondary)', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span>{t(service.name)}</span>
                                                <button style={{ color: 'var(--color-accent)' }}><Edit size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'events' && (
                <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>Manage Events & Games</h2>

                    <form onSubmit={handleCreateEvent} style={{ background: 'var(--color-bg-secondary)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <h3 style={{ gridColumn: 'span 2', marginTop: 0 }}>Create New Event</h3>
                        <input type="text" placeholder="Title" required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} style={{ padding: '0.8rem', borderRadius: '8px', border: 'none' }} />
                        <input type="datetime-local" required value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} style={{ padding: '0.8rem', borderRadius: '8px', border: 'none' }} />
                        <select value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })} style={{ padding: '0.8rem', borderRadius: '8px', border: 'none' }}>
                            <option value="game">Game (Mafia, Spyfall)</option>
                            <option value="class">Class / Workshop</option>
                            <option value="meeting">Meeting / Social</option>
                        </select>
                        <select value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} style={{ padding: '0.8rem', borderRadius: '8px', border: 'none' }}>
                            <option value="Sitges">Sitges</option>
                            <option value="Murcia">Murcia</option>
                            <option value="Online">Online</option>
                        </select>
                        <textarea placeholder="Description" required value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} style={{ gridColumn: 'span 2', padding: '0.8rem', borderRadius: '8px', border: 'none', minHeight: '80px' }} />
                        <input type="number" placeholder="Price (0 for free)" value={newEvent.price} onChange={e => setNewEvent({ ...newEvent, price: Number(e.target.value) })} style={{ padding: '0.8rem', borderRadius: '8px', border: 'none' }} />
                        <button type="submit" style={{ gridColumn: 'span 2', padding: '1rem', background: 'var(--color-nature-green)', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Create Event</button>
                    </form>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {events.map(event => (
                            <div key={event.id} style={{ padding: '1.5rem', background: 'var(--color-bg-secondary)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <span style={{ background: 'var(--color-accent)', color: 'var(--color-bg-primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{event.type.toUpperCase()}</span>
                                        <span style={{ opacity: 0.7 }}>{new Date(event.date).toLocaleString()}</span>
                                    </div>
                                    <h3 style={{ margin: 0 }}>{event.title}</h3>
                                    <p style={{ margin: '0.5rem 0', opacity: 0.8 }}>{event.description}</p>
                                    <div style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                                        {event.location} • {event.price === 0 ? 'Free' : `€${event.price}`}
                                    </div>
                                </div>
                                <button onClick={() => handleDeleteEvent(event.id)} style={{ padding: '0.5rem', background: 'var(--color-error)', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                                    <LogOut size={16} /> Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
