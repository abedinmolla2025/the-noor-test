import { Home, BookOpen, ScrollText, Calendar, Settings } from "lucide-react";
import { useState } from "react";

interface NavItem {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { 
    id: "home",
    icon: <Home size={24} />, 
    activeIcon: <Home size={24} fill="currentColor" />,
    label: "Home" 
  },
  { 
    id: "quran",
    icon: <BookOpen size={24} />, 
    activeIcon: <BookOpen size={24} strokeWidth={2.5} />,
    label: "Quran" 
  },
  { 
    id: "hadith",
    icon: <ScrollText size={24} />, 
    activeIcon: <ScrollText size={24} strokeWidth={2.5} />,
    label: "Hadith" 
  },
  { 
    id: "calendar",
    icon: <Calendar size={24} />, 
    activeIcon: <Calendar size={24} strokeWidth={2.5} />,
    label: "Calendar" 
  },
  { 
    id: "settings",
    icon: <Settings size={24} />, 
    activeIcon: <Settings size={24} strokeWidth={2.5} />,
    label: "Settings" 
  },
];

const BottomNavigation = () => {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border shadow-lg z-50">
      <div className="max-w-lg mx-auto flex justify-around items-center py-2 px-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`bottom-nav-item ${activeTab === item.id ? "active" : ""}`}
          >
            <div className={`transition-transform ${activeTab === item.id ? "scale-110" : ""}`}>
              {activeTab === item.id ? item.activeIcon : item.icon}
            </div>
            <span className={`text-xs font-medium ${
              activeTab === item.id ? "text-primary" : "text-muted-foreground"
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      {/* Safe area for mobile devices */}
      <div className="h-safe-area-inset-bottom bg-card" />
    </nav>
  );
};

export default BottomNavigation;
