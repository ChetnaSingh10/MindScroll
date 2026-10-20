import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Brain, Sliders, BarChart3, FileCode2, ArrowRight } from 'lucide-react';
import { ThemeToggle } from './fx/ThemeToggle';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  backendOnline: boolean;
}

export const MenuOverlay: React.FC<MenuOverlayProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  backendOnline,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const links = [
    { id: 'landing', label: 'Overview // Signal Story', num: '01', desc: 'Decoding how your scroll leaves a mark' },
    { id: 'predictor', label: 'Predictor Wizard', num: '02', desc: 'Predict student mental wellness score' },
    { id: 'simulator', label: 'What-If Simulator', num: '03', desc: 'Interactive counterfactual habit simulation' },
    { id: 'insights', label: 'Population Insights', num: '04', desc: '5,000 student behavioral distributions & R² metrics' },
    { id: 'model-card', label: 'Model Governance Card', num: '05', desc: 'Feature importance, pipeline architecture & ethics' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-2xl text-[#FFF8F1] flex flex-col justify-between p-6 sm:p-12 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#FF8A3D] tracking-widest uppercase">
                [ NAVIGATION ATLAS // V2.4 ]
              </span>
              <div className="h-4 w-px bg-white/20" />
              <span className={`text-[10px] font-mono ${backendOnline ? 'text-emerald-400' : 'text-amber-400'}`}>
                ● {backendOnline ? 'SYSTEM CONNECTED' : 'OFFLINE MODE'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-white/20 font-mono text-xs uppercase tracking-wider text-white hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-colors flex items-center gap-2"
                aria-label="Close menu"
              >
                <span>[ CLOSE ✕ ]</span>
              </button>
            </div>
          </div>

          {/* Central Editorial Links */}
          <div className="my-auto py-10 max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-widest block mb-4">
                INDEX OF EXPERIENCES ({links.length.toString().padStart(2, '0')})
              </span>
              {links.map((item, idx) => {
                const isActive = currentPage === item.id;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <button
                      onClick={() => {
                        onNavigate(item.id);
                        onClose();
                      }}
                      className={`w-full text-left py-3 sm:py-4 px-4 sm:px-6 rounded-2xl group flex items-baseline justify-between transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#FF6B1A]/20 to-transparent border-l-4 border-[#FF6B1A]'
                          : 'hover:bg-white/5 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span className="font-mono text-xs sm:text-sm text-[#FF8A3D] font-bold">
                          [{item.num}]
                        </span>
                        <div>
                          <h3 className="text-xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-white group-hover:text-[#FF8A3D] transition-colors">
                            {item.label}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1 font-sans">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#FF6B1A] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all shrink-0 ml-4 hidden sm:block" />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Side column: Editorial context & Quick CTA */}
            <div className="lg:col-span-4 flex flex-col justify-between space-y-8 border-t lg:border-t-0 lg:border-l border-white/10 lg:pl-8 pt-8 lg:pt-0">
              <div>
                <h4 className="font-mono text-xs text-[#FF8A3D] uppercase tracking-widest mb-3">
                  // THE CENTRAL SIGNAL
                </h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6 font-sans">
                  MindScroll AI decodes passive screen time, notification frequency, and sleep fragmentation into an empirical mental health score calibrated on 5,000 verified student records.
                </p>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 font-mono text-[11px] space-y-2">
                  <div className="flex justify-between text-white/70">
                    <span>TRAINED SAMPLES:</span>
                    <span className="text-white font-bold">5,000</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>REGRESSION R²:</span>
                    <span className="text-[#FF8A3D] font-bold">0.864</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>LATENT FEATURES:</span>
                    <span className="text-white font-bold">12 METRICS</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onNavigate('predictor');
                    onClose();
                  }}
                  className="w-full py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-wider font-bold bg-[#FF6B1A] text-white hover:bg-[#FF8A3D] transition-colors shadow-lg shadow-[#FF6B1A]/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>[ LAUNCH PREDICTOR WIZARD ]</span>
                </button>
                <div className="text-[10px] font-mono text-center text-[#71717A]">
                  KEYBOARD SHORTCUTS: [T] THEME · [ESC] EXIT
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 text-[10px] font-mono text-[#71717A] gap-2">
            <span>MINDSCROLL AI · RESEARCH PLATFORM</span>
            <span>PRESS [ESC] TO CLOSE OVERLAY</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
