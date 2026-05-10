import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import './index.css';
import Dashboard from './pages/Dashboard';
import Study from './pages/Study';
import Lists from './pages/Lists';
import Analytics from './pages/Analytics';
import Search from './pages/Search';
import Login from './pages/Login';
import Register from './pages/Register';
import { getStreak } from './api/client';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

function Navbar({ toggleTheme, isLight }) {
    const [streak, setStreak] = useState(0);
    const { user, logout } = useAuth();

    useEffect(() => {
        if (user) {
            getStreak().then(r => setStreak(r.data.currentStreak)).catch(() => { });
        }
    }, [user]);

    if (!user) return null; // Hide navbar on login/register pages

    return (
        <nav className="navbar">
            <span className="nav-logo">⚡ DSA Tracker</span>
            <div className="nav-links">
                <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
                <NavLink to="/study" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Study</NavLink>
                <NavLink to="/lists" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Lists</NavLink>
                <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Analytics</NavLink>
                <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Search</NavLink>
            </div>
            {streak >= 3 && <div className="nav-streak">🔥 {streak} day streak</div>}

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginRight: '4px', fontWeight: '500' }}>
                    {user.username}
                </span>
                
                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme} 
                    title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                    style={{ 
                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', 
                        borderRadius: '8px', color: 'var(--text-primary)', 
                        width: '36px', height: '36px', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                >
                    {isLight ? '🌙' : '☀️'}
                </button>

                {/* Logout Button */}
                <button 
                    onClick={logout} 
                    title="Logout"
                    style={{ 
                        background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', 
                        borderRadius: '8px', color: '#F59E0B', 
                        width: '36px', height: '36px', 
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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

                {/* Protected Routes */}
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/study" element={<PrivateRoute><Study /></PrivateRoute>} />
                <Route path="/lists" element={<PrivateRoute><Lists /></PrivateRoute>} />
                <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
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
