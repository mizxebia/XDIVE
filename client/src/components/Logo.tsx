import xdiveLogo from "@/assets/xdive-logo.png";
 
interface LogoProps {

  size?: "sm" | "md" | "lg";

  showSubtitle?: boolean;

  centered?: boolean;

}
 
const Logo = ({ size = "md", showSubtitle = false, centered = false }: LogoProps) => {

  const sizeClasses = {

    sm: "h-8 w-8",

    md: "h-10 w-10",

    lg: "h-14 w-14",

  };
 
  const textSizes = {

    sm: "text-xl",

    md: "text-2xl",

    lg: "text-3xl",

  };
 
  const subtitleSizes = {

    sm: "text-[8px]",

    md: "text-[9px]",

    lg: "text-xs",

  };
 
  return (
<div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>

      {/* Logo image */}
<img 

        src={xdiveLogo} 

        alt="XDIVE Logo" 

        className={`${sizeClasses[size]} object-contain`}

      />

      {/* Brand name and subtitle */}
<div className={`flex flex-col ${centered ? "items-center" : ""}`}>
<span className={`${textSizes[size]} font-extrabold tracking-tight`}>
<span className="text-foreground">X</span>
<span className="text-gradient">DIVE</span>
</span>

        {showSubtitle && (
<span className={`${subtitleSizes[size]} text-muted-foreground tracking-wider uppercase`}>

            Data Interpretation Visualization Engine
</span>

        )}
</div>
</div>

  );

};
 
export default Logo;

 