// Contratos del backend CampusConnect 360 (serialización camelCase de System.Text.Json).
// Verificados contra el backend vivo — no inventar campos.
//
// Ojo: docs/02-contratos-api-eventos.md describe un contrato PLANIFICADO que nunca se implementó
// (totalEnrolledStudents, ecosystemStatus, respuestas envueltas en { items }). El contrato real es
// el de docs/NOTIFICATIONS-ANALYTICS.md, y las listas vienen como arrays planos.

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

// ── Analytics ─────────────────────────────────────────────────────────────

// `status` deriva solo de failedMessages: mide la salud de la MENSAJERÍA, no la disponibilidad
// de los servicios. Devolvería 'ok' con Payments caído. Los /health públicos miden el otro eje.
export type EcosystemStatus = 'ok' | 'degraded'

export interface DashboardDto {
  totalStudents: number
  paymentsConfirmed: number
  paymentsPending: number
  attendanceRecorded: number
  incidentsReported: number
  notificationsSent: number
  eventsProcessed: number
  failedMessages: number
  status: EcosystemStatus
  generatedAt: string
}

export interface EventLogDto {
  eventType: string
  entityId: string
  // Null en todos los eventos publicados por servicios de negocio (StudentEnrolled,
  // PaymentConfirmed, AttendanceRecorded, IncidentReported). Solo Notifications y Academic
  // lo propagan. La trazabilidad por cadena que promete el contrato no está completa.
  correlationId: string | null
  occurredAt: string
  receivedAt: string
}

// ── Notifications ─────────────────────────────────────────────────────────

export type NotificationStatus = 'Sent' | 'Failed'

// Canales que el backend acepta como válidos. Cualquier otro valor se persiste igual,
// con status 'Failed' — por eso NotificationDto.channel es string, no esta unión.
export const VALID_CHANNELS = ['Email', 'Sms', 'Push'] as const
export type NotificationChannel = (typeof VALID_CHANNELS)[number]

export interface NotificationDto {
  notificationId: string
  sourceEvent: string
  studentId: string | null
  channel: string
  recipient: string
  subject: string
  body: string
  status: NotificationStatus
  failureReason: string | null
  createdAt: string
}

export interface SendNotificationRequest {
  recipient: string
  channel: string
  subject: string
  body: string
}
