import { useState } from "react"
import Icon from "@/components/ui/icon"

interface Task {
  id: string
  title: string
  assignee: string
  date: string
  priority: "high" | "medium" | "low"
  status: "todo" | "in_progress" | "done"
}

const TEAM = ["Алексей", "Мария", "Дмитрий", "Елена", "Сергей"]

const PRIORITY_COLORS = {
  high: "text-red-400 bg-red-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  low: "text-green-400 bg-green-400/10",
}

const PRIORITY_LABELS = { high: "Высокий", medium: "Средний", low: "Низкий" }

const STATUS_COLORS = {
  todo: "text-zinc-400 bg-zinc-400/10",
  in_progress: "text-indigo-400 bg-indigo-400/10",
  done: "text-green-400 bg-green-400/10",
}

const STATUS_LABELS = { todo: "К выполнению", in_progress: "В работе", done: "Готово" }

const DAYS_OF_WEEK = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const MONTHS = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]

const initialTasks: Task[] = [
  { id: "1", title: "Подготовить презентацию для клиента", assignee: "Мария", date: "2026-03-05", priority: "high", status: "todo" },
  { id: "2", title: "Ревью технического задания", assignee: "Алексей", date: "2026-03-07", priority: "medium", status: "in_progress" },
  { id: "3", title: "Обновить документацию", assignee: "Дмитрий", date: "2026-03-10", priority: "low", status: "todo" },
  { id: "4", title: "Созвон с командой", assignee: "Елена", date: "2026-03-03", priority: "medium", status: "done" },
  { id: "5", title: "Деплой новой версии", assignee: "Сергей", date: "2026-03-12", priority: "high", status: "todo" },
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

export function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: "",
    assignee: TEAM[0],
    priority: "medium" as Task["priority"],
  })

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const getDateStr = (day: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

  const tasksForDate = (day: number) => tasks.filter(t => t.date === getDateStr(day))

  const selectedTasks = selectedDate ? tasks.filter(t => t.date === selectedDate) : []

  const handleAddTask = () => {
    if (!form.title.trim() || !selectedDate) return
    const newTask: Task = {
      id: Date.now().toString(),
      title: form.title,
      assignee: form.assignee,
      date: selectedDate,
      priority: form.priority,
      status: "todo",
    }
    setTasks(prev => [...prev, newTask])
    setNotification(`Уведомление отправлено: ${form.assignee} назначен на задачу «${form.title}»`)
    setTimeout(() => setNotification(null), 4000)
    setForm({ title: "", assignee: TEAM[0], priority: "medium" })
    setShowForm(false)
  }

  const toggleStatus = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t
      const next: Record<Task["status"], Task["status"]> = { todo: "in_progress", in_progress: "done", done: "todo" }
      return { ...t, status: next[t.status] }
    }))
  }

  const cells = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  )

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`

  return (
    <div className="flex h-full">
      {/* Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-indigo-600 text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 max-w-sm">
          <Icon name="Bell" size={14} fallback="Bell" />
          {notification}
        </div>
      )}

      {/* Calendar */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Календарь задач</h1>
            <p className="text-sm text-zinc-500 mt-0.5">Выберите дату, чтобы добавить задачу</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-white">
              <Icon name="ChevronLeft" size={14} fallback="ChevronLeft" />
            </button>
            <span className="text-white font-medium w-36 text-center">{MONTHS[month]} {year}</span>
            <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors text-white">
              <Icon name="ChevronRight" size={14} fallback="ChevronRight" />
            </button>
          </div>
        </div>

        {/* Grid header */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="text-center text-xs text-zinc-500 font-medium py-2">{d}</div>
          ))}
        </div>

        {/* Grid cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />
            const dateStr = getDateStr(day)
            const dayTasks = tasksForDate(day)
            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate
            return (
              <div
                key={day}
                onClick={() => setSelectedDate(dateStr)}
                className={`min-h-[80px] p-2 rounded-lg border cursor-pointer transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-600/10"
                    : isToday
                    ? "border-indigo-500/40 bg-indigo-600/5"
                    : "border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                }`}
              >
                <div className={`text-xs font-medium mb-1 ${isToday ? "text-indigo-400" : "text-zinc-400"}`}>
                  {day}
                </div>
                <div className="space-y-0.5">
                  {dayTasks.slice(0, 2).map(t => (
                    <div key={t.id} className="text-[10px] leading-tight bg-indigo-600/20 text-indigo-300 rounded px-1 py-0.5 truncate">
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-[10px] text-zinc-500">+{dayTasks.length - 2}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sidebar panel */}
      <div className="w-80 border-l border-zinc-800 flex flex-col">
        {selectedDate ? (
          <>
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
                </div>
                <div className="text-xs text-zinc-500">{selectedTasks.length} задач</div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors"
              >
                <Icon name="Plus" size={12} fallback="Plus" />
                Добавить
              </button>
            </div>

            {showForm && (
              <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                <div className="space-y-3">
                  <input
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                    placeholder="Название задачи..."
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  />
                  <select
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    value={form.assignee}
                    onChange={e => setForm(f => ({ ...f, assignee: e.target.value }))}
                  >
                    {TEAM.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value as Task["priority"] }))}
                  >
                    <option value="high">Высокий приоритет</option>
                    <option value="medium">Средний приоритет</option>
                    <option value="low">Низкий приоритет</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={handleAddTask} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors font-medium">
                      Создать и уведомить
                    </button>
                    <button onClick={() => setShowForm(false)} className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs rounded-lg transition-colors">
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 overflow-auto p-4 space-y-3">
              {selectedTasks.length === 0 ? (
                <div className="text-center py-8 text-zinc-600 text-sm">Нет задач на этот день</div>
              ) : (
                selectedTasks.map(task => (
                  <div key={task.id} className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm text-white leading-snug">{task.title}</p>
                      <button
                        onClick={() => toggleStatus(task.id)}
                        className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[task.status]}`}
                      >
                        {STATUS_LABELS[task.status]}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Icon name="User" size={11} fallback="User" />
                        {task.assignee}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[task.priority]}`}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center mb-3">
              <Icon name="CalendarDays" size={20} className="text-zinc-500" fallback="CalendarDays" />
            </div>
            <p className="text-sm text-zinc-400 font-medium">Выберите дату</p>
            <p className="text-xs text-zinc-600 mt-1">Нажмите на день в календаре, чтобы увидеть задачи</p>
          </div>
        )}
      </div>
    </div>
  )
}
