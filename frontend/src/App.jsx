import { useState, useEffect } from 'react';
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
    const sliderLeft = section === 'dsa' ? '3px' : section === 'backend' ? '127px' : '251px';
    const sliderColor = section === 'dsa' 
        ? 'linear-gradient(135deg, rgba(0, 212, 170, 0.16) 0%, rgba(0, 212, 170, 0.04) 100%)' 
        : section === 'backend' 
        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.16) 0%, rgba(139, 92, 246, 0.04) 100%)' 
        : 'linear-gradient(135deg, rgba(59, 130, 246, 0.16) 0%, rgba(59, 130, 246, 0.04) 100%)';
    const sliderBorder = section === 'dsa' 
        ? 'rgba(0, 212, 170, 0.35)' 
        : section === 'backend' 
        ? 'rgba(139, 92, 246, 0.35)' 
        : 'rgba(59, 130, 246, 0.35)';
    const sliderShadow = section === 'dsa' 
        ? '0 0 16px -2px rgba(0, 212, 170, 0.3)' 
        : section === 'backend' 
        ? '0 0 16px -2px rgba(139, 92, 246, 0.3)' 
        : '0 0 16px -2px rgba(59, 130, 246, 0.3)';

    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.01)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            padding: '3px',
            width: '378px',
            height: '38px',
            flexShrink: 0,
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.2), 0 4px 16px -4px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden'
        }}>
            {/* Buttery smooth sliding pill behind the buttons */}
            <div style={{
                position: 'absolute',
                top: '3px',
                bottom: '3px',
                left: sliderLeft,
                width: '124px',
                borderRadius: '20px',
                background: sliderColor,
                border: `1px solid ${sliderBorder}`,
                boxShadow: sliderShadow,
                transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* DSA Button */}
            <button
                onClick={() => onSwitch('dsa')}
                onMouseEnter={e => {
                    if (section !== 'dsa') e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={e => {
                    if (section !== 'dsa') e.currentTarget.style.color = 'var(--text-muted)';
                }}
                style={{
                    position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '124px', height: '100%', background: 'transparent', border: 'none', outline: 'none',
                    fontSize: '12px', fontWeight: 700, cursor: 'pointer', borderRadius: '20px',
                    transition: 'color 0.25s ease', letterSpacing: '0.02em',
                    color: section === 'dsa' ? '#00d4aa' : 'var(--text-muted)',
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                </svg>
                DSA
            </button>

            {/* Backend Button */}
            <button
                onClick={() => onSwitch('backend')}
                onMouseEnter={e => {
                    if (section !== 'backend') e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={e => {
                    if (section !== 'backend') e.currentTarget.style.color = 'var(--text-muted)';
                }}
                style={{
                    position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '124px', height: '100%', background: 'transparent', border: 'none', outline: 'none',
                    fontSize: '12px', fontWeight: 700, cursor: 'pointer', borderRadius: '20px',
                    transition: 'color 0.25s ease', letterSpacing: '0.02em',
                    color: section === 'backend' ? '#a78bfa' : 'var(--text-muted)',
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                    <line x1="6" y1="6" x2="6.01" y2="6" />
                    <line x1="6" y1="18" x2="6.01" y2="18" />
                </svg>
                Backend
            </button>

            {/* System Design Button */}
            <button
                onClick={() => onSwitch('system-design')}
                onMouseEnter={e => {
                    if (section !== 'system-design') e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={e => {
                    if (section !== 'system-design') e.currentTarget.style.color = 'var(--text-muted)';
                }}
                style={{
                    position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '124px', height: '100%', background: 'transparent', border: 'none', outline: 'none',
                    fontSize: '12px', fontWeight: 700, cursor: 'pointer', borderRadius: '20px',
                    transition: 'color 0.25s ease', letterSpacing: '0.02em',
                    color: section === 'system-design' ? '#60a5fa' : 'var(--text-muted)',
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                    <rect x="16" y="16" width="6" height="6" rx="1" />
                    <rect x="2" y="16" width="6" height="6" rx="1" />
                    <rect x="9" y="2" width="6" height="6" rx="1" />
                    <path d="M12 8v8M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
                </svg>
                System Design
            </button>
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
                        display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border)', borderRadius: '20px', padding: '4px 12px 4px 4px',
                        height: '36px', cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                        e.currentTarget.style.borderColor = `color-mix(in srgb, ${trackColor} 30%, transparent)`;
                        e.currentTarget.style.boxShadow = `0 0 12px -3px color-mix(in srgb, ${trackColor} 25%, transparent)`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
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
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', 
                        borderRadius: '20px', color: 'var(--text-muted)', 
                        width: '36px', height: '36px', cursor: 'pointer', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.25s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.color = trackColor;
                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                        e.currentTarget.style.borderColor = `color-mix(in srgb, ${trackColor} 30%, transparent)`;
                        e.currentTarget.style.boxShadow = `0 0 12px -3px color-mix(in srgb, ${trackColor} 25%, transparent)`;
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.color = 'var(--text-muted)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
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
