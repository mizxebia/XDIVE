import React from 'react';
import {
  Users,
  TrendingUp,
  Award,
  BarChart3,
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import { designationRevenue, formatCurrency } from '@/data/dashboardData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';

const DesignationRevenue: React.FC = () => {
  const totalRevenue = designationRevenue.reduce((sum, d) => sum + d.revenue, 0);
  const totalCount = designationRevenue.reduce((sum, d) => sum + d.count, 0);
  const avgRevenuePerRole = totalRevenue / totalCount;
  const topRole = designationRevenue[0];
  
  // Revenue efficiency (avg revenue per person by designation)
  const avgEfficiency = designationRevenue.reduce((sum, d) => sum + d.avgRevenue, 0) / designationRevenue.length;

  const kpis = [
    {
      title: 'Revenue by Role',
      value: formatCurrency(totalRevenue, true),
      change: 18.4,
      icon: Users,
    },
    {
      title: 'Avg Revenue/Role',
      value: formatCurrency(avgRevenuePerRole, true),
      change: 5.2,
      icon: TrendingUp,
    },
    {
      title: 'Top Role',
      value: topRole.designation.replace('Senior ', 'Sr '),
      changeLabel: formatCurrency(topRole.revenue, true),
      icon: Award,
    },
    {
      title: 'Revenue Efficiency',
      value: formatCurrency(avgEfficiency, true),
      changeLabel: 'Per resource avg',
      icon: BarChart3,
    },
  ];

  // Scatter data for box-like distribution
  const scatterData = designationRevenue.map((d) => ({
    designation: d.designation.replace('Senior ', 'Sr '),
    avgRevenue: d.avgRevenue,
    count: d.count,
    revenue: d.revenue,
  }));

  // Highlight low-efficiency roles
  const lowEfficiencyRoles = designationRevenue.filter(
    (d) => d.avgRevenue < avgEfficiency * 0.8
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card px-3 py-2 text-xs">
          <p className="font-medium text-foreground">{data.designation}</p>
          <p className="text-muted-foreground">
            Revenue: {formatCurrency(data.revenue, true)}
          </p>
          <p className="text-muted-foreground">
            Avg/Person: {formatCurrency(data.avgRevenue, true)}
          </p>
          <p className="text-muted-foreground">Count: {data.count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Designation vs Revenue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Revenue analysis by employee designation levels
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
        {/* Bar Chart */}
        <ChartCard title="Revenue by Designation" subtitle="Total revenue contribution by role">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={designationRevenue.slice(0, 8)}
              layout="vertical"
              margin={{ top: 0, right: 20, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="desigBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                  <stop offset="100%" stopColor="hsl(217, 91%, 60%)" />
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
                dataKey="designation"
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 9 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
                width={100}
                tickFormatter={(value) => value.replace('Senior ', 'Sr ')}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="url(#desigBarGradient)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Scatter Chart for Distribution */}
        <ChartCard title="Revenue Distribution" subtitle="Bubble size indicates team size">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
              <XAxis
                type="category"
                dataKey="designation"
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 8 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                type="number"
                dataKey="avgRevenue"
                tickFormatter={(value) => formatCurrency(value, true)}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <ZAxis type="number" dataKey="count" range={[100, 600]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={scatterData} fill="hsl(187, 85%, 53%)" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Low Efficiency Alert */}
      {lowEfficiencyRoles.length > 0 && (
        <div className="glass-card p-4 border-l-2 border-l-warning">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-warning" />
            High-Cost Low-Revenue Roles
          </h3>
          <p className="text-xs text-muted-foreground mt-2">
            The following roles generate below-average revenue per resource:
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {lowEfficiencyRoles.map((role) => (
              <span
                key={role.designation}
                className="px-2 py-1 text-xs bg-warning/10 text-warning rounded"
              >
                {role.designation} ({formatCurrency(role.avgRevenue, true)}/person)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignationRevenue;
