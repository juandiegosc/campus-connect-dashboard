import type { EcosystemStatus } from '@/types/api'

export interface VerdictInput {
  /** Salud de la MENSAJERÍA: `degraded` en cuanto hay un mensaje fallido. */
  status: EcosystemStatus
  failedMessages: number
  /** Salud de la DISPONIBILIDAD: servicios que responden a /health. */
  servicesOnline: number
  servicesTotal: number
}

/**
 * El veredicto se escribe en prosa, no en un badge. Un director necesita saber qué pasa y
 * dónde, no interpretar un punto verde.
 *
 * Los dos ejes son independientes: `status` puede ser 'ok' con un servicio caído, porque solo
 * cuenta mensajes fallidos. La frase los nombra por separado a propósito.
 */
export function ecosystemVerdict({
  status,
  failedMessages,
  servicesOnline,
  servicesTotal,
}: VerdictInput): string {
  const allOnline = servicesOnline === servicesTotal
  const messages = failedMessages === 1 ? '1 mensaje fallido' : `${failedMessages} mensajes fallidos`

  const availability = allOnline
    ? `Los ${servicesTotal} servicios responden.`
    : `Solo ${servicesOnline} de ${servicesTotal} servicios responden.`

  if (status === 'degraded') {
    return `La mensajería opera degradada: ${messages}. ${availability}`
  }

  return allOnline
    ? `El ecosistema opera con normalidad. Los ${servicesTotal} servicios responden y la mensajería no reporta fallos.`
    : `La mensajería no reporta fallos, pero la disponibilidad está comprometida. ${availability}`
}
