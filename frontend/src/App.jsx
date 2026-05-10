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
            getStreak().then(r => setStreak(r.data.currentStreak)).catch(() => {});
        }
    }, [user]);

    if (!user) return null; // Hide navbar on login/register pages

    return (
        <nav className="navbar">
            <span className="nav-logo">⚡ DSA Tracker</span>
            <div className="nav-links">
                <NavLink to="/" end className={({isActive})=>`nav-link ${isActive?'active':''}`}>Dashboard</NavLink>
                <NavLink to="/study" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Study</NavLink>
                <NavLink to="/lists" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Lists</NavLink>
                <NavLink to="/analytics" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Analytics</NavLink>
                <NavLink to="/search" className={({isActive})=>`nav-link ${isActive?'active':''}`}>Search</NavLink>
            </div>
            {streak >= 3 && <div className="nav-streak">🔥 {streak} day streak</div>}
            
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {user.username}
                </span>
                <button onClick={logout} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', padding: '6px 12px', cursor: 'pointer', fontSize: '13px' }}>
                    Logout
                </button>
                <button onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-primary)', padding: '6px 12px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isLight ? '🌙' : '☀️'}
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

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}
