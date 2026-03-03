import Icon from "@/components/ui/icon"
import { Page } from "@/pages/Index"

interface Props {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const navItems: { id: Page; label: string; icon: string }[] = [
  { id: "calendar", label: "Календарь", icon: "CalendarDays" },
  { id: "clients", label: "Клиенты", icon: "Users" },
  { id: "stats", label: "Статистика", icon: "BarChart3" },
]

export function AppSidebar({ currentPage, onNavigate }: Props) {
  return (
    <aside className="w-60 flex flex-col border-r border-zinc-800 bg-[#0D0D10]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-zinc-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Icon name="Orbit" size={16} className="text-white" fallback="CircleDot" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Моя Компания</div>
          <div className="text-xs text-zinc-500">Управление</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        <p className="text-xs text-zinc-600 uppercase tracking-wider px-3 py-2 font-medium">Главное меню</p>
        {navItems.map((item) => {
          const active = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                active
                  ? "bg-indigo-600/20 text-indigo-400 font-medium"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <Icon name={item.icon} size={16} fallback="Circle" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 cursor-pointer transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-semibold text-white">
            А
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-white truncate">Администратор</div>
            <div className="text-xs text-zinc-500 truncate">admin@company.ru</div>
          </div>
          <Icon name="Settings" size={14} className="text-zinc-600" fallback="Settings" />
        </div>
      </div>
    </aside>
  )
}
