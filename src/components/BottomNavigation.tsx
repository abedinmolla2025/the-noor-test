import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface NavItem {
  icon: string;
  label: string;
  labelBn: string;
  id: string;
  path: string;
}

const navItems: NavItem[] = [
  { 
    id: "home",
    icon: "🏠",
    label: "Home",
    labelBn: "হোম",
    path: "/"
  },
  { 
    id: "quran",
    icon: "📖",
    label: "Quran",
    labelBn: "কুরআন",
    path: "/quran"
  },
  { 
    id: "hadith",
    icon: "📜",
    label: "Hadith",
    labelBn: "হাদিস",
    path: "/bukhari"
  },
  { 
    id: "calendar",
    icon: "🗓️",
    label: "Calendar",
    labelBn: "ক্যালেন্ডার",
    path: "/calendar"
  },
  { 
    id: "settings",
    icon: "⚙️",
    label: "Settings",
    labelBn: "সেটিংস",
    path: "/settings"
  },
];

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-gradient-to-t from-background via-background/95 to-background/90 dark:from-card dark:via-card/95 dark:to-card/90 backdrop-blur-xl shadow-[0_-6px_18px_rgba(15,118,110,0.15)] dark:shadow-[0_-8px_24px_rgba(15,118,110,0.35)]">
      <div className="w-full max-w-lg mx-auto pt-2 px-2 sm:px-4 flex flex-col gap-1">
        <p className="text-[10px] text-center text-muted-foreground/80 mb-1">
          Developed by <span className="font-semibold text-primary">ABEDIN MOLLA</span> – India
        </p>
        <div className="flex justify-around items-center py-1.5">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.9 }}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 hover:bg-muted/60 dark:hover:bg-muted/40 ${
                isActive(item.path)
                  ? "text-primary shadow-soft bg-background/70 dark:bg-card/80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {/* Active indicator */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-primary to-accent rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <motion.div
                className={`text-xl sm:text-2xl transition-transform ${
                  isActive(item.path) ? "scale-110" : ""
                }`}
                animate={isActive(item.path) ? { y: [0, -2, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                {item.icon}
              </motion.div>
              <span
                className={`text-[10px] sm:text-xs font-medium ${
                  isActive(item.path) ? "text-primary font-semibold" : ""
                }`}
              >
                {item.labelBn}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
      {/* Safe area for mobile devices */}
      <div className="pb-[env(safe-area-inset-bottom)]" />
    </nav>
  );
};

export default BottomNavigation;