import React from 'react';
import {
  Code2,
  Star,
  Target,
  AlertTriangle,
} from 'lucide-react';

import KPICard from '@/components/dashboard/KPICard';
import ChartCard from '@/components/dashboard/ChartCard';
import { useSkillRevenueData } from '@/hooks/useSkillRevenueData';

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

/* 🔴 COLORS UNCHANGED */
const COLORS = [
  'hsl(187, 85%, 53%)',
  'hsl(160, 84%, 39%)',
  'hsl(262, 83%, 58%)',
  'hsl(38, 92%, 50%)',
  'hsl(217, 91%, 60%)',
  'hsl(0, 72%, 51%)',
];

/* Utils */
const formatCurrency = (value: number, compact = false) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: compact ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value);

const SkillRevenue: React.FC = () => {
  const { loading, skillRevenue } = useSkillRevenueData();

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading…</div>;
  }

  /* ---------------- KPI calculations ---------------- */
  const totalSkillRevenue = skillRevenue.reduce(
    (sum, s) => sum + s.revenue,
    0
  );

  const topSkill = skillRevenue[0];

  const topSkillPercentage = topSkill
    ? (topSkill.revenue / totalSkillRevenue) * 100
    : 0;

  const skillDependency = skillRevenue.reduce(
    (sum, s) => sum + Math.pow(s.revenue / totalSkillRevenue, 2),
    0
  );

  const kpis = [
    {
      title: 'Revenue by Skills',
      value: formatCurrency(totalSkillRevenue, true),
      icon: Code2,
    },
    {
      title: 'Top Skill',
      value: topSkill?.skill ?? '-',
      changeLabel: formatCurrency(topSkill?.revenue ?? 0, true),
      icon: Star,
    },
    {
      title: 'Top Skill Contribution',
      value: `${topSkillPercentage.toFixed(1)}%`,
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

  const heatmapData = skillRevenue.slice(0, 8).map((s) => ({
    skill: s.skill,
    intensity: topSkill
      ? (s.revenue / topSkill.revenue) * 100
      : 0,
    revenue: s.revenue,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div className="glass-card px-3 py-2 text-xs">
          <p className="font-medium">{d.name || d.skill}</p>
          <p className="text-muted-foreground">
            Revenue: {formatCurrency(d.value || d.revenue, true)}
          </p>
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
          Skill vs Revenue
        </h1>
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
        {/* Bar Chart */}
        <ChartCard
          title="Revenue by Skill"
          subtitle="Top performing technical skills"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillRevenue}>
              <defs>
                <linearGradient
                  id="skillBarGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="hsl(187, 85%, 53%)" />
                  <stop offset="100%" stopColor="hsl(187, 85%, 40%)" />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(217, 33%, 18%)"
              />

              <XAxis
                dataKey="skill"
                angle={-45}
                textAnchor="end"
                height={70}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              />

              <YAxis
                tickFormatter={(v) => formatCurrency(v, true)}
                tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                dataKey="revenue"
                fill="url(#skillBarGradient)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Donut Chart + FIXED LEGEND */}
        <ChartCard
          title="Skill Revenue Share"
          subtitle="Distribution across top skills"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* ✅ LEGEND — FINAL FIX */}
          <div className="mt-6 px-4">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3">
              {pieData.map((entry, index) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-2 text-sm whitespace-nowrap"
                >
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                  <span className="text-muted-foreground font-medium">
                    {entry.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Heatmap */}
      <ChartCard
        title="Skill × Revenue Intensity"
        subtitle="Visual representation of skill value"
      >
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 h-full items-center">
          {heatmapData.map((item) => {
            const clamped = Math.min(Math.max(item.intensity, 0), 100);
            const lightness = 32 + clamped * 0.45;
            const isLightTile = lightness > 55;

            return (
              <div
                key={item.skill}
                className="aspect-square rounded-lg flex flex-col items-center justify-center p-3 transition-all hover:scale-105 shadow-md"
                style={{
                  backgroundColor: `hsl(187, 85%, ${lightness}%)`,
                }}
              >
                <span
                  className="text-sm font-semibold text-center"
                  style={{
                    color: isLightTile
                      ? 'rgba(8,15,20,0.9)'
                      : '#ffffff',
                  }}
                >
                  {item.skill}
                </span>

                <span
                  className="text-xs mt-1"
                  style={{
                    color: isLightTile
                      ? 'rgba(8,15,20,0.6)'
                      : 'rgba(255,255,255,0.8)',
                  }}
                >
                  {formatCurrency(item.revenue, true)}
                </span>
              </div>
            );
          })}
        </div>
      </ChartCard>
    </div>
  );
};

export default SkillRevenue;
