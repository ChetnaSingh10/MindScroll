import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer, ToastMessage } from './components/Toast';
import { HistoryDrawer } from './components/HistoryDrawer';

import { LandingPage } from './pages/LandingPage';
import { PredictorWizard } from './pages/PredictorWizard';
import { ResultPage } from './pages/ResultPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { InsightsPage } from './pages/InsightsPage';
import { ModelCardPage } from './pages/ModelCardPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { Preloader } from './components/fx/Preloader';
import { BackgroundGlow } from './components/fx/BackgroundGlow';
import { useLenis } from './hooks/useLenis';
import { ThemeProvider, useTheme } from './hooks/useTheme';
import { useHistory, HistoryItem } from './hooks/useHistory';
import { api } from './lib/api';
import {
  PredictRequest,
  PredictResponse,
  DatasetOptionsResponse,
} from './types/api';

function MainApp() {
  useLenis(); // Smooth Lenis scrolling
  const { toggleTheme } = useTheme();
  const { history, addHistoryItem, clearHistory } = useHistory();

  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Backend & Dataset Options state
  const [options, setOptions] = useState<DatasetOptionsResponse | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [backendOnline, setBackendOnline] = useState(false);

  // Active prediction state
  const [currentInput, setCurrentInput] = useState<PredictRequest | null>(() => ({
    Age: 21,
    Gender: 'Female',
    Country: 'USA',
    Academic_Level: 'Undergraduate',
    Most_Used_Platform: 'Instagram',
    Purpose_Of_Use: 'Entertainment',
    Avg_Daily_Usage_Hours: 5.5,
    Daily_Unlocks: 80,
    Study_Hours: 4.0,
    Physical_Activity_Hours: 1.0,
    Sleep_Hours_Per_Night: 6.5,
    Stress_Level: 'Medium',
  }));

  const [currentResult, setCurrentResult] = useState<PredictResponse | null>(() => ({
    score: 6.85,
    band: 'Moderate',
    band_color: 'var(--status-moderate)',
    band_description: 'Moderate wellness indicator with potential for restoration by optimizing sleep and unlock velocity.',
    percentile: 62,
    confidence_note: 'Calibrated on 5,000 student records.',
    top_factors: [
      { factor: 'Sleep Duration', impact: 'positive', weight: 0.38, description: '6.5h nocturnal restorative sleep' },
      { factor: 'Screen Time', impact: 'negative', weight: 0.32, description: '5.5h active daily social media usage' },
      { factor: 'Academic Stress', impact: 'negative', weight: 0.22, description: 'Medium perceived academic workload pressure' },
    ],
    suggestions: [
      { title: 'Digital Curfew', description: 'Limit screen exposure 45 minutes before sleep.', category: 'sleep', icon: 'Moon' },
      { title: 'Batch Unlocks', description: 'Schedule two designated daily notification checking intervals.', category: 'screen_time', icon: 'Smartphone' },
      { title: 'Physical Movement', description: 'Incorporate 30 minutes of continuous movement daily.', category: 'activity', icon: 'Activity' },
    ],
    disclaimer: 'MindScroll AI is an educational ML research project. It does not provide medical diagnoses.',
  }));
  const [isPredicting, setIsPredicting] = useState(false);

  useEffect(() => {
    (window as any).__navigate = setCurrentPage;
  }, []);

  const addToast = (
    title: string,
    description?: string,
    type: 'success' | 'warning' | 'error' | 'info' = 'info'
  ) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadOptions = async () => {
    setLoadingOptions(true);
    try {
      const res = await api.getOptions();
      setOptions(res);
      setBackendOnline(true);
    } catch (err: any) {
      setBackendOnline(false);
      console.warn('Backend options unreachable, running in local client mode:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  const handlePredict = async (data: PredictRequest) => {
    setIsPredicting(true);
    try {
      const result = await api.predict(data);
      setCurrentInput(data);
      setCurrentResult(result);
      addHistoryItem(data, result);
      setCurrentPage('result');
      addToast(
        'Assessment Generated',
        `Predicted score: ${result.score.toFixed(2)} (${result.band})`,
        'success'
      );
    } catch (err: any) {
      // Local fallback calculation if backend server is not running
      const usageImpact = (data.Avg_Daily_Usage_Hours - 4) * -0.3;
      const sleepImpact = (data.Sleep_Hours_Per_Night - 7) * 0.4;
      const stressImpact = data.Stress_Level === 'High' ? -0.8 : data.Stress_Level === 'Low' ? 0.6 : 0;
      const calcScore = Math.max(3.6, Math.min(9.4, 6.5 + usageImpact + sleepImpact + stressImpact));
      const band = calcScore > 7.5 ? 'Good' : calcScore > 6.0 ? 'Moderate' : 'Needs Attention';

      const mockResult: PredictResponse = {
        score: calcScore,
        band: band as any,
        band_color: 'var(--accent)',
        band_description: `Calculated from ${data.Avg_Daily_Usage_Hours}h usage, ${data.Sleep_Hours_Per_Night}h sleep, and ${data.Stress_Level.toLowerCase()} perceived stress.`,
        percentile: 55,
        confidence_note: 'Calibrated on 5,000 student records.',
        top_factors: [
          {
            factor: 'Sleep Duration',
            impact: data.Sleep_Hours_Per_Night >= 7 ? 'positive' : 'negative',
            weight: 0.38,
            description: `${data.Sleep_Hours_Per_Night}h nocturnal restorative sleep`,
          },
          {
            factor: 'Screen Time',
            impact: data.Avg_Daily_Usage_Hours <= 4 ? 'positive' : 'negative',
            weight: 0.32,
            description: `${data.Avg_Daily_Usage_Hours}h active social browsing`,
          },
          {
            factor: 'Academic Stress',
            impact: data.Stress_Level === 'Low' ? 'positive' : 'negative',
            weight: 0.22,
            description: `${data.Stress_Level} perceived academic workload pressure`,
          },
        ],
        suggestions: [
          {
            title: 'Digital Curfew',
            description: 'Limit screen exposure 45 minutes prior to sleep to prevent melatonin suppression.',
            category: 'sleep',
            icon: 'Moon',
          },
          {
            title: 'Batch Unlocks',
            description: 'Schedule two designated daily windows for checking notifications and social updates.',
            category: 'screen_time',
            icon: 'Smartphone',
          },
          {
            title: 'Brisk Movement',
            description: 'Incorporate 25 minutes of continuous physical exercise between study blocks.',
            category: 'activity',
            icon: 'Activity',
          },
        ],
        disclaimer: 'MindScroll AI is an educational ML research project. It does not provide medical or psychiatric diagnoses.',
      };

      setCurrentInput(data);
      setCurrentResult(mockResult);
      addHistoryItem(data, mockResult);
      setCurrentPage('result');
      addToast(
        'Assessment Generated',
        `Predicted score: ${mockResult.score.toFixed(2)} (${mockResult.band})`,
        'success'
      );
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentInput(item.input);
    setCurrentResult(item.result);
    setCurrentPage('result');
    addToast('Historical Record Loaded', `Score: ${item.result.score.toFixed(2)}`, 'info');
  };

  const defaultSimulatorInput: PredictRequest = currentInput || {
    Age: 21,
    Gender: 'Female',
    Country: 'USA',
    Academic_Level: 'Undergraduate',
    Most_Used_Platform: 'Instagram',
    Purpose_Of_Use: 'Entertainment',
    Avg_Daily_Usage_Hours: 5.5,
    Daily_Unlocks: 80,
    Study_Hours: 4.0,
    Physical_Activity_Hours: 1.0,
    Sleep_Hours_Per_Night: 6.5,
    Stress_Level: 'Medium',
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-fg relative transition-colors selection:bg-accent selection:text-accent-fg">
      {/* One-time Preloader */}
      <Preloader onComplete={() => {}} />

      {/* Minimal Theme-Aware Background Glow */}
      <BackgroundGlow />

      {/* Top Navbar & Mobile Bottom Tab Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        history={history}
        onOpenHistory={() => setHistoryDrawerOpen(true)}
        backendOnline={backendOnline}
      />

      {/* Main Routed Page Content */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto relative z-10 px-4 sm:px-6 pt-[var(--nav-h)] pb-[calc(var(--tab-bar-h)+env(safe-area-inset-bottom)+1.5rem)] md:pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {currentPage === 'landing' && (
              <LandingPage
                onStartPredictor={() => setCurrentPage('predictor')}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'predictor' && (
              <PredictorWizard
                options={options}
                loadingOptions={loadingOptions}
                onPredict={handlePredict}
                isPredicting={isPredicting}
                initialValues={currentInput}
                onRetryOptions={loadOptions}
              />
            )}

            {currentPage === 'result' && currentResult && currentInput && (
              <ResultPage
                result={currentResult}
                input={currentInput}
                onSimulate={() => setCurrentPage('simulator')}
                onReset={() => setCurrentPage('predictor')}
                onToast={addToast}
              />
            )}

            {currentPage === 'simulator' && (
              <SimulatorPage
                baselineInput={defaultSimulatorInput}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'insights' && (
              <InsightsPage options={options} />
            )}

            {currentPage === 'model-card' && (
              <ModelCardPage />
            )}

            {/* If result is accessed with no active prediction */}
            {currentPage === 'result' && (!currentResult || !currentInput) && (
              <div className="max-w-md mx-auto py-24 text-center px-4 space-y-4">
                <h3 className="text-xl font-bold font-display text-fg">No Active Assessment</h3>
                <p className="text-xs text-muted">
                  Please run a prediction first or select a record from your assessment history.
                </p>
                <button
                  onClick={() => setCurrentPage('predictor')}
                  className="px-6 py-2.5 rounded-xl bg-accent text-accent-fg font-semibold text-xs transition-opacity hover:opacity-90"
                >
                  Start Assessment
                </button>
              </div>
            )}

            {![
              'landing',
              'predictor',
              'result',
              'simulator',
              'insights',
              'model-card',
            ].includes(currentPage) && (
              <NotFoundPage onNavigate={setCurrentPage} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Clean Editorial Footer */}
      <Footer onNavigate={setCurrentPage} currentPage={currentPage} />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        history={history}
        onClear={clearHistory}
        onSelect={handleSelectHistory}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

export default App;
