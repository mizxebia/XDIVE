import {
  Brain,
  BarChart3,
  Sparkles,
  Database,
  Zap,
  Shield,
  Users,
  TrendingUp,
} from "lucide-react";

const IntroComponent = () => {
  const features = [
    {
      icon: Database,
      title: "Deep Data Insights",
      description:
        "Uncover hidden patterns and trends within your data with advanced analytics that transform raw information into actionable intelligence.",
    },
    {
      icon: Brain,
      title: "AI-Driven Analysis",
      description:
        "Leverage cutting-edge machine learning models that continuously learn and adapt for precise predictions.",
    },
    {
      icon: Sparkles,
      title: "Interpretation",
      description:
        "Convert complex datasets into clear, business-ready insights with our intelligent interpretation layer.",
    },
  ];

  const stats = [
    { value: "10M+", label: "Data Points Processed", icon: BarChart3 },
    { value: "99.9%", label: "Accuracy Rate", icon: TrendingUp },
    { value: "50ms", label: "Analysis Speed", icon: Zap },
    { value: "500+", label: "Enterprise Clients", icon: Shield },
  ];

  const team = [
    "Manik Sharma",
    "Rishi",
    "Sohail",
    "Mizaan",
    "Rahul",
    "Prasoon",
    "Nikhil",
    "Ankit",
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="container mx-auto text-center relative z-10 max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass mb-10">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span className="text-2xl font-semibold tracking-widest bg-gradient-to-r from-emerald-400 via-lime-400 to-yellow-400 bg-clip-text text-transparent">
              X-DIVE
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight leading-tight">
            <span className="text-white">
              Shaping Tomorrow.
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-lime-400 to-yellow-400 bg-clip-text text-transparent">
              with AI Today
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed">
            Unlock the full potential of your data with an AI-powered platform
            designed to transform insights into action and accelerate growth.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-lg gradient-primary text-primary-foreground font-semibold text-lg glow hover:scale-105 transition-transform">
              Get Started
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/40 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/40" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Powerful Features</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built with cutting-edge AI and intuitive design to deliver real
              business impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-2xl glass hover:glow transition-all duration-500 hover:-translate-y-2"
              >
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Team */}
      <footer className="relative py-20 px-4 border-t border-border">
        <div className="container mx-auto text-center max-w-5xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
            Meet Our Team
          </h3>
          <p className="text-muted-foreground mb-10">
            The brilliant minds shaping the future of AI-driven intelligence.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {team.map((member, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-5 py-3 rounded-full glass hover:glow transition-all"
              >
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-medium text-foreground">{member}</span>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            © 2026 X-DIVE. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default IntroComponent;
