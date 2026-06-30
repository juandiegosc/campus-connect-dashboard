import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/shared/layout/AppShell'
import { RoleGuard } from '@/shared/auth/RoleGuard'
import { LoginPage } from '@/features/auth/LoginPage'
import { AttendancePage } from '@/features/attendance/AttendancePage'
import { IncidentsPage } from '@/features/incidents/IncidentsPage'
import { StudentsPage } from '@/features/students/StudentsPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: (
      <RoleGuard allow={['Docente']}>
        <AppShell />
      </RoleGuard>
    ),
    children: [
      { index: true, element: <AttendancePage /> },
      { path: 'incidentes', element: <IncidentsPage /> },
      { path: 'estudiantes', element: <StudentsPage /> },
    ],
  },
])
