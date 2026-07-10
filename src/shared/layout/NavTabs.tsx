import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Informe', icon: 'ti-report-analytics', end: true },
  { to: '/eventos', label: 'Bitácora', icon: 'ti-timeline-event', end: false },
  { to: '/notificaciones', label: 'Notificaciones', icon: 'ti-bell', end: false },
]

export function NavTabs() {
  return (
    <nav className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-6xl gap-8 px-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex items-center gap-2 border-b-[3px] py-4 text-base transition-colors ${
                isActive
                  ? 'border-oro font-medium text-azul'
                  : 'border-transparent text-muted hover:text-ink'
              }`
            }
          >
            <i className={`ti ${tab.icon} text-lg`} aria-hidden="true" />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
