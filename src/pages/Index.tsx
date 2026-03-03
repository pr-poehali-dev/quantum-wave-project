import { useState } from "react"
import { AppSidebar } from "@/components/AppSidebar"
import { CalendarPage } from "@/components/CalendarPage"
import { ClientsPage } from "@/components/ClientsPage"
import { StatsPage } from "@/components/StatsPage"

export type Page = "calendar" | "clients" | "stats"

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>("calendar")

  return (
    <div className="flex h-screen bg-[#09090B] text-white overflow-hidden">
      <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {currentPage === "calendar" && <CalendarPage />}
        {currentPage === "clients" && <ClientsPage />}
        {currentPage === "stats" && <StatsPage />}
      </main>
    </div>
  )
}

export default Index
