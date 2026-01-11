import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Users,
  MessageCircle,
  Bot,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const sampleInsights = [
  {
    type: 'risk',
    icon: AlertTriangle,
    iconColor: 'text-warning',
    bgColor: 'bg-warning/10',
    title: 'Revenue Risk Alert',
    content: 'Disney Streaming accounts for 34.5% of total revenue. Industry benchmark suggests no single client should exceed 25%. Recommend diversification strategy.',
  },
  {
    type: 'opportunity',
    icon: TrendingUp,
    iconColor: 'text-success',
    bgColor: 'bg-success/10',
    title: 'Growth Opportunity',
    content: 'Norwegian Cruise Lines shows 15% engagement increase. Historical data suggests 60% probability of contract expansion in Q1 2026.',
  },
  {
    type: 'recommendation',
    icon: Lightbulb,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
    title: 'Skill Investment',
    content: 'Scala expertise generates €26,944 average revenue per resource - 42% above team average. Recommend expanding Scala training cohort.',
  },
  {
    type: 'manager',
    icon: Users,
    iconColor: 'text-chart-6',
    bgColor: 'bg-chart-6/10',
    title: 'Manager Narrative',
    content: 'Mohammed Lunat maintains 95% client satisfaction with 28 concurrent projects. Consider knowledge transfer sessions to elevate team performance.',
  },
];

const suggestedQuestions = [
  "What's our biggest revenue risk right now?",
  "Which skills should we invest in?",
  "How can we reduce client concentration?",
  "Who are the top performing managers?",
  "What's the revenue forecast for Q1 2026?",
  "Which clients have upsell potential?",
];

const AIInsightsChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI analytics assistant. I can help you understand your revenue data, identify risks, and discover opportunities. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'risk': "Based on current data, your primary risk is client concentration. Disney Streaming represents 34.5% of revenue, which exceeds the recommended 25% threshold. I recommend: 1) Accelerating pipeline development with mid-market prospects, 2) Expanding service offerings to Salesforce and Norwegian accounts, 3) Building strategic partnerships to diversify revenue streams.",
        'skill': "Scala expertise is your highest-value skill, generating €26,944 per resource vs team average of €18,750. However, ML/AI capabilities show only 2 active resources despite 40% market growth in this segment. Recommend: 1) Launch Scala-to-ML crosstraining program, 2) Prioritize AI/ML hiring in Q1, 3) Position existing data engineers for cloud AI certifications.",
        'default': "I've analyzed your revenue data across all dimensions. Key findings:\n\n📊 Revenue is on track with 23.7% YTD growth\n⚠️ Client concentration risk at 34.5% (Disney)\n💡 Scala skills drive highest value\n👥 Mohammed Lunat leads performance metrics\n\nWould you like me to dive deeper into any of these areas?",
      };

      const isRiskQuestion = inputValue.toLowerCase().includes('risk');
      const isSkillQuestion = inputValue.toLowerCase().includes('skill') || inputValue.toLowerCase().includes('invest');

      const responseContent = isRiskQuestion ? responses.risk : isSkillQuestion ? responses.skill : responses.default;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 h-[calc(100vh-180px)] flex flex-col">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-foreground">AI Insights & Chat</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ask questions about your data and get AI-powered insights
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Insight Cards */}
        <div className="lg:col-span-1 space-y-4 overflow-auto pr-2">
          <h2 className="text-sm font-semibold text-foreground">Key Insights</h2>
          {sampleInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className="glass-card p-4 fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('p-2 rounded-lg', insight.bgColor)}>
                    <Icon className={cn('w-4 h-4', insight.iconColor)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chat Panel */}
        <div className="lg:col-span-2 flex flex-col glass-card p-0 overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Analytics Assistant</h3>
              <p className="text-xs text-muted-foreground">Powered by GPT-4 Turbo</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                    message.role === 'user' ? 'bg-primary' : 'bg-secondary'
                  )}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <Bot className="w-4 h-4 text-secondary-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[80%] rounded-xl p-3 text-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  )}
                >
                  <p className="whitespace-pre-line">{message.content}</p>
                  <p className="text-[10px] opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="bg-secondary rounded-xl p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Questions */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.slice(0, 3).map((question) => (
                <button
                  key={question}
                  onClick={() => setInputValue(question)}
                  className="px-3 py-1.5 text-xs bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-full transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about your revenue data..."
                className="flex-1 px-4 py-3 text-sm bg-input rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsChat;
