import { Home, Grid3X3, Search, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/rubriken", icon: Grid3X3, label: "Rubriken" },
  { path: "/suche", icon: Search, label: "Suche" },
  { path: "/profil", icon: User, label: "Profil" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fiume-bottom-bar">
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="fiume-touch-target flex-col gap-0.5 transition-colors relative"
            >
              <tab.icon
                size={22}
                strokeWidth={active ? 2.5 : 1.5}
                className={active ? "text-accent" : "text-muted-foreground"}
              />
              <span className={`text-[10px] font-medium ${active ? "text-accent" : "text-muted-foreground"}`}>
                {tab.label}
              </span>
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-accent"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
