import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', label: 'Asistencia', end: true },
  { to: '/incidentes', label: 'Incidentes', end: false },
  { to: '/estudiantes', label: 'Estudiantes', end: false },
]

export function NavTabs() {
  return (
    <nav className="flex gap-6 border-b border-line bg-white px-4">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `border-b-2 py-3 text-sm ${
              isActive
                ? 'border-oro font-medium text-vino'
                : 'border-transparent text-muted hover:text-ink'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
