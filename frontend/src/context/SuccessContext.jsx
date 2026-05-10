import React, { createContext, useContext, useState, useCallback } from 'react';
import SuccessOverlay from '../components/SuccessOverlay';
import { getStreak, getDashboard } from '../api/client';

const SuccessContext = createContext();

export function useSuccess() {
  return useContext(SuccessContext);
}

export function SuccessProvider({ children }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayStats, setOverlayStats] = useState({});

  const triggerSuccess = useCallback((solvedQuestion, pattern = null, patternQuestions = []) => {
    // If we have pattern info, compute local stats
    const totalSolvedInPattern = patternQuestions.filter(q => q.status === 'solved').length;
    const patternTotal = patternQuestions.length;
    const pName = pattern?.name || '';
    const patternRemaining = patternTotal - totalSolvedInPattern;
    const nextUnsolved = patternQuestions.find(q => q.status !== 'solved' && q.id !== solvedQuestion.id);

    const localStats = {
      problemName: solvedQuestion.name,
      patternName: pName,
      patternSolved: totalSolvedInPattern,
      patternTotal,
      patternRemaining,
      difficulty: solvedQuestion.difficulty || '',
      totalSolved: 0,
      totalQuestions: 248,
      currentStreak: 0,
      problemsToday: 0,
      nextQuestion: nextUnsolved ? { id: nextUnsolved.id, name: nextUnsolved.name } : null,
    };

    setOverlayStats(localStats);
    setShowOverlay(true);

    // Fetch global stats to enrich
    Promise.all([
      getStreak().catch(() => ({ data: {} })),
      getDashboard().catch(() => ({ data: {} })),
    ]).then(([streakRes, dashRes]) => {
      const sData = streakRes.data || {};
      const dData = dashRes.data || {};
      setOverlayStats(prev => ({
        ...prev,
        currentStreak: sData.currentStreak || sData.streak || 0,
        totalSolved: dData.solved || totalSolvedInPattern,
        totalQuestions: dData.totalQuestions || 248,
        problemsToday: sData.todaySolved || dData.todaySolved || 1,
      }));
    });
  }, []);

  return (
    <SuccessContext.Provider value={{ triggerSuccess }}>
      {children}
      <SuccessOverlay
        visible={showOverlay}
        stats={overlayStats}
        duration={10000} // Set to 10s as per spec
        onDismiss={() => setShowOverlay(false)}
      />
    </SuccessContext.Provider>
  );
}
