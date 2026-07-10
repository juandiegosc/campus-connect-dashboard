import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/shared/layout/AppShell'
import { RoleGuard } from '@/shared/auth/RoleGuard'
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { EventsPage } from '@/features/events/EventsPage'
import { NotificationsPage } from '@/features/notifications/NotificationsPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: (
      <RoleGuard allow={['Direccion']}>
        <AppShell />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'eventos', element: <EventsPage /> },
      { path: 'notificaciones', element: <NotificationsPage /> },
    ],
  },
])
