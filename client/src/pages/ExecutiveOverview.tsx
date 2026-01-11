import React from 'react';
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
import {
  clientRevenue,
  totalRevenue,
  formatCurrency,
} from '@/data/dashboardData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from 'recharts';

const ExecutiveOverview: React.FC = () => {
  // Calculate KPIs
  const avgRevenuePerClient = totalRevenue / clientRevenue.length;
  const topClientRevenue = clientRevenue[0].revenue;
  const topClientPercentage = (topClientRevenue / totalRevenue) * 100;
  const top5Revenue = clientRevenue.slice(0, 5).reduce((sum, c) => sum + c.revenue, 0);
  const top5Percentage = (top5Revenue / totalRevenue) * 100;
  const herfindahlIndex = clientRevenue.reduce((sum, c) => sum + Math.pow(c.revenue / totalRevenue, 2), 0);
  const longTailRevenue = clientRevenue.slice(5).reduce((sum, c) => sum + c.revenue, 0);
  const longTailPercentage = (longTailRevenue / totalRevenue) * 100;

  // Prepare chart data
  const barChartData = clientRevenue.map((c) => ({
    name: c.shortName,
    revenue: c.revenue,
    fill: 'url(#barGradient)',
  }));

  // Pareto data
  let cumulative = 0;
  const paretoData = clientRevenue.map((c) => {
    cumulative += c.revenue;
    return {
      name: c.shortName,
      revenue: c.revenue,
      cumulative: (cumulative / totalRevenue) * 100,
    };
  });

  const kpis = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue, true),
      changeLabel: 'Jan-Nov 2025',
      icon: DollarSign,
    },
    {
      title: 'Avg Revenue/Client',
      value: formatCurrency(avgRevenuePerClient, true),
      changeLabel: `${clientRevenue.length} clients`,
      icon: Users,
    },
    {
      title: 'Top Client %',
      value: `${topClientPercentage.toFixed(1)}%`,
      changeLabel: 'Disney Streaming',
      icon: Target,
    },
    {
      title: 'Top 5 Clients %',
      value: `${top5Percentage.toFixed(1)}%`,
      changeLabel: 'Concentration risk',
      icon: PieChart,
    },
    {
      title: 'Revenue Concentration',
      value: (herfindahlIndex * 10000).toFixed(0),
      changeLabel: 'HHI Index',
      icon: Percent,
    },
    {
      title: 'Long-Tail Revenue',
      value: `${longTailPercentage.toFixed(1)}%`,
      changeLabel: `Bottom ${clientRevenue.length - 5} clients`,
      icon: TrendingUp,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card px-3 py-2 text-xs">
          <p className="font-medium text-foreground">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-muted-foreground">
              {entry.name}: {entry.name === 'cumulative' ? `${entry.value.toFixed(1)}%` : formatCurrency(entry.value, true)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Executive Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Revenue analytics and client concentration metrics
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard
            key={kpi.title}
            {...kpi}
            index={index}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Client Bar Chart */}
        <ChartCard
          title="Revenue by Client"
          subtitle="Ranked by revenue contribution"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(187, 85%, 53%)" />
                  <stop offset="100%" stopColor="hsl(160, 84%, 39%)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={(value) => formatCurrency(value, true)}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
                width={80}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cumulative Revenue (Pareto) */}
        <ChartCard
          title="Cumulative Revenue Distribution"
          subtitle="Pareto analysis of client contribution"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={paretoData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(187, 85%, 53%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
              <XAxis
                dataKey="name"
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => formatCurrency(value, true)}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: 'hsl(160, 84%, 39%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="revenue" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                stroke="hsl(160, 84%, 39%)"
                fill="url(#areaGradient)"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulative"
                stroke="hsl(160, 84%, 39%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(160, 84%, 39%)', strokeWidth: 0, r: 4 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default ExecutiveOverview;
