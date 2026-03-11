import { Home, Grid3X3, Search, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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
      <div className="flex justify-around items-center h-14">
        {tabs.map((tab) => {
          const active = tab.path === "/" ? location.pathname === "/" : location.pathname.startsWith(tab.path);
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`fiume-touch-target flex-col gap-0.5 transition-colors ${
                active ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <tab.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
