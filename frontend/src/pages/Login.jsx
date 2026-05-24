import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { loginUser } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();

    useEffect(() => {
        document.body.classList.add('auth-body');
        return () => {
            document.body.classList.remove('auth-body');
        };
    }, []);

    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await loginUser(formData);
            login(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid username or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Floating background orbs placed globally to bleed across both panels */}
            <div className="auth-orb auth-orb-1" />
            <div className="auth-orb auth-orb-2" />
            <div className="auth-orb auth-orb-3" />


            {/* ── LEFT PANEL ── */}
            <div className="auth-left">
                <div className="auth-grid" />

                <div className="auth-brand">
                    <div className="auth-logo">
                        <span className="auth-logo-icon">⚡</span>
                        <span className="auth-logo-text">DSA & Prep Tracker</span>
                    </div>

                    <div className="auth-tagline">
                        Master DSA, Backend<br />
                        <span>& System Design</span>
                    </div>
                    <div className="auth-subtitle">
                        An elite developer-first training suite. Solve handpicked challenges, navigate architectural milestones, and simulate production components.
                    </div>
                </div>

                <div className="auth-features">
                    <div className="auth-feature">
                        <div className="auth-feature-icon green">⚡</div>
                        <div className="auth-feature-text">
                            <div className="auth-feature-title">Data Structures & Algorithms</div>
                            <div className="auth-feature-desc">248 curated questions mapped across 16 patterns with a persistent cursor-tracked workspace</div>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon purple">⚙️</div>
                        <div className="auth-feature-text">
                            <div className="auth-feature-title">Backend Architecture Checkpoints</div>
                            <div className="auth-feature-desc">Deep structural roadmaps, system lifecycle checklists, and phase-level milestones</div>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon blue">🌐</div>
                        <div className="auth-feature-text">
                            <div className="auth-feature-title">Interactive Design Sandboxes</div>
                            <div className="auth-feature-desc">13 live simulation models spanning CDN, caching, rate limiting, and scaling hubs</div>
                        </div>
                    </div>
                </div>

                <div className="auth-stats">
                    <div className="auth-stat green">
                        <div className="auth-stat-num">248</div>
                        <div className="auth-stat-label">Curated Challenges</div>
                    </div>
                    <div className="auth-stat purple">
                        <div className="auth-stat-num">12+</div>
                        <div className="auth-stat-label">Architectural Milestones</div>
                    </div>
                    <div className="auth-stat blue">
                        <div className="auth-stat-num">13</div>
                        <div className="auth-stat-label">Live Sandboxes</div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-card-title">Welcome back <span className="wave-emoji">👋</span></div>
                        <div className="auth-card-sub">Sign in to continue your grind</div>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label>Username</label>
                            <div className="form-input-wrap">
                                <svg className="form-input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <input
                                    id="login-username"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    placeholder="Enter your username"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="form-input-wrap">
                                <svg className="form-input-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    id="login-password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading} id="login-submit">
                            {loading ? (
                                <span><span className="auth-spinner" />Signing in…</span>
                            ) : (
                                <span>Sign In →</span>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        No account yet?&nbsp;
                        <Link to="/register">Create one free</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
