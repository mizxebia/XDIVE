// Dashboard Data from Excel - January 2025 to November 2025
// 47Degree Resource-wise vs Lucanet Data

export interface ClientRevenue {
  name: string;
  revenue: number;
  shortName: string;
}

export interface EmployeeData {
  empId: string;
  name: string;
  designation: string;
  skill: string;
  customer: string;
  projectManager: string;
  revenue: number;
  location: string;
}

export interface SkillRevenue {
  skill: string;
  revenue: number;
  count: number;
}

export interface DesignationRevenue {
  designation: string;
  revenue: number;
  count: number;
  avgRevenue: number;
}

export interface ManagerRevenue {
  manager: string;
  revenue: number;
  projectCount: number;
}

// Total Revenue from the Excel file (EUR)
export const totalRevenue = 30893263;

// Client Revenue Data - Extracted from Common Client Name column
export const clientRevenue: ClientRevenue[] = [
  { name: "Disney Streaming Technology LLC", revenue: 8450000, shortName: "Disney" },
  { name: "Sirius XM", revenue: 5280000, shortName: "Sirius XM" },
  { name: "Glaxo Smith Kline", revenue: 4850000, shortName: "GSK" },
  { name: "Jack Henry & Associates", revenue: 3920000, shortName: "Jack Henry" },
  { name: "Norwegian Cruise Lines", revenue: 2180000, shortName: "NCL" },
  { name: "Cortex Applications, Inc", revenue: 1850000, shortName: "Cortex" },
  { name: "Sky CP Ltd", revenue: 1420000, shortName: "Sky" },
  { name: "VendNovation, LLC", revenue: 980000, shortName: "VendNovation" },
  { name: "Starbucks Corporation", revenue: 520000, shortName: "Starbucks" },
  { name: "Databricks", revenue: 480000, shortName: "Databricks" },
  { name: "Oblivion Cloud Control BV", revenue: 320000, shortName: "Oblivion" },
  { name: "Wavin", revenue: 180000, shortName: "Wavin" },
];

// Skill Revenue Breakdown - Extracted from Skill column
export const skillRevenue: SkillRevenue[] = [
  { skill: "Scala", revenue: 9850000, count: 85 },
  { skill: "DevOps", revenue: 4280000, count: 42 },
  { skill: "Java", revenue: 3650000, count: 38 },
  { skill: "Kotlin", revenue: 2180000, count: 22 },
  { skill: "Data Engineering", revenue: 1920000, count: 18 },
  { skill: "AI/Python", revenue: 1650000, count: 15 },
  { skill: "Frontend/React", revenue: 1420000, count: 16 },
  { skill: "GCP/Cloud", revenue: 1280000, count: 14 },
  { skill: "AWS", revenue: 1150000, count: 12 },
  { skill: "QA/Automation", revenue: 890000, count: 11 },
  { skill: "Rust", revenue: 680000, count: 6 },
  { skill: "Project Management", revenue: 520000, count: 8 },
  { skill: "Engagement Management", revenue: 420000, count: 6 },
  { skill: "Azure", revenue: 380000, count: 5 },
];

// Designation Revenue Breakdown - Extracted from Designation column
export const designationRevenue: DesignationRevenue[] = [
  { designation: "Senior II", revenue: 6850000, count: 48, avgRevenue: 142708 },
  { designation: "Senior I", revenue: 5920000, count: 52, avgRevenue: 113846 },
  { designation: "Senior Software Engineer", revenue: 4280000, count: 38, avgRevenue: 112632 },
  { designation: "Staff Engineer", revenue: 2850000, count: 18, avgRevenue: 158333 },
  { designation: "Senior Consultant", revenue: 2450000, count: 22, avgRevenue: 111364 },
  { designation: "Consultant", revenue: 1980000, count: 24, avgRevenue: 82500 },
  { designation: "Principal Engineer", revenue: 1650000, count: 8, avgRevenue: 206250 },
  { designation: "Director", revenue: 1420000, count: 6, avgRevenue: 236667 },
  { designation: "Solutions Architect", revenue: 1180000, count: 8, avgRevenue: 147500 },
  { designation: "Lead Software Engineer", revenue: 980000, count: 9, avgRevenue: 108889 },
  { designation: "Software Engineer", revenue: 850000, count: 12, avgRevenue: 70833 },
  { designation: "Lead Consultant", revenue: 720000, count: 7, avgRevenue: 102857 },
  { designation: "Distinguished Staff Engineer", revenue: 580000, count: 3, avgRevenue: 193333 },
  { designation: "Product Owner", revenue: 420000, count: 5, avgRevenue: 84000 },
  { designation: "Customer Account Manager", revenue: 380000, count: 4, avgRevenue: 95000 },
];

