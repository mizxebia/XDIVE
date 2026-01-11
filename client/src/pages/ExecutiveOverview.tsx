import {
  DollarSign,
  Users,
  Target,
  Percent,
  PieChart,
  TrendingUp,
} from 'lucide-react';

import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import { useDashboardData } from '@/hooks/useDashboardData';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
} from 'recharts';

/* =======================
   🎨 CYAN THEME
======================= */
const CYAN = 'hsl(187, 85%, 53%)';
const CYAN_LIGHT = 'hsl(187, 85%, 65%)';
const CYAN_DARK = 'hsl(160, 84%, 39%)';

/* =======================
   💲 USD FORMATTER
======================= */
const formatCurrency = (value: number, compact = false) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);

const ExecutiveOverview = () => {
  const { loading, data, paretoData, totalValue } = useDashboardData();

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading dashboard…</div>;
  }

  /* =======================
     📊 KPI CALCULATIONS
  ======================= */
  const avgRevenue = totalValue / data.length;

  const topValue = data[0]?.value || 0;
  const topPct = (topValue / totalValue) * 100;

  const top5Value = data.slice(0, 5).reduce((s, r) => s + r.value, 0);
  const top5Pct = (top5Value / totalValue) * 100;

  const hhi =
    data.reduce(
      (sum, r) => sum + Math.pow(r.value / totalValue, 2),
      0
    ) * 10000;

  const kpis = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalValue, true),
      changeLabel: 'All periods',
      icon: DollarSign,
    },
    {
      title: 'Avg Revenue / Client',
      value: formatCurrency(avgRevenue, true),
      changeLabel: `${data.length} clients`,
      icon: Users,
    },
    {
      title: 'Top Client %',
      value: `${topPct.toFixed(1)}%`,
      changeLabel: data[0]?.name,
      icon: Target,
    },
    {
      title: 'Top 5 Clients %',
      value: `${top5Pct.toFixed(1)}%`,
      changeLabel: 'Concentration risk',
      icon: PieChart,
    },
    {
      title: 'Revenue Concentration',
      value: hhi.toFixed(0),
      changeLabel: 'HHI Index',
      icon: Percent,
    },
    {
      title: 'Long-Tail Revenue',
      value: `${(100 - top5Pct).toFixed(1)}%`,
      changeLabel: `Bottom ${Math.max(data.length - 5, 0)} clients`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Executive Overview</h1>

      {/* KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <KPICard
            key={kpi.title}
            {...kpi}
            index={i}
            className="border border-[hsl(187,85%,53%,0.25)]"
          />
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* -------- Revenue by Client -------- */}
        <ChartCard title="Revenue by Client" subtitle="Ranked contribution">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={CYAN_LIGHT} />
                  <stop offset="50%" stopColor={CYAN} />
                  <stop offset="100%" stopColor={CYAN_DARK} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="hsl(187,85%,53%,0.15)"
                strokeDasharray="3 3"
                horizontal={false}
              />

              <XAxis
                type="number"
                tickFormatter={(v) => formatCurrency(v, true)}
                tick={{ fill: 'hsl(215,20%,55%)', fontSize: 11 }}
              />

              <YAxis
                type="category"
                dataKey="name"
                width={160}
                tick={{ fill: 'hsl(215,20%,55%)', fontSize: 11 }}
              />

              <Tooltip
                contentStyle={{
                  background: 'rgba(10,15,25,0.95)',
                  border: '1px solid hsl(187,85%,53%,0.35)',
                  borderRadius: '10px',
                  boxShadow: '0 0 25px hsl(187,85%,53%,0.35)',
                }}
                formatter={(v: any) => formatCurrency(v, true)}
              />

              <Bar
                dataKey="value"
                fill="url(#cyanGradient)"
                radius={[0, 6, 6, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* -------- Pareto Chart -------- */}
        <ChartCard
          title="Cumulative Revenue Distribution"
          subtitle="Pareto (80/20) analysis"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={paretoData}>
              <defs>
                <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CYAN} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={CYAN} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="hsl(187,85%,53%,0.15)"
                strokeDasharray="3 3"
              />

              <XAxis dataKey="name" tick={false} />

              <YAxis
                yAxisId="left"
                tickFormatter={(v) => formatCurrency(v, true)}
                tick={{ fill: 'hsl(215,20%,55%)', fontSize: 11 }}
              />

              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fill: CYAN, fontSize: 11 }}
              />

              <Tooltip
                contentStyle={{
                  background: 'rgba(10,15,25,0.95)',
                  border: '1px solid hsl(187,85%,53%,0.35)',
                  borderRadius: '10px',
                  boxShadow: '0 0 25px hsl(187,85%,53%,0.35)',
                }}
              />

              <Bar
                yAxisId="left"
                dataKey="value"
                fill="hsl(187,85%,53%,0.35)"
                radius={[6, 6, 0, 0]}
              />

              <Area
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                stroke={CYAN}
                strokeWidth={3}
                fill="url(#cyanArea)"
              />

              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                stroke={CYAN}
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: CYAN_LIGHT,
                  stroke: CYAN,
                  strokeWidth: 2,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default ExecutiveOverview;
