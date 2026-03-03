import Icon from "@/components/ui/icon"

const stats = [
  { label: "Всего задач", value: "48", change: "+12%", icon: "CheckSquare", color: "indigo" },
  { label: "Выполнено", value: "31", change: "+8%", icon: "CheckCircle", color: "green" },
  { label: "В работе", value: "11", change: "+3", icon: "Clock", color: "yellow" },
  { label: "Клиентов", value: "24", change: "+2", icon: "Users", color: "purple" },
]

const ICON_COLORS: Record<string, string> = {
  indigo: "bg-indigo-600/20 text-indigo-400",
  green: "bg-green-600/20 text-green-400",
  yellow: "bg-yellow-600/20 text-yellow-400",
  purple: "bg-purple-600/20 text-purple-400",
}

const tasksByAssignee = [
  { name: "Алексей", done: 9, total: 12 },
  { name: "Мария", done: 8, total: 10 },
  { name: "Дмитрий", done: 5, total: 9 },
  { name: "Елена", done: 7, total: 8 },
  { name: "Сергей", done: 2, total: 9 },
]

const recentActivity = [
  { text: "Мария завершила задачу «Презентация для клиента»", time: "10 мин. назад", icon: "CheckCircle", color: "text-green-400" },
  { text: "Новый клиент: Светлана Иванова добавлена", time: "45 мин. назад", icon: "UserPlus", color: "text-indigo-400" },
  { text: "Алексей начал «Ревью технического задания»", time: "2 ч. назад", icon: "PlayCircle", color: "text-yellow-400" },
  { text: "Загружен файл: Договор_2026.pdf для ООО Технопром", time: "3 ч. назад", icon: "Upload", color: "text-purple-400" },
  { text: "Создана задача «Деплой новой версии» → Сергей", time: "5 ч. назад", icon: "Bell", color: "text-indigo-400" },
]

const monthData = [
  { month: "Окт", tasks: 32 },
  { month: "Ноя", tasks: 41 },
  { month: "Дек", tasks: 38 },
  { month: "Янв", tasks: 45 },
  { month: "Фев", tasks: 43 },
  { month: "Мар", tasks: 48 },
]

const maxTasks = Math.max(...monthData.map(d => d.tasks))

export function StatsPage() {
  return (
    <div className="p-6 overflow-auto h-full">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white">Статистика</h1>
          <p className="text-sm text-zinc-500 mt-0.5">Обзор активности за текущий период</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${ICON_COLORS[stat.color]}`}>
                  <Icon name={stat.icon} size={16} fallback="Circle" />
                </div>
                <span className="text-xs text-green-400 font-medium">{stat.change}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-0.5">{stat.value}</div>
              <div className="text-xs text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Bar chart */}
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <h3 className="text-sm font-medium text-white mb-4">Задачи по месяцам</h3>
            <div className="flex items-end gap-3 h-32">
              {monthData.map(d => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-zinc-500">{d.tasks}</span>
                  <div
                    className="w-full rounded-t-md bg-indigo-600/70 hover:bg-indigo-500 transition-colors"
                    style={{ height: `${(d.tasks / maxTasks) * 100}%` }}
                  />
                  <span className="text-[10px] text-zinc-600">{d.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team progress */}
          <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
            <h3 className="text-sm font-medium text-white mb-4">Выполнение по сотрудникам</h3>
            <div className="space-y-3">
              {tasksByAssignee.map(person => {
                const pct = Math.round((person.done / person.total) * 100)
                return (
                  <div key={person.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-zinc-300">{person.name}</span>
                      <span className="text-xs text-zinc-500">{person.done}/{person.total} · {pct}%</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <h3 className="text-sm font-medium text-white mb-4">Последние события</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 ${item.color}`}>
                  <Icon name={item.icon} size={14} fallback="Circle" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-zinc-300 leading-snug">{item.text}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
