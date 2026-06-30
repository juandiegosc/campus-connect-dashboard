import { useAuth } from '@/shared/auth/useAuth'
import { useHealth } from '@/shared/api/useHealth'
import { initials } from '@/shared/lib/format'

export function TopBar() {
  const { user, logout } = useAuth()
  const online = useHealth()

  return (
    <header className="flex flex-wrap items-center justify-between gap-2 bg-vino px-4 py-3 text-white">
      <div className="flex items-center gap-3">
        <i className="ti ti-school text-xl text-oro-soft" aria-hidden="true" />
        <span className="font-display text-base">CampusConnect 360</span>
        <span className="h-4 w-px bg-white/30" aria-hidden="true" />
        <span className="text-sm text-white/85">Portal Docente / Bienestar</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-xs text-white/85">
          <span
            className={`h-2 w-2 rounded-full ${online ? 'bg-[#67d6a2]' : 'bg-white/40'}`}
            aria-hidden="true"
          />
          {online ? 'En línea' : 'Sin conexión'}
        </span>

        <div className="flex items-center gap-2 text-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[11px]">
            {user ? initials(user.fullName) : '?'}
          </span>
          <span className="hidden sm:inline">{user?.fullName}</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-white/85 hover:bg-white/10"
        >
          <i className="ti ti-logout" aria-hidden="true" />
          Salir
        </button>
      </div>
    </header>
  )
}
