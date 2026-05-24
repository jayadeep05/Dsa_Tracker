import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Lists from './pages/Lists';
import Analytics from './pages/Analytics';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import BackendRoadmap from './pages/BackendRoadmap';
import BackendTopic from './pages/BackendTopic';
import BackendCheckpoint from './pages/BackendCheckpoint';
import SystemDesignRoadmap from './pages/SystemDesignRoadmap';
import SystemDesignTopic from './pages/SystemDesignTopic';
import { getStreak } from './api/client';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function SectionSwitcher({ section, onSwitch }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Track configuration details
    const tracks = [
        {
            id: 'dsa',
            label: 'DSA',
            color: '#00d4aa',
            glow: 'rgba(0, 212, 170, 0.35)',
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
            )
        },
        {
            id: 'backend',
            label: 'Backend',
            color: '#a78bfa',
            glow: 'rgba(139, 92, 246, 0.35)',
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
            )
        },
        {
            id: 'system-design',
            label: 'System Design',
            color: '#60a5fa',
            glow: 'rgba(59, 130, 246, 0.35)',
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="16" y="16" width="6" height="6" rx="1" />
                    <rect x="2" y="16" width="6" height="6" rx="1" />
                    <rect x="9" y="2" width="6" height="6" rx="1" />
                    <path d="M12 8v8M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                </svg>
            )
        }
    ];

    const currentTrack = tracks.find(t => t.id === section) || tracks[0];

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        function handleKeyDown(event) {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            {/* Dropdown Trigger Pill */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(var(--white-rgb), 0.03)',
                    border: `1px solid ${isOpen ? currentTrack.color : 'rgba(var(--white-rgb), 0.08)'}`,
                    borderRadius: '20px',
                    padding: '0 12px',
                    height: '38px',
                    cursor: 'pointer',
                    outline: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                    color: currentTrack.color,
                    boxShadow: isOpen ? `0 0 16px -2px ${currentTrack.glow}` : 'none',
                    transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(var(--white-rgb), 0.06)';
                    e.currentTarget.style.borderColor = currentTrack.color;
                    e.currentTarget.style.boxShadow = `0 0 16px -2px ${currentTrack.color}`;
                }}
                onMouseLeave={e => {
                    if (!isOpen) {
                        e.currentTarget.style.background = 'rgba(var(--white-rgb), 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(var(--white-rgb), 0.08)';
                        e.currentTarget.style.boxShadow = 'none';
                    }
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {currentTrack.icon}
                    <span>{currentTrack.label}</span>
                </div>
                {/* Chevron icon rotates smoothly when dropdown is open */}
                <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{
                        marginLeft: '8px',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)',
                        color: 'var(--text-muted)'
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>

            {/* Dropdown Options Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    left: 0,
                    minWidth: '210px',
                    background: 'rgba(15, 15, 20, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '6px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.05)',
                    zIndex: 1100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    animation: 'dropdownFadeIn 0.25s cubic-bezier(0.25, 1, 0.5, 1) forwards'
                }}>
                    {tracks.map(t => {
                        const isSelected = t.id === section;
                        return (
                            <button
                                key={t.id}
                                onClick={() => {
                                    onSwitch(t.id);
                                    setIsOpen(false);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                    height: '36px',
                                    padding: '0 12px',
                                    border: 'none',
                                    borderRadius: '8px',
                                    background: isSelected ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                                    color: isSelected ? t.color : 'var(--text-muted)',
                                    fontSize: '12px',
                                    fontWeight: 650,
                                    cursor: 'pointer',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = t.color;
                                    e.currentTarget.style.background = `rgba(255, 255, 255, 0.06)`;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = isSelected ? t.color : 'var(--text-muted)';
                                    e.currentTarget.style.background = isSelected ? 'rgba(255, 255, 255, 0.03)' : 'transparent';
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: isSelected ? t.color : 'inherit', display: 'flex', alignItems: 'center' }}>
                                        {t.icon}
                                    </span>
                                    <span>{t.label}</span>
                                </div>
                                {isSelected && (
                                    <span style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: t.color,
                                        boxShadow: `0 0 8px ${t.color}`
                                    }} />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

function Navbar({ toggleTheme, isLight }) {
    const [streak, setStreak] = useState(0);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isSystemDesignSection = location.pathname.startsWith('/system-design');
    const isBackendSection = location.pathname.startsWith('/backend');
    const section = isSystemDesignSection ? 'system-design' : isBackendSection ? 'backend' : 'dsa';
    
    const trackColor = section === 'dsa' ? '#00d4aa' : section === 'backend' ? '#a78bfa' : '#60a5fa';

    useEffect(() => {
        if (user) {
            getStreak().then(r => setStreak(r.data.currentStreak)).catch(() => { });
        }
    }, [user]);

    if (!user) return null;

    const handleSectionSwitch = (newSection) => {
        if (newSection === 'system-design') {
            navigate('/system-design/roadmap');
        } else if (newSection === 'backend') {
            navigate('/backend/roadmap');
        } else {
            navigate('/');
        }
    };

    return (
        <nav className="navbar" style={{ '--track-accent': trackColor }}>
            <SectionSwitcher section={section} onSwitch={handleSectionSwitch} />

            <div className="nav-links" style={{ marginLeft: '12px' }}>
                {section === 'dsa' ? (
                    <>
                        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
                        <NavLink to="/study" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Study</NavLink>
                        <NavLink to="/lists" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Lists</NavLink>
                        <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Analytics</NavLink>
                        <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Search</NavLink>
                    </>
                ) : section === 'backend' ? (
                    <>
                        <NavLink to="/backend/roadmap" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Roadmap</NavLink>
                        <NavLink to="/backend/checkpoint/phase1" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Checkpoint</NavLink>
                    </>
                ) : (
                    <>
                        <NavLink to="/system-design/roadmap" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Roadmap</NavLink>
                    </>
                )}
            </div>
            {section === 'dsa' && streak >= 3 && <div className="nav-streak">🔥 {streak} day streak</div>}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {/* Premium Profile Avatar Pill with dynamic track glows */}
                <div 
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(var(--white-rgb), 0.03)',
                        border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px 4px 4px',
                        height: '36px', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(var(--white-rgb), 0.06)';
                        e.currentTarget.style.borderColor = `color-mix(in srgb, ${trackColor} 30%, transparent)`;
                        e.currentTarget.style.boxShadow = `0 0 12px -3px color-mix(in srgb, ${trackColor} 25%, transparent)`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(var(--white-rgb), 0.03)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <div style={{
                        width: '26px', height: '26px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${trackColor}, rgba(255,255,255,0.05))`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: '800', color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.15)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                    }}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600' }}>
                        {user.username}
                    </span>
                </div>
                
                {/* Theme Toggle Button */}
                <button 
                    onClick={toggleTheme} 
                    title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    style={{ 
                        background: 'rgba(var(--white-rgb), 0.03)', border: '1px solid var(--border)', 
                        borderRadius: '20px', color: 'var(--text-muted)', 
                        width: '36px', height: '36px', cursor: 'pointer', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = trackColor;
                        e.currentTarget.style.background = 'rgba(var(--white-rgb), 0.06)';
                        e.currentTarget.style.borderColor = `color-mix(in srgb, ${trackColor} 30%, transparent)`;
                        e.currentTarget.style.boxShadow = `0 0 12px -3px color-mix(in srgb, ${trackColor} 25%, transparent)`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.background = 'rgba(var(--white-rgb), 0.03)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    {isLight ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    )}
                </button>

                {/* Polished Logout Button */}
                <button 
                    onClick={logout} 
                    title="Logout"
                    style={{ 
                        background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.12)', 
                        borderRadius: '20px', color: 'rgba(239, 68, 68, 0.75)', 
                        width: '36px', height: '36px', cursor: 'pointer', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = '#ef4444';
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                        e.currentTarget.style.boxShadow = '0 0 12px -3px rgba(239, 68, 68, 0.25)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'rgba(239, 68, 68, 0.75)';
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.12)';
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}

function AppContent() {
    const [isLight, setIsLight] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            setIsLight(true);
            document.body.classList.add('light-theme');
        }
    }, []);

    const toggleTheme = () => {
        if (isLight) {
            document.body.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
            setIsLight(false);
        } else {
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            setIsLight(true);
        }
    };

    return (
        <>
            <Navbar toggleTheme={toggleTheme} isLight={isLight} />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected DSA Routes */}
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/study" element={<PrivateRoute><Study /></PrivateRoute>} />
                <Route path="/lists" element={<PrivateRoute><Lists /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />

                {/* Protected Backend Prep Routes */}
                <Route path="/backend/roadmap" element={<PrivateRoute><BackendRoadmap /></PrivateRoute>} />
                <Route path="/backend/topic/:topicId" element={<PrivateRoute><BackendTopic /></PrivateRoute>} />
                <Route path="/backend/checkpoint/:phaseId" element={<PrivateRoute><BackendCheckpoint /></PrivateRoute>} />

                {/* Protected System Design Routes */}
                <Route path="/system-design/roadmap" element={<PrivateRoute><SystemDesignRoadmap /></PrivateRoute>} />
                <Route path="/system-design/topic/:topicId" element={<PrivateRoute><SystemDesignTopic /></PrivateRoute>} />
            </Routes>
        </>
    );
}

import { SuccessProvider } from './context/SuccessContext';

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <SuccessProvider>
                    <AppContent />
                </SuccessProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
