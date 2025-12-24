import { Moon, Sun, Sunrise, Sunset, Loader2 } from "lucide-react";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";

interface PrayerTime {
  name: string;
  time: string;
  icon: React.ReactNode;
}

const PrayerTimesList = () => {
  const { prayerTimes, isLoading } = usePrayerTimes();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const formatTo12Hour = (time24: string): string => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    return `${hours12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const prayerTimesList: PrayerTime[] = prayerTimes
    ? [
        { name: "Fajr", time: formatTo12Hour(prayerTimes.Fajr), icon: <Moon size={20} className="text-indigo-500" /> },
        { name: "Sunrise", time: formatTo12Hour(prayerTimes.Sunrise), icon: <Sunrise size={20} className="text-amber-500" /> },
        { name: "Dhuhr", time: formatTo12Hour(prayerTimes.Dhuhr), icon: <Sun size={20} className="text-yellow-500" /> },
        { name: "Asr", time: formatTo12Hour(prayerTimes.Asr), icon: <Sun size={20} className="text-orange-500" /> },
        { name: "Maghrib", time: formatTo12Hour(prayerTimes.Maghrib), icon: <Sunset size={20} className="text-rose-500" /> },
        { name: "Isha", time: formatTo12Hour(prayerTimes.Isha), icon: <Moon size={20} className="text-purple-500" /> },
      ]
    : [
        { name: "Fajr", time: "05:00 AM", icon: <Moon size={20} className="text-indigo-500" /> },
        { name: "Sunrise", time: "06:15 AM", icon: <Sunrise size={20} className="text-amber-500" /> },
        { name: "Dhuhr", time: "12:30 PM", icon: <Sun size={20} className="text-yellow-500" /> },
        { name: "Asr", time: "03:30 PM", icon: <Sun size={20} className="text-orange-500" /> },
        { name: "Maghrib", time: "06:00 PM", icon: <Sunset size={20} className="text-rose-500" /> },
        { name: "Isha", time: "07:30 PM", icon: <Moon size={20} className="text-purple-500" /> },
      ];

  // Determine current prayer for highlighting
  const getCurrentPrayerIndex = () => {
    if (!prayerTimes) return -1;
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const times = [
      prayerTimes.Fajr,
      prayerTimes.Sunrise,
      prayerTimes.Dhuhr,
      prayerTimes.Asr,
      prayerTimes.Maghrib,
      prayerTimes.Isha,
    ].map((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    });

    for (let i = times.length - 1; i >= 0; i--) {
      if (currentMinutes >= times[i]) {
        return i;
      }
    }
    return 5; // Isha from previous day
  };

  const currentIndex = getCurrentPrayerIndex();

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-5 shadow-soft">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading prayer times...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Today's Prayer Times</h3>
        <span className="text-sm text-muted-foreground">{today}</span>
      </div>

      <div className="space-y-1">
        {prayerTimesList.map((prayer, index) => (
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
              <span
                className={`font-medium ${
                  index === currentIndex ? "text-primary" : "text-card-foreground"
                }`}
              >
                {prayer.name}
              </span>
            </div>
            <span
              className={`font-semibold ${
                index === currentIndex ? "text-primary" : "text-card-foreground"
              }`}
            >
              {prayer.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerTimesList;
