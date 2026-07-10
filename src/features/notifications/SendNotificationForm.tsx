import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useSendNotification } from '@/features/notifications/useNotifications'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Field } from '@/shared/ui/Field'
import { controlClass, textareaClass } from '@/shared/ui/styles'
import { useToast } from '@/shared/ui/useToast'
import { VALID_CHANNELS } from '@/types/api'

// El backend acepta cualquier canal y marca Failed los que no reconoce. Ofrecer 'Telegram'
// explícitamente rotulado convierte la ruta de falla en algo demostrable en un clic.
const INVALID_CHANNEL = 'Telegram'

const schema = z.object({
  recipient: z.string().trim().min(1, 'Ingresa un destinatario.'),
  channel: z.string().min(1, 'Elige un canal.'),
  subject: z.string().trim().min(1, 'Ingresa un asunto.'),
  body: z.string().trim().min(1, 'Escribe el mensaje.'),
})

type FormValues = z.infer<typeof schema>

export function SendNotificationForm() {
  const { notify } = useToast()
  const send = useSendNotification()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { recipient: '', channel: 'Email', subject: '', body: '' },
  })

  const channel = watch('channel')

  const onSubmit = async (values: FormValues) => {
    try {
      await send.mutateAsync(values)
      // 202 Accepted: el comando quedó en la cola, nadie lo ha procesado todavía.
      // Decir "Enviado" aquí sería mentir.
      notify('success', 'Se encoló el envío. Aparecerá en la lista en unos segundos.')
      reset({ recipient: '', channel: 'Email', subject: '', body: '' })
    } catch {
      notify('error', 'No se pudo encolar el envío. Revisa que Notifications esté arriba.')
    }
  }

  return (
    <Card className="p-6">
      <h2 className="font-display text-2xl text-ink">Enviar notificación</h2>
      <div className="mt-2.5 mb-4 h-[3px] w-12 rounded-full bg-oro" />
      <p className="mb-6 text-base text-muted">
        El comando va a una cola con un único consumidor — es el patrón Point-to-Point, a diferencia
        del fan-out de los eventos.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field label="Destinatario" error={errors.recipient?.message}>
          <input
            {...register('recipient')}
            className={controlClass}
            placeholder="acudiente@campusconnect.edu"
          />
        </Field>

        <Field label="Canal" error={errors.channel?.message}>
          <select {...register('channel')} className={controlClass}>
            {VALID_CHANNELS.map((valid) => (
              <option key={valid} value={valid}>
                {valid}
              </option>
            ))}
            <option value={INVALID_CHANNEL}>{INVALID_CHANNEL} — canal inválido</option>
          </select>
        </Field>

        {channel === INVALID_CHANNEL && (
          <p className="rounded-xl bg-late-bg px-4 py-3 text-sm text-late-ink">
            Notifications registrará esta notificación como <strong>Failed</strong> y publicará{' '}
            <strong>NotificationFailed</strong>. Analytics sumará un mensaje fallido y el estado del
            ecosistema pasará a degradado.
          </p>
        )}

        <Field label="Asunto" error={errors.subject?.message}>
          <input {...register('subject')} className={controlClass} placeholder="Recordatorio" />
        </Field>

        <Field label="Mensaje" error={errors.body?.message}>
          <textarea
            {...register('body')}
            rows={4}
            className={textareaClass}
            placeholder="Reunión de padres el viernes."
          />
        </Field>

        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Encolando…' : 'Encolar envío'}
        </Button>
      </form>
    </Card>
  )
}
