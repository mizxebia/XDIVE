import React from 'react';
import {
  UserCog,
  Trophy,
  TrendingUp,
  Activity,
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import { managerRevenue, managerQuarterlyData, formatCurrency } from '@/data/dashboardData';
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

const ManagerPerformance: React.FC = () => {
  const totalQuarterlyRevenue = managerQuarterlyData.reduce(
    (sum, m) => sum + m.Q4,
    0
  );
  const topManager = managerRevenue[0];
  const lowManager = managerRevenue[managerRevenue.length - 1];

  // QoQ growth calculation
  const q3Total = managerQuarterlyData.reduce((sum, m) => sum + m.Q3, 0);
  const q4Total = managerQuarterlyData.reduce((sum, m) => sum + m.Q4, 0);
  const qoqGrowth = ((q4Total - q3Total) / q3Total) * 100;

  // Stability score (inverse of variance)
  const avgQ4 = q4Total / managerQuarterlyData.length;
  const variance = managerQuarterlyData.reduce(
    (sum, m) => sum + Math.pow(m.Q4 - avgQ4, 2),
    0
  ) / managerQuarterlyData.length;
  const stabilityScore = Math.max(0, 100 - (Math.sqrt(variance) / avgQ4) * 100);

  const kpis = [
    {
      title: 'Q4 Revenue',
      value: formatCurrency(totalQuarterlyRevenue, true),
      change: qoqGrowth,
      icon: UserCog,
    },
    {
      title: 'Top Manager',
      value: topManager.manager.split(' ')[0],
      changeLabel: formatCurrency(topManager.revenue, true),
      icon: Trophy,
    },
    {
      title: 'QoQ Growth',
      value: `${qoqGrowth >= 0 ? '+' : ''}${qoqGrowth.toFixed(1)}%`,
      change: qoqGrowth,
      icon: TrendingUp,
    },
    {
      title: 'Team Stability',
      value: `${stabilityScore.toFixed(0)}%`,
      changeLabel: 'Performance consistency',
      icon: Activity,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card px-3 py-2 text-xs">
          <p className="font-medium text-foreground mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value, true)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Heatmap data
  const heatmapMax = Math.max(...managerQuarterlyData.flatMap((m) => [m.Q1, m.Q2, m.Q3, m.Q4]));

  const getHeatmapColor = (value: number) => {
    const intensity = (value / heatmapMax) * 100;
    return `hsl(187, 85%, ${15 + intensity * 0.45}%)`;
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Manager Quarterly Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quarterly revenue analysis by project manager
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
        {/* Clustered Bar Chart */}
        <ChartCard title="Manager vs Quarter" subtitle="Revenue by manager across quarters">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={managerQuarterlyData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
              <XAxis
                dataKey="manager"
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 9 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
                tickFormatter={(value) => value.split(' ')[0]}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value, true)}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '10px' }}
                iconType="square"
              />
              <Bar dataKey="Q1" fill={QUARTER_COLORS.Q1} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Q2" fill={QUARTER_COLORS.Q2} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Q3" fill={QUARTER_COLORS.Q3} radius={[2, 2, 0, 0]} />
              <Bar dataKey="Q4" fill={QUARTER_COLORS.Q4} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Heatmap */}
        <ChartCard title="Performance Heatmap" subtitle="Manager × Quarter intensity matrix">
          <div className="h-full flex flex-col justify-center">
            <div className="overflow-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-muted-foreground font-medium">Manager</th>
                    <th className="text-center p-2 text-muted-foreground font-medium">Q1</th>
                    <th className="text-center p-2 text-muted-foreground font-medium">Q2</th>
                    <th className="text-center p-2 text-muted-foreground font-medium">Q3</th>
                    <th className="text-center p-2 text-muted-foreground font-medium">Q4</th>
                  </tr>
                </thead>
                <tbody>
                  {managerQuarterlyData.map((row) => (
                    <tr key={row.manager}>
                      <td className="p-2 text-foreground font-medium">
                        {row.manager.split(' ')[0]}
                      </td>
                      {(['Q1', 'Q2', 'Q3', 'Q4'] as const).map((q) => (
                        <td key={q} className="p-1">
                          <div
                            className="h-10 rounded flex items-center justify-center text-foreground font-medium transition-transform hover:scale-105"
                            style={{ backgroundColor: getHeatmapColor(row[q]) }}
                          >
                            {formatCurrency(row[q], true)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* AI Summary */}
      <div className="glass-card p-5 border-l-2 border-l-success">
        <h3 className="text-sm font-semibold text-foreground mb-3">AI Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p className="mb-2">
              🏆 <span className="text-foreground font-medium">Top Performer:</span> Stephanie Hilton leads with €8.95M YTD across 78 projects. Primary Disney and Jack Henry relationship owner.
            </p>
            <p>
              📈 <span className="text-foreground font-medium">Strong Team:</span> Mohammed Bashir Lunat and Nick Elsberry contribute €9.1M combined. Critical GSK and Cortex account management.
            </p>
          </div>
          <div>
            <p className="mb-2">
              ⚡ <span className="text-foreground font-medium">Team Efficiency:</span> Overall team stability score of {stabilityScore.toFixed(0)}% indicates consistent performance across quarters.
            </p>
            <p>
              🎯 <span className="text-foreground font-medium">Focus Area:</span> Top 3 managers handle 74% of total revenue. Succession planning and workload distribution recommended.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerPerformance;
