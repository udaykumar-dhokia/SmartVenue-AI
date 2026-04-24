import { Users, Clock, ShieldAlert, Zap } from "lucide-react";

const stats = [
  {
    label: "Avg. Wait Time",
    value: "4.2m",
    change: "-12%",
    trend: "down",
    icon: Clock,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Crowd Safety Score",
    value: "98/100",
    change: "+2",
    trend: "up",
    icon: ShieldAlert,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Flow Optimization",
    value: "94%",
    change: "+5%",
    trend: "up",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <div className={`rounded-xl ${stat.bg} p-2.5 ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              stat.trend === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            }`}>
              {stat.change}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
            <p className="text-2xl font-bold tracking-tight text-white">{stat.value}</p>
          </div>
          <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all group-hover:w-full" />
        </div>
      ))}
    </div>
  );
}
