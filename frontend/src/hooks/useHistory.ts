import { useState, useEffect } from 'react';
import { PredictRequest, PredictResponse } from '../types/api';

export interface HistoryItem {
  id: string;
  timestamp: string;
  input: PredictRequest;
  result: PredictResponse;
}

const STORAGE_KEY = 'mindscroll_prediction_history';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  const addHistoryItem = (input: PredictRequest, result: PredictResponse) => {
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      input,
      result,
    };
    setHistory(prev => [newItem, ...prev.slice(0, 19)]); // keep last 20
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const removeHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return {
    history,
    addHistoryItem,
    clearHistory,
    removeHistoryItem,
  };
}
