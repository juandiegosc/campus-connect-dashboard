// Contratos del backend CampusConnect 360 (serialización camelCase de System.Text.Json).
// Estos tipos reflejan los DTO reales de Identity y Attendance — no inventar campos.

export type UserRole = 'Secretaria' | 'Finanzas' | 'Docente' | 'Direccion'

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  expiresAt: string
  role: UserRole
  fullName: string
}

export interface CurrentUser {
  userId: string
  username: string
  fullName: string
  role: UserRole
}

export interface StudentReplica {
  studentId: string
  fullName: string
  grade: string
  schoolId: string
  lastUpdatedAt: string
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late'

export interface AttendanceRecordDto {
  recordId: string
  studentId: string
  date: string
  status: AttendanceStatus
}

export type IncidentSeverity = 'Low' | 'Medium' | 'High'

export interface IncidentSummary {
  incidentId: string
  studentId: string
  type: string
  severity: IncidentSeverity
}

export interface StudentHistory {
  attendance: AttendanceRecordDto[]
  incidents: IncidentSummary[]
}

export interface RecordAttendanceResponse {
  recordId: string
  status: string
}

export interface ReportIncidentResponse {
  incidentId: string
  severity: string
}
