import React, { useState } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { askAnalyticsQuestion } from '@/services/nlpApi';

/* ---------------- Types ---------------- */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  table?: {
    columns: string[];
    rows: Record<string, any>[];
  };
  timestamp: Date;
}

/* ---------------- Currency Formatter ---------------- */
const formatUSD = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 2,
  }).format(value);

/* ---------------- Backend Response Parser ---------------- */
function parseBackendResponse(result: any) {
  if (!result?.data || !Array.isArray(result.data) || result.data.length === 0) {
    return { text: 'No data found for this query.' };
  }

  const rows = result.data;
  const firstRow = rows[0];
  const columns = Object.keys(firstRow);

  // TOTAL / KPI
  if (
    columns.length === 1 &&
    ['sum', 'total', 'total_revenue'].includes(columns[0])
  ) {
    return {
      text: `💰 **Total Actual Revenue:** ${formatUSD(
        Number(firstRow[columns[0]])
      )}`,
    };
  }
  // SINGLE VALUE → TEXT ONLY
  if (rows.length === 1 && columns.length === 1) {
    return {
      text: `📌 **${columns[0].replace(/_/g, ' ')}:** ${String(
        firstRow[columns[0]]
      )}`,
    };
  }

  // MULTI ROW → TABLE
  return {
    table: {
      columns,
      rows,
    },
  };
}

/* ---------------- Responsive Chat Table ---------------- */
const ChatTable: React.FC<{
  columns: string[];
  rows: Record<string, any>[];
}> = ({ columns, rows }) => (
  <div className="mt-3 max-w-full overflow-x-auto rounded-lg border border-border">
    <div className="min-w-max">
      <table className="text-xs w-full border-collapse">
        <thead className="bg-secondary sticky top-0 z-10">
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap"
              >
                {c.replace(/_/g, ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-t border-border hover:bg-secondary/40"
            >
              {columns.map((c) => (
                <td
                  key={c}
                  className="px-3 py-2 whitespace-nowrap text-foreground"
                >
                  {typeof row[c] === 'number' &&
                  (c.includes('revenue') || c.includes('cost'))
                    ? formatUSD(row[c])
                    : String(row[c])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

/* ---------------- Component ---------------- */
const AIInsightsChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hello! I'm your AI analytics assistant. Ask me anything about your revenue data.",
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

    try {
      const result = await askAnalyticsQuestion(userMessage.content);
      const parsed = parseBackendResponse(result);

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          timestamp: new Date(),
          ...(parsed.text ? { content: parsed.text } : {}),
          ...(parsed.table ? { table: parsed.table } : {}),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content:
            '⚠️ Sorry, something went wrong while analyzing your data.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Insights & Chat</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ask questions about your data and get AI-powered insights
        </p>
      </div>

      <div className="flex flex-col glass-card overflow-hidden flex-1 min-w-0">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">AI Analytics Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by NL → SQL</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4 min-w-0">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                'flex gap-3 max-w-full',
                m.role === 'user' && 'flex-row-reverse'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                  m.role === 'user' ? 'bg-primary' : 'bg-secondary'
                )}
              >
                {m.role === 'user' ? (
                  <User className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <Bot className="w-4 h-4 text-secondary-foreground" />
                )}
              </div>

              <div
                className={cn(
                  'rounded-xl p-3 text-sm max-w-[85%] min-w-0 overflow-hidden',
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {m.content && <p className="whitespace-pre-line">{m.content}</p>}
                {m.table && (
                  <ChatTable
                    columns={m.table.columns}
                    rows={m.table.rows}
                  />
                )}
                <div className="text-[10px] opacity-60 mt-1">
                  {m.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-secondary rounded-xl p-3 flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-150" />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-3">
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything about your revenue data..."
              className="flex-1 px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="px-4 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsChat;
