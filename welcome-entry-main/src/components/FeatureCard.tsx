import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] hover:-translate-y-1">
      {/* Gradient border glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-4 glow-primary group-hover:glow-primary-hover transition-shadow duration-300">
          <Icon className="h-6 w-6 text-primary-foreground" />
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>
        
        {/* Description - hidden by default, revealed on hover */}
        <div className="overflow-hidden">
          <p className="text-sm text-muted-foreground leading-relaxed transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
