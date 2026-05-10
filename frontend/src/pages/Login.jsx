import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { loginUser } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();

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
            {/* ── LEFT PANEL ── */}
            <div className="auth-left">
                <div className="auth-grid" />
                <div className="auth-orb auth-orb-1" />
                <div className="auth-orb auth-orb-2" />
                <div className="auth-orb auth-orb-3" />

                <div className="auth-brand">
                    <div className="auth-logo">
                        <span className="auth-logo-icon">⚡</span>
                        <span className="auth-logo-text">DSA Tracker</span>
                    </div>

                    <div className="auth-tagline">
                        Master every<br />
                        <span>algorithm & pattern</span>
                    </div>
                    <div className="auth-subtitle">
                        A focused workspace built for serious interview prep — track progress, identify weak spots, and grind smarter.
                    </div>
                </div>

                <div className="auth-features">
                    <div className="auth-feature">
                        <div className="auth-feature-icon green">📈</div>
                        <div className="auth-feature-text">
                            <div className="auth-feature-title">Track daily progress</div>
                            <div className="auth-feature-desc">Heatmaps, streaks, and solve velocity</div>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon purple">🧩</div>
                        <div className="auth-feature-text">
                            <div className="auth-feature-title">Pattern-first learning</div>
                            <div className="auth-feature-desc">248 questions across 16 core patterns</div>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon blue">🔒</div>
                        <div className="auth-feature-text">
                            <div className="auth-feature-title">Private workspace</div>
                            <div className="auth-feature-desc">Your notes and progress are yours alone</div>
                        </div>
                    </div>
                </div>

                <div className="auth-stats">
                    <div className="auth-stat">
                        <div className="auth-stat-num">248</div>
                        <div className="auth-stat-label">Questions</div>
                    </div>
                    <div className="auth-stat">
                        <div className="auth-stat-num">16</div>
                        <div className="auth-stat-label">Patterns</div>
                    </div>
                    <div className="auth-stat">
                        <div className="auth-stat-num">∞</div>
                        <div className="auth-stat-label">Streaks</div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="auth-right">
                <div className="auth-sep" />
                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-card-title">Welcome back 👋</div>
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
                                <span className="form-input-icon">👤</span>
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
                                <span className="form-input-icon">🔑</span>
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
