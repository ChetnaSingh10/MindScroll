import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface NotFoundPageProps {
  onNavigate: (page: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-accent-soft border border-accent/30 mx-auto flex items-center justify-center text-accent font-display font-bold text-2xl">
        404
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-display text-fg">
          Page Not Found
        </h1>
        <p className="text-xs text-muted leading-relaxed">
          The requested coordinate does not exist in our navigation space. Return to the home
          dashboard or run an assessment.
        </p>
      </div>

      <div className="flex justify-center gap-3">
        <Button variant="primary" size="md" onClick={() => onNavigate('landing')}>
          <Home className="w-4 h-4 mr-1.5" />
          <span>Return Home</span>
        </Button>
        <Button variant="ghost" size="md" onClick={() => onNavigate('predictor')}>
          <span>Start Assessment</span>
        </Button>
      </div>
    </div>
  );
};