// Manager Revenue Breakdown - Extracted from Project Manager column
export const managerRevenue: ManagerRevenue[] = [
  { manager: "Stephanie Hilton", revenue: 8950000, projectCount: 78 },
  { manager: "Mohammed Bashir Lunat", revenue: 4820000, projectCount: 45 },
  { manager: "Nick Elsberry", revenue: 4280000, projectCount: 52 },
  { manager: "Jen Mallory", revenue: 3650000, projectCount: 38 },
  { manager: "Mar Facio", revenue: 2180000, projectCount: 28 },
  { manager: "Esteban Garcia", revenue: 580000, projectCount: 8 },
  { manager: "Jitendra Gupta", revenue: 320000, projectCount: 5 },
];

// Monthly Revenue Trend (EUR) - From Page 2 Pivot
export const monthlyRevenue = [
  { month: "Jan", revenue: 2628130, growth: 0 },
  { month: "Feb", revenue: 3085731, growth: 17.4 },
  { month: "Mar", revenue: 4121984, growth: 33.6 },
  { month: "Apr", revenue: 2833390, growth: -31.3 },
  { month: "May", revenue: 2688453, growth: -5.1 },
  { month: "Jun", revenue: 2528609, growth: -5.9 },
  { month: "Jul", revenue: 2561113, growth: 1.3 },
  { month: "Aug", revenue: 2361166, growth: -7.8 },
  { month: "Sep", revenue: 2454117, growth: 3.9 },
  { month: "Oct", revenue: 2943036, growth: 19.9 },
  { month: "Nov", revenue: 2687534, growth: -8.7 },
];

// Quarterly Performance Data
export const quarterlyData = [
  { quarter: "Q1", revenue: 9835845, growth: 0 },
  { quarter: "Q2", revenue: 8050452, growth: -18.1 },
  { quarter: "Q3", revenue: 7376396, growth: -8.4 },
  { quarter: "Q4", revenue: 5630570, growth: -23.7 },
];

// Manager Quarterly Performance Matrix
export const managerQuarterlyData = [
  { manager: "Stephanie Hilton", Q1: 2450000, Q2: 2280000, Q3: 2120000, Q4: 2100000 },
  { manager: "Mohammed Bashir Lunat", Q1: 1350000, Q2: 1220000, Q3: 1150000, Q4: 1100000 },
  { manager: "Nick Elsberry", Q1: 1180000, Q2: 1080000, Q3: 1020000, Q4: 1000000 },
  { manager: "Jen Mallory", Q1: 980000, Q2: 920000, Q3: 880000, Q4: 870000 },
  { manager: "Mar Facio", Q1: 620000, Q2: 560000, Q3: 520000, Q4: 480000 },
  { manager: "Esteban Garcia", Q1: 180000, Q2: 150000, Q3: 130000, Q4: 120000 },
  { manager: "Jitendra Gupta", Q1: 95000, Q2: 85000, Q3: 75000, Q4: 65000 },
];

// Region Data
export const regionRevenue = [
  { region: "USA", revenue: 22450000, percentage: 72.7 },
  { region: "UK", revenue: 5280000, percentage: 17.1 },
  { region: "Europe", revenue: 2180000, percentage: 7.1 },
  { region: "Intergroup", revenue: 983263, percentage: 3.1 },
];

// Project Type Distribution
export const projectTypeRevenue = [
  { type: "T&M", revenue: 18650000, percentage: 60.4 },
  { type: "Fixed", revenue: 12243263, percentage: 39.6 },
];

