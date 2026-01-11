import React from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import { monthlyRevenue, formatCurrency } from '@/data/dashboardData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  Area,
  AreaChart,
} from 'recharts';

const TimeIntelligence: React.FC = () => {
  // Use growth data from the file (already calculated from Excel)
  const momData = monthlyRevenue;

  const currentMonth = monthlyRevenue[monthlyRevenue.length - 1];
  const prevMonth = monthlyRevenue[monthlyRevenue.length - 2];
  const momGrowth = currentMonth.growth;

  const bestMonth = monthlyRevenue.reduce((best, m) => m.revenue > best.revenue ? m : best);
  const worstMonth = monthlyRevenue.reduce((worst, m) => m.revenue < worst.revenue ? m : worst);

  // Volatility (standard deviation)
  const avgRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0) / monthlyRevenue.length;
  const variance = monthlyRevenue.reduce((sum, m) => sum + Math.pow(m.revenue - avgRevenue, 2), 0) / monthlyRevenue.length;
  const volatility = (Math.sqrt(variance) / avgRevenue) * 100;

  // Total YTD
  const totalYTD = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0);

  const kpis = [
    {
      title: 'Monthly Revenue',
      value: formatCurrency(currentMonth.revenue, true),
      change: momGrowth,
      changeLabel: 'November 2025',
      icon: Calendar,
    },
    {
      title: 'MoM Growth',
      value: `${momGrowth >= 0 ? '+' : ''}${momGrowth.toFixed(1)}%`,
      change: momGrowth,
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
    if (active && payload && payload.length) {
      return (
        <div className="glass-card px-3 py-2 text-xs">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-muted-foreground">
              {entry.name === 'growth'
                ? `Growth: ${entry.value >= 0 ? '+' : ''}${entry.value.toFixed(1)}%`
                : `Revenue: ${formatCurrency(entry.value, true)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Time Intelligence</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Temporal analysis of revenue trends and patterns
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={kpi.title} {...kpi} index={index} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Line Chart */}
        <ChartCard title="Monthly Revenue Trend" subtitle="Year-to-date revenue performance">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyRevenue}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value, true)}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(187, 85%, 53%)"
                fill="url(#revenueGradient)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(187, 85%, 53%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(187, 85%, 53%)', strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(187, 85%, 53%)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* MoM Growth Bar Chart */}
        <ChartCard title="Month-over-Month Growth" subtitle="Percentage change from previous month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={momData.slice(1)}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="hsl(217, 33%, 25%)" />
              <Bar
                dataKey="growth"
                radius={[4, 4, 0, 0]}
                fill="hsl(187, 85%, 53%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* AI Narrative */}
      <div className="glass-card p-5 border-l-2 border-l-primary">
        <h3 className="text-sm font-semibold text-foreground mb-3">AI Trend Analysis</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            📈 <span className="text-foreground font-medium">Peak Performance:</span> March achieved highest monthly revenue at €4.12M (+33.6% MoM), likely driven by Q1 budget releases and project kickoffs.
          </p>
          <p>
            📊 <span className="text-foreground font-medium">Seasonality Pattern:</span> Clear dip from April-August (summer slowdown), with recovery starting in September. August lowest at €2.36M.
          </p>
          <p>
            ⚠️ <span className="text-foreground font-medium">Volatility Alert:</span> MoM variance exceeds 20% in 4 months. High fluctuations impact resource planning and cash flow.
          </p>
          <p>
            🎯 <span className="text-foreground font-medium">YTD Total:</span> €30.89M achieved Jan-Nov. Strong Q1 contributed 31.8% of annual revenue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeIntelligence;
