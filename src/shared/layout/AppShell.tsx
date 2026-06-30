import { Outlet } from 'react-router-dom'
import { TopBar } from '@/shared/layout/TopBar'
import { NavTabs } from '@/shared/layout/NavTabs'

export function AppShell() {
  return (
    <div className="min-h-screen bg-panel">
      <TopBar />
      <NavTabs />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
