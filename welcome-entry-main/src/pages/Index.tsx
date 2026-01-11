import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Brain, 
  LineChart, 
  Search, 
  Sparkles 
} from "lucide-react";
import Logo from "@/components/Logo";
import FeatureCard from "@/components/FeatureCard";
import TeamCard from "@/components/TeamCard";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BarChart3,
      title: "Deep Data Insights",
      description: "Get meaningful insights from complex datasets in seconds.",
    },
    {
      icon: Brain,
      title: "Advanced Data Interpretation",
      description: "AI-powered interpretation to convert raw data into actionable intelligence.",
    },
    {
      icon: LineChart,
      title: "Powerful Visualization Engine",
      description: "Interactive charts and visuals for better decision making.",
    },
    {
      icon: Search,
      title: "Pattern & Trend Detection",
      description: "Identify hidden patterns, trends, and anomalies effortlessly.",
    },
    {
      icon: Sparkles,
      title: "AI-Driven Analysis",
      description: "Leverage AI to deep dive into your data and uncover opportunities.",
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
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Logo size="md" showSubtitle />
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button variant="glow" onClick={() => navigate("/signup")}>
              Sign Up
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero section */}
      <main className="relative z-10 container mx-auto px-4 pt-16 md:pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground mb-4 leading-tight tracking-tight">
            Shaping Tomorrow.
          </h1>
          <p className="text-4xl md:text-5xl font-bold text-vibgyor mb-10">
            with AI Today
          </p>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Transform your raw data into actionable intelligence with XDIVE's 
            powerful AI-driven analytics and visualization platform.
          </p>
        </div>

        {/* Features - Symmetric 3+2 layout */}
        <section className="mt-20 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            Why Choose <span className="text-gradient">XDIVE</span>?
          </h2>
          
          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={feature.title}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
          
          {/* Second row - 2 cards centered */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.slice(3, 5).map((feature, index) => (
              <div
                key={feature.title}
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 3) * 100}ms` }}
              >
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mt-24 max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
            Meet the <span className="text-gradient">Team</span>
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            The passionate experts behind XDIVE's innovation
          </p>
          
          {/* Team grid - 4 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member, index) => (
              <div
                key={member.name}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TeamCard
                  name={member.name}
                  designation={member.designation}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 XDIVE. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
