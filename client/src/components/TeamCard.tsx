import { User } from "lucide-react";
 
interface TeamCardProps {
  name: string;
  designation: string;
}
 
const TeamCard = ({ name, designation }: TeamCardProps) => {
  return (
<div className="group relative overflow-hidden rounded-xl bg-card border border-border p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_25px_hsl(var(--primary)/0.15)] hover:-translate-y-1">
      {/* Subtle gradient overlay on hover */}
<div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
<div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
</div>
<div className="relative z-10 flex items-center gap-4">
        {/* Avatar placeholder */}
<div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
<User className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
</div>
        {/* Info */}
<div className="flex flex-col">
<span className="font-semibold text-foreground">{name}</span>
<span className="text-sm text-muted-foreground">{designation}</span>
</div>
</div>
</div>
  );
};
 
export default TeamCard;