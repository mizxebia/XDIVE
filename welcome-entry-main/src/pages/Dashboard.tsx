import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import Logo from "@/components/Logo";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  const stats = [
    {
      label: "Total Revenue",
      value: "€30.9M",
      change: "+12.5%",
      icon: DollarSign,
    },
    {
      label: "Avg Revenue/Client",
      value: "€2.6M",
      change: "+8.2%",
      icon: TrendingUp,
    },
    {
      label: "Active Clients",
      value: "12",
      change: "+2",
      icon: Users,
    },
    {
      label: "Top Client %",
      value: "27.4%",
      change: "-3.1%",
      icon: Activity,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Executive Overview
          </h1>
          <p className="text-muted-foreground">
            Revenue analytics and client concentration metrics
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl p-6 card-glow card-glow-hover transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gradient">{stat.value}</p>
              <p className={`text-sm mt-2 ${stat.change.startsWith('+') ? 'text-primary' : 'text-destructive'}`}>
                {stat.change} from last month
              </p>
            </div>
          ))}
        </div>

        {/* Welcome message */}
        <div className="mt-8 bg-card rounded-xl p-8 card-glow text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            🎉 Login Successful!
          </h2>
          <p className="text-muted-foreground">
            You've successfully logged in. This is a demo dashboard showcasing the design system.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
