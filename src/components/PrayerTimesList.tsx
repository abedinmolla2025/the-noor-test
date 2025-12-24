import { Moon, Sun, Sunrise, Sunset, Clock } from "lucide-react";

interface PrayerTime {
  name: string;
  time: string;
  icon: React.ReactNode;
}

const prayerTimes: PrayerTime[] = [
  { name: "Fajr", time: "04:54 AM", icon: <Moon size={20} className="text-indigo-500" /> },
  { name: "Sunrise", time: "06:14 AM", icon: <Sunrise size={20} className="text-amber-500" /> },
  { name: "Dhuhr", time: "12:30 PM", icon: <Sun size={20} className="text-yellow-500" /> },
  { name: "Asr", time: "03:24 PM", icon: <Sun size={20} className="text-orange-500" /> },
  { name: "Maghrib", time: "06:45 PM", icon: <Sunset size={20} className="text-rose-500" /> },
  { name: "Isha", time: "08:15 PM", icon: <Moon size={20} className="text-purple-500" /> },
];

const PrayerTimesList = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  // Determine current prayer for highlighting
  const getCurrentPrayerIndex = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const times = [
      4 * 60 + 54,   // Fajr
      6 * 60 + 14,   // Sunrise
      12 * 60 + 30,  // Dhuhr
      15 * 60 + 24,  // Asr
      18 * 60 + 45,  // Maghrib
      20 * 60 + 15,  // Isha
    ];

    for (let i = times.length - 1; i >= 0; i--) {
      if (currentMinutes >= times[i]) {
        return i;
      }
    }
    return 5; // Isha from previous day
  };

  const currentIndex = getCurrentPrayerIndex();

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Today's Prayer Times</h3>
        <span className="text-sm text-muted-foreground">{today}</span>
      </div>

      <div className="space-y-1">
        {prayerTimes.map((prayer, index) => (
          <div
            key={prayer.name}
            className={`prayer-time-row ${
              index === currentIndex 
                ? "bg-secondary/50 -mx-2 px-2 rounded-xl" 
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                {prayer.icon}
              </div>
              <span className={`font-medium ${
                index === currentIndex ? "text-primary" : "text-card-foreground"
              }`}>
                {prayer.name}
              </span>
            </div>
            <span className={`font-semibold ${
              index === currentIndex ? "text-primary" : "text-card-foreground"
            }`}>
              {prayer.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimesList;
