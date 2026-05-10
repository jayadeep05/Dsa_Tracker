import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { registerUser } from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();

    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await registerUser(formData);
            login(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed — username or email may already exist.');
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
                        Your personal<br />
                        <span>interview command centre</span>
                    </div>
                    <div className="auth-subtitle">
                        Join and get a private workspace with structured patterns, personal notes, confidence scoring, and analytics — all in one dark-mode dashboard.
                    </div>
                </div>

                <div className="auth-features">
                    <div className="auth-feature">
                        <div className="auth-feature-icon green">✅</div>
                        <div className="auth-feature-text">
                            <div className="auth-feature-title">Solve & track every question</div>
                            <div className="auth-feature-desc">Status, confidence, time spent — all saved</div>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon purple">📝</div>
                        <div className="auth-feature-text">
                            <div className="auth-feature-title">Personal notes per question</div>
                            <div className="auth-feature-desc">Write your own approach and insights</div>
                        </div>
                    </div>
                    <div className="auth-feature">
                        <div className="auth-feature-icon blue">🔥</div>
                        <div className="auth-feature-text">
                            <div className="auth-feature-title">Daily streaks & analytics</div>
                            <div className="auth-feature-desc">See your momentum over time</div>
                        </div>
                    </div>
                </div>

                <div className="auth-stats">
                    <div className="auth-stat">
                        <div className="auth-stat-num">Free</div>
                        <div className="auth-stat-label">Always</div>
                    </div>
                    <div className="auth-stat">
                        <div className="auth-stat-num">0s</div>
                        <div className="auth-stat-label">Setup time</div>
                    </div>
                    <div className="auth-stat">
                        <div className="auth-stat-num">100%</div>
                        <div className="auth-stat-label">Private</div>
                    </div>
                </div>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="auth-right">
                <div className="auth-sep" />
                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-card-title">Create account 🚀</div>
                        <div className="auth-card-sub">Start your DSA journey today — it's free</div>
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
                                    id="reg-username"
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    placeholder="Choose a username"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <div className="form-input-wrap">
                                <span className="form-input-icon">✉️</span>
                                <input
                                    id="reg-email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="form-input-wrap">
                                <span className="form-input-icon">🔑</span>
                                <input
                                    id="reg-password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    placeholder="Create a strong password"
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading} id="reg-submit">
                            {loading ? (
                                <span><span className="auth-spinner" />Creating account…</span>
                            ) : (
                                <span>Get Started →</span>
                            )}
                        </button>

                        <div style={{ fontSize: '0.75rem', color: '#334155', textAlign: 'center', marginTop: '0.25rem' }}>
                            By registering you agree to keep it real 🤝
                        </div>
                    </form>

                    <div className="auth-footer">
                        Already have an account?&nbsp;
                        <Link to="/login">Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
