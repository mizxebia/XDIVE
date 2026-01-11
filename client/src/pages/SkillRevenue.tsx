import React from 'react';
import {
  Code2,
  Star,
  Target,
  AlertTriangle,
} from 'lucide-react';
import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import { skillRevenue, formatCurrency } from '@/data/dashboardData';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = [
  'hsl(187, 85%, 53%)',
  'hsl(160, 84%, 39%)',
  'hsl(262, 83%, 58%)',
  'hsl(38, 92%, 50%)',
  'hsl(217, 91%, 60%)',
  'hsl(0, 72%, 51%)',
];

const SkillRevenue: React.FC = () => {
  const totalSkillRevenue = skillRevenue.reduce((sum, s) => sum + s.revenue, 0);
  const topSkill = skillRevenue[0];
  const topSkillPercentage = (topSkill.revenue / totalSkillRevenue) * 100;
  
  // Skill dependency (HHI for skills)
  const skillDependency = skillRevenue.reduce(
    (sum, s) => sum + Math.pow(s.revenue / totalSkillRevenue, 2),
    0
  );

  const kpis = [
    {
      title: 'Revenue by Skills',
      value: formatCurrency(totalSkillRevenue, true),
      change: 15.3,
      icon: Code2,
    },
    {
      title: 'Top Skill',
      value: topSkill.skill,
      changeLabel: formatCurrency(topSkill.revenue, true),
      icon: Star,
    },
    {
      title: 'Top Skill Contribution',
      value: `${topSkillPercentage.toFixed(1)}%`,
      change: 2.8,
      icon: Target,
    },
    {
      title: 'Skill Dependency',
      value: (skillDependency * 100).toFixed(1),
      changeLabel: 'Concentration Index',
      icon: AlertTriangle,
    },
  ];

  const pieData = skillRevenue.slice(0, 6).map((s) => ({
    name: s.skill,
    value: s.revenue,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card px-3 py-2 text-xs">
          <p className="font-medium text-foreground">{data.name || data.skill}</p>
          <p className="text-muted-foreground">
            Revenue: {formatCurrency(data.value || data.revenue, true)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Heatmap data
  const heatmapData = skillRevenue.slice(0, 8).map((s) => ({
    skill: s.skill,
    intensity: (s.revenue / topSkill.revenue) * 100,
    revenue: s.revenue,
  }));

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Skill vs Revenue</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Analyze revenue contribution by technical skill sets
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
        {/* Stacked Bar Chart */}
        <ChartCard title="Revenue by Skill" subtitle="Top performing technical skills">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skillRevenue}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="skillBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(187, 85%, 53%)" />
                  <stop offset="100%" stopColor="hsl(187, 85%, 40%)" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 18%)" />
              <XAxis
                dataKey="skill"
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
                angle={-45}
                textAnchor="end"
                height={70}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value, true)}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                axisLine={{ stroke: 'hsl(217, 33%, 18%)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="url(#skillBarGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Donut Chart */}
        <ChartCard title="Skill Revenue Share" subtitle="Distribution across top skills">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {pieData.slice(0, 4).map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-muted-foreground">{entry.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Heatmap */}
      <ChartCard title="Skill × Revenue Intensity" subtitle="Visual representation of skill value">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2 h-full items-center">
          {heatmapData.map((item) => (
            <div
              key={item.skill}
              className="aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all hover:scale-105"
              style={{
                backgroundColor: `hsl(187, 85%, ${20 + item.intensity * 0.4}%)`,
              }}
            >
              <span className="text-xs font-medium text-foreground text-center">
                {item.skill}
              </span>
              <span className="text-[10px] text-muted-foreground mt-1">
                {formatCurrency(item.revenue, true)}
              </span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
};

export default SkillRevenue;
