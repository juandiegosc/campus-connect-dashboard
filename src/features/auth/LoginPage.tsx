import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/auth/useAuth'
import { Button } from '@/shared/ui/Button'
import { Field } from '@/shared/ui/Field'
import { controlClass } from '@/shared/ui/styles'
import { ApiError } from '@/shared/api/httpClient'

const schema = z.object({
  username: z.string().min(1, 'Ingresá tu usuario.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async (values: FormValues) => {
    setError(null)
    try {
      await login(values.username, values.password)
      const from = (location.state as { from?: string } | null)?.from ?? '/'
      navigate(from, { replace: true })
    } catch (e) {
      setError(
        e instanceof ApiError && e.status === 401
          ? 'Usuario o contraseña incorrectos.'
          : 'No se pudo iniciar sesión. Revisá que el Gateway esté arriba.',
      )
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-panel px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-vino">
            <i className="ti ti-school text-xl text-oro-soft" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-lg text-ink">CampusConnect 360</p>
            <p className="text-sm text-muted">Portal Docente / Bienestar</p>
          </div>
        </div>

        <div className="rounded-xl border border-line bg-white p-6">
          <h1 className="font-display text-xl text-ink">Iniciar sesión</h1>
          <div className="mt-2 mb-5 h-[3px] w-10 bg-oro" />

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Field label="Usuario" error={errors.username?.message}>
              <input
                {...register('username')}
                className={controlClass}
                placeholder="docente1"
                autoComplete="username"
              />
            </Field>
            <Field label="Contraseña" error={errors.password?.message}>
              <input
                {...register('password')}
                type="password"
                className={controlClass}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>

            {error && (
              <p className="rounded-lg bg-absent-bg px-3 py-2 text-sm text-absent-ink">{error}</p>
            )}

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Ingresando…' : 'Ingresar'}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-muted">
          Usuario de prueba: docente1 / Admin1234!
        </p>
      </div>
    </div>
  )
}
