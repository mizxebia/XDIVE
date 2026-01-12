import { 
  BarChart3, 
  Brain, 
  LineChart, 
  Search, 
  Sparkles 
} from "lucide-react";

import FeatureCard from "../components/FeatureCard";
import TeamCard from "../components/TeamCard";

const LandingPage = () => {

  const features = [
    {
      icon: BarChart3,
      title: "Deep Data Insights",
      description: "Get meaningful insights from complex datasets in seconds.",
    },
    {
      icon: Brain,
      title: "Advanced Data Interpretation",
      description:
        "AI-powered interpretation to convert raw data into actionable intelligence.",
    },
    {
      icon: LineChart,
      title: "Powerful Visualization Engine",
      description:
        "Interactive charts and visuals for better decision making.",
    },
    {
      icon: Search,
      title: "Pattern & Trend Detection",
      description:
        "Identify hidden patterns, trends, and anomalies effortlessly.",
    },
    {
      icon: Sparkles,
      title: "AI-Driven Analysis",
      description:
        "Leverage AI to deep dive into your data and uncover opportunities.",
    },
  ];

  const team = [
    { name: "Manik Sharma", designation: "Lead Consultant" },
    { name: "Rishi Dwivedi", designation: "Consultant" },
    { name: "Mizzan Ur Rehman", designation: "Consultant" },
    { name: "Nikhil Chhetri", designation: "Consultant" },
    { name: "Rahul Budhan", designation: "Consultant" },
    { name: "Sk Sohail", designation: "Consultant" },
    { name: "Prasoon Ghosh", designation: "Consultant" },
    { name: "Ankit Gupta", designation: "Consultant" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* Hero + Content */}
      <main className="relative z-10 w-full max-w-7xl px-4 pt-16 md:pt-24 pb-20">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 leading-tight tracking-tight">
            Shaping Tomorrow.
          </h1>
          <p className="text-4xl md:text-5xl font-bold text-vibgyor mb-10">
            with AI Today
          </p>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
            Transform your raw data into actionable intelligence with XDIVE's
            powerful AI-driven analytics and visualization platform.
          </p>
        </div>

        {/* Features */}
        <section className="mt-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">
            Why Choose <span className="text-gradient">XDIVE</span>?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 justify-items-center">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={feature.title}
                className="animate-fade-in w-full max-w-sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto justify-items-center">
            {features.slice(3).map((feature, index) => (
              <div
                key={feature.title}
                className="animate-fade-in w-full max-w-sm"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mt-24 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Meet the <span className="text-gradient">Team</span>
          </h2>
          <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
            The passionate experts behind XDIVE's innovation
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="animate-fade-in w-full max-w-xs"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TeamCard {...member} />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 w-full text-center">
        <div className="text-sm text-muted-foreground">
          © 2025 XDIVE. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
