import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Premium LeetCode-style "Problem Solved" success screen.
 * Implements the specific design requested: Green ramp, staggered animations, 
 * count-up stats, and canvas-based confetti.
 */

export default function SuccessOverlay({ visible, stats = {}, onDismiss, duration = 4000 }) {
  const [phase, setPhase] = useState('idle'); // idle -> entering -> visible -> exiting -> idle
  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  // Stats count-up state
  const [displayStats, setDisplayStats] = useState({ today: 0, streak: 0, topic: 0 });
  const statsRef = useRef(stats);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  const handleClose = useCallback(() => {
    setPhase('exiting');
    setTimeout(() => {
      setPhase('idle');
      onDismiss?.();
    }, 400);
  }, [onDismiss]);

  useEffect(() => {
    // Keyboard listener for Escape
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };

    if (visible && phase === 'idle') {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      setPhase('entering');
      setTimeout(() => setPhase('visible'), 50);

      // Animation for stats count-up
      const startStatsAnimation = () => {
        const duration = 700;
        const startTime = performance.now();

        const animate = (now) => {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function: easeOutExpo
          const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

          setDisplayStats({
            today: Math.floor(easeProgress * (statsRef.current.problemsToday || 0)),
            streak: Math.floor(easeProgress * (statsRef.current.currentStreak || 0)),
            topic: Math.floor(easeProgress * (statsRef.current.patternSolved || 0))
          });

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        // Delay stats count-up as per spec (900ms-1100ms)
        setTimeout(() => requestAnimationFrame(animate), 900);
      };

      startStatsAnimation();

      // Auto-dismiss logic
      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          handleClose();
        }, duration);
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, stats, phase, handleClose]);

  // Confetti Logic
  useEffect(() => {
    if (phase !== 'visible' || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    const pieces = [];
    const colors = ['#639922', '#97C459', '#3B6D11', '#FBBF24', '#F59E0B'];

    let spawned = 0;
    const maxPieces = 55;
    const spawnStartTime = Date.now() + 300; // 300ms delay
    let lastSpawnTime = 0;

    const animateConfetti = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const now = Date.now();

      // Spawn logic: pairs every 40ms starting at 300ms
      if (now > spawnStartTime && spawned < maxPieces && now - lastSpawnTime > 40) {
        for (let i = 0; i < 2 && spawned < maxPieces; i++) {
          pieces.push({
            x: 20 + Math.random() * 60, // more centered
            y: -10,
            size: 6 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
            vx: (Math.random() - 0.5) * 4,
            vy: 3 + Math.random() * 5,
            r: Math.random() * 360,
            vr: (Math.random() - 0.5) * 15,
            opacity: 1
          });
          spawned++;
        }
        lastSpawnTime = now;
      }

      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.x += p.vx * 0.1;
        p.y += p.vy;
        p.r += p.vr;
        p.opacity -= 0.005;

        if (p.opacity <= 0 || p.y > 110) {
          pieces.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate((p.x / 100) * (canvas.width / dpr), (p.y / 100) * (canvas.height / dpr));
        ctx.rotate(p.r * Math.PI / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        }
        ctx.restore();
      }

      if (pieces.length > 0 || spawned < maxPieces) {
        requestAnimationFrame(animateConfetti);
      }
    };

    requestAnimationFrame(animateConfetti);
    return () => window.removeEventListener('resize', resize);
  }, [phase]);

  if (phase === 'idle') return null;

  const isExiting = phase === 'exiting';

  // Placeholder for sendPrompt
  const handleNextProblem = () => {
    if (stats.nextQuestion) {
      // Scroll to the next question element if it exists on the page
      const el = document.getElementById(`question-${stats.nextQuestion.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Add a temporary highlight effect
        el.style.boxShadow = '0 0 20px #639922';
        setTimeout(() => el.style.boxShadow = '', 2000);
      }
      handleClose();
    } else if (window.sendPrompt) {
      window.sendPrompt('Give me the next ' + (stats.patternName || 'Two Pointers') + ' easy problem with a hint to get started');
    } else {
      handleClose();
    }
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        opacity: isExiting ? 0 : 1,
        transition: 'opacity 0.4s ease',
        fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
        cursor: 'pointer',
      }}
    >
      <style>{`
        :root {
          --success-primary: #639922;
          --success-light: #97C459;
          --success-neon: #a3e635;
          --success-dark: #0A1A0A;
        }

        @keyframes scale-pop {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(99, 153, 34, 0.6); }
          70% { box-shadow: 0 0 0 25px rgba(99, 153, 34, 0); }
          100% { box-shadow: 0 0 0 0 rgba(99, 153, 34, 0); }
        }

        @keyframes fade-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes progress-grow {
          from { width: 0; }
        }

        .shimmer-text {
          background: linear-gradient(90deg, #639922 25%, #a3e635 50%, #639922 75%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>

      {/* Confetti Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      />

      {/* Overlay Backdrop - Soft Black with green tint */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10, 26, 10, 0.95)',
          backdropFilter: 'blur(12px)',
          zIndex: -1,
        }}
      />

      {/* Content Container */}
      <div style={{
        width: '100%',
        maxWidth: '510px',
        textAlign: 'center',
        padding: '20px',
        zIndex: 1,
      }}>

        {/* 1. Circular Icon Ring */}
        <div style={{
          width: '76px',
          height: '76px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #a3e635 0%, #639922 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          animation: 'scale-pop 0.5s 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, pulse-glow 2s 1s infinite',
          boxShadow: '0 0 20px rgba(99, 153, 34, 0.4)',
        }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        {/* 2. Shimmer Title */}
        <h1 className="shimmer-text" style={{
          fontSize: '38px',
          fontWeight: '900',
          margin: '0 0 4px',
          opacity: 0,
          animation: 'fade-up 0.5s 0.5s ease-out forwards',
          letterSpacing: '-1px',
        }}>
          Problem Solved!
        </h1>

        {/* New Dedicated Problem Title Line */}
        <div style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '10px',
          opacity: 0,
          animation: 'fade-up 0.5s 0.55s ease-out forwards',
        }}>
          {stats.problemName}
        </div>

        {/* 3. Subtitle */}
        <div style={{
          fontSize: '14px',
          color: 'rgba(255, 255, 255, 0.6)',
          marginBottom: '32px',
          opacity: 0,
          animation: 'fade-up 0.5s 0.6s ease-out forwards',
          fontWeight: '500',
        }}>
          {stats.patternName} · {stats.difficulty === 'E' ? 'Easy' : stats.difficulty === 'M' ? 'Medium' : 'Hard'} · <span style={{ color: '#a3e635' }}>Accepted</span>
        </div>

        {/* 4. Stats Row - Matrix Theme */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '24px',
          opacity: 0,
          animation: 'fade-up 0.5s 0.75s ease-out forwards',
        }}>
          {[
            { label: 'Problems today', value: displayStats.today },
            { label: 'Day streak 🔥', value: displayStats.streak },
            { label: `Solved in topic`, value: displayStats.topic }
          ].map((stat, i) => (
            <div key={i} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(163, 230, 53, 0.15)',
              borderRadius: '14px',
              padding: '16px 8px',
              backdropFilter: 'blur(4px)',
            }}>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#fff', marginBottom: '2px' }}>{stat.value}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* 5. Card Section with Progress Bars */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(163, 230, 53, 0.2)',
          borderRadius: '18px',
          padding: '24px',
          textAlign: 'left',
          opacity: 0,
          animation: 'fade-up 0.5s 1.1s ease-out forwards',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        }}>
          {/* Topic Progress */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}>
              <span style={{ fontWeight: '600' }}>{stats.patternName} Progress</span>
              <span style={{ color: '#a3e635', fontWeight: '700' }}>{stats.patternSolved} / {stats.patternTotal}</span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #639922, #a3e635)',
                width: `${((stats.patternSolved) / (stats.patternTotal || 1)) * 100}%`,
                animation: 'progress-grow 1.2s 1.3s cubic-bezier(0.1, 0.8, 0.2, 1) forwards'
              }} />
            </div>
          </div>

          {/* Sheet Progress */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}>
              <span style={{ fontWeight: '600' }}>Total Mastery</span>
              <span style={{ color: '#97C459', fontWeight: '700' }}>{stats.totalSolved} / {stats.totalQuestions}</span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                background: 'linear-gradient(90deg, #3B6D11, #97C459)',
                width: `${((stats.totalSolved) / (stats.totalQuestions || 248)) * 100}%`,
                animation: 'progress-grow 1.2s 1.5s cubic-bezier(0.1, 0.8, 0.2, 1) forwards'
              }} />
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(163, 230, 53, 0.1)',
              padding: '8px 16px',
              borderRadius: '24px',
              fontSize: '13px',
              color: '#a3e635',
              fontWeight: '600',
              border: '1px solid rgba(163, 230, 53, 0.2)'
            }}>
              <span style={{ fontSize: '16px' }}>🔥</span> Keep the streak alive!
            </div>

            <button
              onClick={handleNextProblem}
              style={{
                background: '#a3e635',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 20px',
                fontSize: '15px',
                fontWeight: '800',
                color: '#0A1A0A',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 4px 15px rgba(163, 230, 53, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(163, 230, 53, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(163, 230, 53, 0.3)';
              }}
            >
              Next Problem ↗
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
