import { useState } from "react"
import Icon from "@/components/ui/icon"

interface Client {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: "active" | "inactive" | "new"
  files: { name: string; size: string; date: string }[]
  notes: string
}

const STATUS_LABELS = { active: "Активен", inactive: "Неактивен", new: "Новый" }
const STATUS_COLORS = {
  active: "text-green-400 bg-green-400/10",
  inactive: "text-zinc-400 bg-zinc-400/10",
  new: "text-indigo-400 bg-indigo-400/10",
}

const initialClients: Client[] = [
  {
    id: "1", name: "Андрей Козлов", company: "ООО Технопром", email: "kozlov@technoprom.ru",
    phone: "+7 (916) 123-45-67", status: "active", notes: "Крупный клиент, предпочитает связь по email",
    files: [
      { name: "Договор_2026.pdf", size: "1.2 МБ", date: "01.03.2026" },
      { name: "КП_Технопром.docx", size: "450 КБ", date: "15.02.2026" },
    ],
  },
  {
    id: "2", name: "Светлана Иванова", company: "ИП Иванова С.А.", email: "ivanova@mail.ru",
    phone: "+7 (926) 987-65-43", status: "new", notes: "Первичный контакт, ждёт презентацию",
    files: [],
  },
  {
    id: "3", name: "Роман Петров", company: "Строй Плюс", email: "r.petrov@stroyplus.com",
    phone: "+7 (903) 555-12-34", status: "inactive", notes: "Контракт истёк в феврале",
    files: [{ name: "Акт_выполненных_работ.pdf", size: "890 КБ", date: "28.02.2026" }],
  },
]

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [selected, setSelected] = useState<Client | null>(clients[0])
  const [search, setSearch] = useState("")
  const [showAddClient, setShowAddClient] = useState(false)
  const [newClient, setNewClient] = useState({ name: "", company: "", email: "", phone: "" })

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  )

  const handleAddClient = () => {
    if (!newClient.name.trim()) return
    const c: Client = {
      id: Date.now().toString(),
      ...newClient,
      status: "new",
      files: [],
      notes: "",
    }
    setClients(prev => [c, ...prev])
    setSelected(c)
    setShowAddClient(false)
    setNewClient({ name: "", company: "", email: "", phone: "" })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selected || !e.target.files?.length) return
    const file = e.target.files[0]
    const sizeKb = Math.round(file.size / 1024)
    const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} МБ` : `${sizeKb} КБ`
    const today = new Date().toLocaleDateString("ru-RU")
    const newFile = { name: file.name, size: sizeStr, date: today }
    setClients(prev => prev.map(c =>
      c.id === selected.id ? { ...c, files: [...c.files, newFile] } : c
    ))
    setSelected(prev => prev ? { ...prev, files: [...prev.files, newFile] } : prev)
  }

  const handleNoteChange = (note: string) => {
    if (!selected) return
    setClients(prev => prev.map(c => c.id === selected.id ? { ...c, notes: note } : c))
    setSelected(prev => prev ? { ...prev, notes: note } : prev)
  }

  return (
    <div className="flex h-full">
      {/* List */}
      <div className="w-72 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-semibold text-white">Клиенты</h1>
            <button
              onClick={() => setShowAddClient(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors"
            >
              <Icon name="Plus" size={12} fallback="Plus" />
              Добавить
            </button>
          </div>
          <div className="relative">
            <Icon name="Search" size={13} className="absolute left-2.5 top-2.5 text-zinc-500" fallback="Search" />
            <input
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
              placeholder="Поиск клиентов..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {showAddClient && (
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 space-y-2">
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500" placeholder="Имя и фамилия*" value={newClient.name} onChange={e => setNewClient(p => ({ ...p, name: e.target.value }))} />
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500" placeholder="Компания" value={newClient.company} onChange={e => setNewClient(p => ({ ...p, company: e.target.value }))} />
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500" placeholder="Email" value={newClient.email} onChange={e => setNewClient(p => ({ ...p, email: e.target.value }))} />
            <input className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500" placeholder="Телефон" value={newClient.phone} onChange={e => setNewClient(p => ({ ...p, phone: e.target.value }))} />
            <div className="flex gap-2">
              <button onClick={handleAddClient} className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors">Создать</button>
              <button onClick={() => setShowAddClient(false)} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs rounded-lg transition-colors">Отмена</button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {filtered.map(client => (
            <button
              key={client.id}
              onClick={() => setSelected(client)}
              className={`w-full text-left px-4 py-3 border-b border-zinc-800/50 hover:bg-zinc-900 transition-colors ${selected?.id === client.id ? "bg-zinc-900 border-l-2 border-l-indigo-500" : ""}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white truncate">{client.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${STATUS_COLORS[client.status]}`}>{STATUS_LABELS[client.status]}</span>
              </div>
              <div className="text-xs text-zinc-500 truncate">{client.company}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected ? (
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {selected.name[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                    <p className="text-sm text-zinc-400">{selected.company}</p>
                  </div>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[selected.status]}`}>
                {STATUS_LABELS[selected.status]}
              </span>
            </div>

            {/* Contacts */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                  <Icon name="Mail" size={12} fallback="Mail" /> Email
                </div>
                <p className="text-sm text-white">{selected.email || "—"}</p>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                  <Icon name="Phone" size={12} fallback="Phone" /> Телефон
                </div>
                <p className="text-sm text-white">{selected.phone || "—"}</p>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">Заметки</label>
              <textarea
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none"
                rows={3}
                placeholder="Добавьте заметку о клиенте..."
                value={selected.notes}
                onChange={e => handleNoteChange(e.target.value)}
              />
            </div>

            {/* Files */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-white">Материалы и документы</h3>
                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors cursor-pointer">
                  <Icon name="Upload" size={12} fallback="Upload" />
                  Загрузить файл
                  <input type="file" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
              {selected.files.length === 0 ? (
                <div className="border-2 border-dashed border-zinc-800 rounded-xl p-8 text-center">
                  <Icon name="FileUp" size={24} className="text-zinc-600 mx-auto mb-2" fallback="File" />
                  <p className="text-sm text-zinc-600">Нет загруженных файлов</p>
                  <p className="text-xs text-zinc-700 mt-1">Нажмите «Загрузить файл» выше</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {selected.files.map((file, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                        <Icon name="FileText" size={14} className="text-indigo-400" fallback="File" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{file.name}</p>
                        <p className="text-xs text-zinc-500">{file.size} · {file.date}</p>
                      </div>
                      <button className="text-zinc-600 hover:text-white transition-colors">
                        <Icon name="Download" size={14} fallback="Download" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
          Выберите клиента
        </div>
      )}
    </div>
  )
}
