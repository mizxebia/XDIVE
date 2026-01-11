import React from 'react';
import {
  UserCog,
  Trophy,
  TrendingUp,
  Activity,
} from 'lucide-react';

import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import { useManagerPerformanceData } from '@/hooks/useManagerPerformanceData';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const QUARTER_COLORS = {
  Q1: 'hsl(262, 83%, 58%)',
  Q2: 'hsl(217, 91%, 60%)',
  Q3: 'hsl(187, 85%, 53%)',
  Q4: 'hsl(160, 84%, 39%)',
};

const formatCurrency = (value: number, compact = false) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);

const ManagerPerformance: React.FC = () => {
  const { loading, managerQuarterlyData, managerRevenue } =
    useManagerPerformanceData();

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>;
  }

  const q3Total = managerQuarterlyData.reduce((s, m) => s + m.Q3, 0);
  const q4Total = managerQuarterlyData.reduce((s, m) => s + m.Q4, 0);

  const qoqGrowth =
    q3Total > 0 ? ((q4Total - q3Total) / q3Total) * 100 : 0;

  const topManager = managerRevenue[0];

  const avgQ4 = q4Total / (managerQuarterlyData.length || 1);
  const variance =
    managerQuarterlyData.reduce(
      (s, m) => s + Math.pow(m.Q4 - avgQ4, 2),
      0
    ) / (managerQuarterlyData.length || 1);

  const stabilityScore = Math.max(
    0,
    100 - (Math.sqrt(variance) / avgQ4) * 100
  );

  const kpis = [
    {
      title: 'Q4 Revenue',
      value: formatCurrency(q4Total, true),
      change: qoqGrowth,
      icon: UserCog,
    },
    {
      title: 'Top Manager',
      value: topManager?.manager?.split(' ')[0] ?? '-',
      changeLabel: formatCurrency(topManager?.revenue ?? 0, true),
      icon: Trophy,
    },
    {
      title: 'QoQ Growth',
      value: `${qoqGrowth >= 0 ? '+' : ''}${qoqGrowth.toFixed(1)}%`,
      icon: TrendingUp,
    },
    {
      title: 'Team Stability',
      value: `${stabilityScore.toFixed(0)}%`,
      changeLabel: 'Performance consistency',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manager Quarterly Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quarterly revenue analysis by project manager
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k, i) => (
          <KPICard key={k.title} {...k} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Manager vs Quarter"
          subtitle="Revenue by manager across quarters"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={managerQuarterlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217,33%,18%)" />
              <XAxis
                dataKey="manager"
                tick={{ fontSize: 9 }}
                tickFormatter={(v) => v.split(' ')[0]}
              />
              <YAxis tickFormatter={(v) => formatCurrency(v, true)} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Q1" fill={QUARTER_COLORS.Q1} />
              <Bar dataKey="Q2" fill={QUARTER_COLORS.Q2} />
              <Bar dataKey="Q3" fill={QUARTER_COLORS.Q3} />
              <Bar dataKey="Q4" fill={QUARTER_COLORS.Q4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Performance Heatmap"
          subtitle="Manager × Quarter intensity matrix"
        >
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-2">Manager</th>
                {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                  <th key={q} className="text-center p-2">{q}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {managerQuarterlyData.map((m) => (
                <tr key={m.manager}>
                  <td className="p-2 font-medium">
                    {m.manager.split(' ')[0]}
                  </td>
                  {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
                    <td key={q} className="p-1">
                      <div className="h-9 rounded flex items-center justify-center bg-muted">
                        {formatCurrency(m[q], true)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      </div>
    </div>
  );
};

export default ManagerPerformance;
