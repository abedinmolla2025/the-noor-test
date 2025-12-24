import {
  AnimatedQuranIcon,
  AnimatedDuaIcon,
  AnimatedNamesIcon,
  AnimatedQiblaIcon,
  AnimatedTasbihIcon,
  AnimatedMoonIcon,
} from "./AnimatedIcons";

interface FeatureItem {
  icon: React.ReactNode;
  label: string;
}

const features: FeatureItem[] = [
  { 
    icon: <AnimatedQuranIcon size={44} />, 
    label: "Quran"
  },
  { 
    icon: <AnimatedDuaIcon size={44} />, 
    label: "Dua"
  },
  { 
    icon: <AnimatedNamesIcon size={44} />, 
    label: "Names"
  },
  { 
    icon: <AnimatedQiblaIcon size={44} />, 
    label: "Qibla"
  },
  { 
    icon: <AnimatedTasbihIcon size={44} />, 
    label: "Tasbih"
  },
  { 
    icon: <AnimatedMoonIcon size={44} />, 
    label: "99 Names"
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
            <div className="group-hover:scale-110 transition-transform">
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
