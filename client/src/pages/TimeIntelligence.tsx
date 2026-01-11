import React from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';

import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import { useTimeIntelligenceData } from '@/hooks/useTimeIntelligenceData';

import {
  AreaChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

/* Utils */
const formatCurrency = (value: number, compact = false) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);

const TimeIntelligence: React.FC = () => {
  const { loading, monthlyRevenue } = useTimeIntelligenceData();

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>;
  }

  const currentMonth = monthlyRevenue.at(-1);
  const momGrowth = currentMonth?.growth ?? 0;

  const bestMonth =
    monthlyRevenue.reduce((best, m) =>
      m.revenue > best.revenue ? m : best
    );

  const avgRevenue =
    monthlyRevenue.reduce((s, m) => s + m.revenue, 0) /
    monthlyRevenue.length;

  const variance =
    monthlyRevenue.reduce(
      (s, m) => s + Math.pow(m.revenue - avgRevenue, 2),
      0
    ) / monthlyRevenue.length;

  const volatility =
    monthlyRevenue.length > 1
      ? (Math.sqrt(variance) / avgRevenue) * 100
      : 0;

  const kpis = [
    {
      title: 'Monthly Revenue',
      value: formatCurrency(currentMonth?.revenue ?? 0, true),
      change: momGrowth ?? 0,
      changeLabel: 'Latest month',
      icon: Calendar,
    },
    {
      title: 'MoM Growth',
      value: `${momGrowth >= 0 ? '+' : ''}${momGrowth.toFixed(1)}%`,
      change: momGrowth ?? 0,
      icon: momGrowth >= 0 ? TrendingUp : TrendingDown,
    },
    {
      title: 'Best Month',
      value: bestMonth.month,
      changeLabel: formatCurrency(bestMonth.revenue, true),
      icon: TrendingUp,
    },
    {
      title: 'Volatility',
      value: `${volatility.toFixed(1)}%`,
      changeLabel: 'Revenue stability',
      icon: Activity,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="glass-card px-3 py-2 text-xs">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-muted-foreground">
              {p.name === 'growth'
                ? `Growth: ${p.value.toFixed(1)}%`
                : `Revenue: ${formatCurrency(p.value, true)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Time Intelligence
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Temporal analysis of revenue trends and patterns
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KPICard key={kpi.title} {...kpi} index={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <ChartCard
          title="Monthly Revenue Trend"
          subtitle="Year-to-date revenue performance"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient
                  id="revGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="hsl(187, 85%, 53%)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="100%"
                    stopColor="hsl(187, 85%, 53%)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(217, 33%, 18%)"
              />

              <XAxis
                dataKey="month"
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
              />

              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(v) => formatCurrency(v, true)}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                dataKey="revenue"
                stroke="hsl(187, 85%, 53%)"
                fill="url(#revGradient)"
                strokeWidth={2}
              />

              <Line
                dataKey="revenue"
                stroke="hsl(187, 85%, 53%)"
                strokeWidth={2}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* MoM Growth */}
        <ChartCard
          title="Month-over-Month Growth"
          subtitle="Percentage change from previous month"
        >
          {monthlyRevenue.filter(m => m.growth !== null).length < 2 ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Insufficient history to calculate growth
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue.slice(1)}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(217, 33%, 18%)"
                />

                <XAxis
                  dataKey="month"
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                />

                <YAxis
                  tickFormatter={(v) => `${v}%`}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                />

                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={0} stroke="hsl(217, 33%, 25%)" />

                <Bar
                  dataKey="growth"
                  fill="hsl(187, 85%, 53%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
};

export default TimeIntelligence;