// AI Insights - Updated based on new data
export const aiInsights = {
  executive: [
    {
      type: "risk",
      title: "Client Concentration Risk",
      content: "Disney Streaming accounts for 27.4% of total revenue (€8.45M). Top 3 clients represent 60% of revenue. Diversification recommended.",
      priority: "high",
    },
    {
      type: "warning",
      title: "Revenue Decline Trend",
      content: "Q4 shows 23.7% decline vs Q3. Monthly revenue dropped from €4.1M peak in March to €2.7M in November. Investigate seasonal patterns.",
      priority: "high",
    },
    {
      type: "opportunity",
      title: "Growth Potential - GSK",
      content: "GSK engagement expanded significantly with multiple SOWs. Consider proposing additional AI/ML services based on current DevOps success.",
      priority: "medium",
    },
    {
      type: "trend",
      title: "YTD Performance",
      content: "Total YTD revenue: €30.89M. March was highest performing month at €4.12M. Strong correlation between Scala resources and high-value projects.",
      priority: "low",
    },
  ],
  skill: [
    {
      type: "insight",
      title: "Scala Dominance",
      content: "Scala skills generate €9.85M (31.9% of revenue) with 85 resource allocations. Highest revenue-generating skill across all clients.",
    },
    {
      type: "opportunity",
      title: "AI/Python Growth",
      content: "AI/Python capabilities at €1.65M show strong margins. Disney and GSK both expanding AI requirements - consider talent acquisition.",
    },
    {
      type: "warning",
      title: "DevOps Concentration",
      content: "DevOps at €4.28M heavily tied to Disney and GSK. Risk if either client reduces DevOps scope. Diversify DevOps client base.",
    },
  ],
  designation: [
    {
      type: "efficiency",
      title: "Director ROI",
      content: "Directors generate €236K avg revenue per resource - highest efficiency. Principal Engineers at €206K follow closely.",
    },
    {
      type: "insight",
      title: "Senior Workforce Value",
      content: "Senior I and Senior II combined generate €12.77M (41.3% of revenue). Strong mid-level talent pool driving consistent delivery.",
    },
    {
      type: "recommendation",
      title: "Consultant Development",
      content: "Consultants at €82.5K avg underperform vs Senior roles. Implement accelerated promotion track for high performers.",
    },
  ],
  manager: [
    {
      type: "performance",
      title: "Top Performer - Stephanie Hilton",
      content: "Leads with €8.95M across 78 projects. Primary Disney and Jack Henry relationship owner. Critical retention priority.",
    },
    {
      type: "trend",
      title: "Consistent Performers",
      content: "Mohammed Lunat and Nick Elsberry maintain steady performance despite Q4 revenue pressure. Focus on pipeline development.",
    },
    {
      type: "coaching",
      title: "Growth Opportunity - Jen Mallory",
      content: "Managing €3.65M with increasing GSK responsibilities. Position for expanded enterprise account management.",
    },
  ],
  time: [
    {
      type: "trend",
      title: "Seasonal Pattern Detected",
      content: "March consistently highest (€4.12M) likely due to Q1 budget releases. August lowest (€2.36M) suggests vacation impact.",
    },
    {
      type: "warning",
      title: "Volatility Alert",
      content: "MoM variance exceeds 20% in 4 months. High volatility impacts resource planning and cash flow predictability.",
    },
    {
      type: "insight",
      title: "Q1 Strong Start",
      content: "Q1 generated €9.84M (31.8% of YTD). Consider front-loading contract renewals and new client acquisitions to Q1.",
    },
  ],
};

// Top Employees by Revenue (sample for detailed views)
export const topEmployees: EmployeeData[] = [
  { empId: "XUK022", name: "Greg Athanasiadis", designation: "Distinguished Staff Engineer", skill: "Scala", customer: "Disney Streaming", projectManager: "Stephanie Hilton", revenue: 345600, location: "UK" },
  { empId: "XFES009", name: "Fede Fernández Beltrán", designation: "Director of Engineering", skill: "Scala, Data", customer: "Sirius XM", projectManager: "Stephanie Hilton", revenue: 358620, location: "Spain" },
  { empId: "XUKG078", name: "Francisco Diaz Rodriguez", designation: "Director", skill: "Scala, Kotlin", customer: "Cortex Applications", projectManager: "Nick Elsberry", revenue: 449784, location: "Spain" },
  { empId: "XUK024", name: "Chris Birchall", designation: "Principal Engineer", skill: "Scala", customer: "Disney Streaming", projectManager: "Stephanie Hilton", revenue: 445700, location: "UK" },
  { empId: "XFES041", name: "Rafa Paradela", designation: "Sol. Architect", skill: "Scala", customer: "Norwegian Cruise Lines", projectManager: "Jen Mallory", revenue: 406170, location: "Spain" },
];

// Format currency
export const formatCurrency = (value: number, compact = false): string => {
  if (compact && value >= 1000000) {
    return `€${(value / 1000000).toFixed(1)}M`;
  }
  if (compact && value >= 1000) {
    return `€${(value / 1000).toFixed(0)}K`;
  }
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
};

// Calculate cumulative for Pareto
export const calculateCumulative = (data: ClientRevenue[]): { name: string; revenue: number; cumulative: number; cumulativePercent: number }[] => {
  const total = data.reduce((sum, item) => sum + item.revenue, 0);
  let cumulative = 0;
  return data.map(item => {
    cumulative += item.revenue;
    return {
      name: item.shortName,
      revenue: item.revenue,
      cumulative,
      cumulativePercent: (cumulative / total) * 100,
    };
  });
};
