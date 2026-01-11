import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  MessageCircle,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';
import { aiInsights } from '@/data/dashboardData';

interface AISidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const getInsightsForPage = (pathname: string) => {
  switch (pathname) {
    case '/':
      return aiInsights.executive;
    case '/skills':
      return aiInsights.skill;
    case '/designations':
      return aiInsights.designation;
    case '/managers':
      return aiInsights.manager;
    default:
      return aiInsights.executive;
  }
};

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'risk':
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    case 'opportunity':
    case 'trend':
    case 'performance':
      return <TrendingUp className="w-4 h-4 text-success" />;
    default:
      return <Lightbulb className="w-4 h-4 text-primary" />;
  }
};

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'high':
      return 'border-l-destructive';
    case 'medium':
      return 'border-l-warning';
    default:
      return 'border-l-primary';
  }
};

const AISidebar: React.FC<AISidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [chatMessage, setChatMessage] = useState('');
  const insights = getInsightsForPage(location.pathname);

  return (
    <>
      {/* Toggle Button (visible when closed) - Brand Color */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-20 bg-brand-accent text-white p-2 rounded-l-lg shadow-lg hover:bg-brand-light transition-colors"
        >
          <div className="flex items-center gap-1">
            <ChevronLeft size={16} />
            <Sparkles size={16} />
          </div>
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'h-screen sticky top-0 bg-sidebar border-l border-sidebar-border transition-all duration-300 flex flex-col',
          isOpen ? 'w-80' : 'w-0 overflow-hidden'
        )}
      >
        {/* Header - Brand Colors */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center ai-pulse">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">AI Insights</h3>
              <p className="text-xs text-brand-light">Powered by GPT-4</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Insights */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Key Insights
          </div>
          {insights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                'insight-card fade-in',
                `stagger-${index + 1}`,
                getPriorityColor((insight as any).priority)
              )}
            >
              <div className="flex items-start gap-2">
                {getInsightIcon(insight.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {insight.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Chat */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Ask AI
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about your data..."
              className="flex-1 px-3 py-2 text-xs bg-input rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
            />
            <button className="p-2 bg-brand-accent text-white rounded-lg hover:bg-brand-light transition-colors">
              <Send size={14} />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {['Revenue risk?', 'Top clients', 'Growth trends'].map((q) => (
              <button
                key={q}
                className="px-2 py-1 text-xs bg-brand/30 hover:bg-brand/50 text-brand-lighter hover:text-white rounded transition-colors"
                onClick={() => setChatMessage(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default AISidebar;
