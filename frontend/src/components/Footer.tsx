import React from 'react';
import { ShieldAlert, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-line bg-surface mt-20 pb-20 md:pb-10 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-accent-soft border border-accent/30 flex items-center justify-center text-accent font-display font-bold text-xs">
                M
              </div>
              <span className="font-display font-bold text-base text-fg">
                MindScroll<span className="text-accent">AI</span>
              </span>
            </div>
            <p className="text-xs text-muted max-w-md leading-relaxed">
              An empirical machine learning platform analyzing how social media screen time,
              unlock velocity, and daily sleep hygiene correlate with student psychological well-being.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-muted font-mono pt-1">
              <span>Model: Random Forest Regressor</span>
              <span>•</span>
              <span>5,000 Verified Student Records</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-fg">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-muted">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-fg transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('predictor')}
                  className="hover:text-fg transition-colors"
                >
                  Predictor Wizard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('simulator')}
                  className="hover:text-fg transition-colors"
                >
                  What-If Simulator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('insights')}
                  className="hover:text-fg transition-colors"
                >
                  Cohort Insights
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('model-card')}
                  className="hover:text-fg transition-colors"
                >
                  Model Card & Governance
                </button>
              </li>
            </ul>
          </div>

          {/* Ethics & Notice */}
          <div className="space-y-2">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-fg flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-accent" />
              <span>Research Notice</span>
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              This system is built strictly for personal awareness and academic analysis. It does
              not constitute a psychiatric diagnosis or clinical evaluation.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted font-mono">
          <p>© {new Date().getFullYear()} MindScroll AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with care <Heart className="w-3 h-3 text-accent fill-accent" /> for students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
