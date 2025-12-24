import { BookOpen, HandHeart, Sparkles, Compass, CircleDot, Moon } from "lucide-react";

interface FeatureItem {
  icon: React.ReactNode;
  label: string;
  color: string;
}

const features: FeatureItem[] = [
  { 
    icon: <BookOpen size={28} />, 
    label: "Quran", 
    color: "text-islamic-green" 
  },
  { 
    icon: <HandHeart size={28} />, 
    label: "Dua", 
    color: "text-amber-500" 
  },
  { 
    icon: <Sparkles size={28} />, 
    label: "Names", 
    color: "text-pink-500" 
  },
  { 
    icon: <Compass size={28} />, 
    label: "Qibla", 
    color: "text-blue-500" 
  },
  { 
    icon: <CircleDot size={28} />, 
    label: "Tasbih", 
    color: "text-rose-500" 
  },
  { 
    icon: <Moon size={28} />, 
    label: "99 Names", 
    color: "text-purple-500" 
  },
];

const FeatureIcons = () => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {features.map((feature, index) => (
        <button
          key={feature.label}
          className="feature-icon flex-shrink-0 group cursor-pointer"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col items-center gap-2">
            <div className={`${feature.color} group-hover:scale-110 transition-transform`}>
              {feature.icon}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export const FeatureLabels = () => {
  return (
    <div className="flex gap-3 mt-2">
      {features.map((feature) => (
        <div key={feature.label} className="w-16 flex-shrink-0 text-center">
          <span className="text-xs text-muted-foreground font-medium">
            {feature.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FeatureIcons;
