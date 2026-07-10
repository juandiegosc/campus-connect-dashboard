# CampusConnect 360 — Frontend (Dashboard Directivo)

Contexto para quien clone este repo. Léelo antes de escribir código.

## Qué es este repo

Frontend del **Dashboard Directivo** (rol `Direccion`). Es un repositorio **separado del backend**
(el backend es .NET y vive en otro repo). Nació como fork del Portal Docente y hereda de él la
**identidad visual y la base reutilizable** (`src/shared/`). No reinventes el estilo: impórtalo.

Hay 4 portales, uno por rol:
| Portal | Rol JWT | Usuario de prueba |
|---|---|---|
| Dashboard Directivo (este) | `Direccion` | director1 / Admin1234! |
| Docente / Bienestar | `Docente` | docente1 / Admin1234! |
| Académico / Secretaría | `Secretaria` | secretaria1 / Admin1234! |
| Financiero / Pagos | `Finanzas` | finanzas1 / Admin1234! |

Este portal no escribe datos de negocio: es la **vista consolidada** del ecosistema. Su única
escritura es encolar una notificación ad-hoc (patrón Point-to-Point).

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 (tokens propios) · TanStack Query (estado de
servidor) · React Hook Form + Zod (formularios) · React Router 7 · motion (animaciones).
**Sin librería de gráficos**: los tres gráficos son SVG propio en `src/shared/ui/chart/`.

## Cómo correr

1. Backend arriba (docker compose, desde el repo backend). Este portal lee de **todos** los
   servicios, así que necesita el ecosistema completo:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.local.yml --profile services up -d --build
   ```
   `--profile services` es obligatorio: sin él no se levanta el Gateway.
2. Frontend:
   ```bash
   npm install
   cp .env.example .env   # VITE_GATEWAY_URL: 8080 (docker) o 5287 (dotnet run)
   npm run dev            # http://localhost:5173
   ```

Scripts: `npm run dev` · `npm run build` · `npm run preview` · `npm run lint` (oxlint).

## Integración con el backend (CRÍTICO)

- El frontend habla **SIEMPRE con el API Gateway**, nunca con los microservicios directo.
- **El backend NO tiene CORS.** Se resuelve con el **proxy del dev server** (`vite.config.ts`
  reenvía `/api` → Gateway). No se modifica el backend.
- Toda request lleva `Authorization: Bearer` (si hay sesión) y `X-Correlation-Id`. Ante 401, el
  cliente intenta refresh una vez (ver `src/shared/api/httpClient.ts`).
- Las rutas `/api/{servicio}/health` son **públicas** (sin Bearer).

### La documentación de `docs/` se contradice — cuál manda

`docs/02-contratos-api-eventos.md` describe un contrato **planificado que nunca se implementó**.
`docs/PROGRESS.md` está desactualizado (marca Analytics y Notifications como stubs; no lo son).

Manda **`docs/NOTIFICATIONS-ANALYTICS.md`**, verificado contra el backend vivo:

| 02-contratos dice | El backend hace |
|---|---|
| `totalEnrolledStudents`, `confirmedPayments`, `ecosystemStatus`, `lastUpdatedAt` | `totalStudents`, `paymentsConfirmed`, `status`, `generatedAt` |
| Listas envueltas en `{ items: [...] }` | **Arrays planos** |
| `correlationId` siempre presente | **`null`** en los eventos de negocio |

**Antes de tipar un endpoint nuevo, haz `curl` contra el Gateway.** No confíes en `02-contratos`.

## Arquitectura del código

```
src/
├─ app/        router + providers (QueryClient, Auth, Toast, MotionConfig)
├─ shared/     ◄── BASE REUTILIZABLE — no la dupliques, impórtala
│  ├─ ui/      Button, Field, Card, Badge, Spinner, EmptyState, PageHeader,
│  │           Reveal, Figure, SectionRule, StatusMark, DataTable, toast/useToast
│  │  └─ chart/  ChartTooltip, ProportionBar, BarList, Sparkline (SVG, sin dependencias)
│  ├─ layout/  AppShell, TopBar (barra azul), NavTabs (regla dorada)
│  ├─ api/     httpClient (Bearer + X-Correlation-Id + refresh) · useEcosystemHealth
│  ├─ auth/    AuthContext, useAuth, RoleGuard, authStorage
│  ├─ lib/     format (initials, formatNumber, formatDateTime, formatLag, …)
│  └─ styles/  tokens.css (variables UDLA)
├─ features/
│  ├─ auth/          LoginPage
│  ├─ dashboard/     DashboardPage · useDashboard · deriveEventStats · verdict · EcosystemColophon
│  ├─ events/        EventsPage · useEvents
│  └─ notifications/ NotificationsPage · SendNotificationForm · useNotifications
└─ types/      contratos del backend (DTOs)
```

Alias de import: `@/` → `src/` (ej. `import { Button } from '@/shared/ui/Button'`).

`deriveEventStats.ts` y `verdict.ts` son **módulos puros, sin React**. Toda la lógica no trivial
vive ahí a propósito: son los únicos que merecen tests si algún día se agrega un runner.

## Identidad visual

Las tipografías, la regla dorada y el oro son **compartidos con los otros portales — no los
cambies**. Dos cosas sí divergen a propósito: el **primario** y la **retórica del layout**.

> **El primario de este portal es azul académico, no vino.** Los otros tres portales (Docente,
> Secretaría, Finanzas) siguen en `#7A1B2E`. Fue una decisión explícita de Dirección: el portal
> directivo se distingue del resto. Si portas componentes de `shared/` a otro portal, el token
> `azul` no existirá allí.

- **Paleta** (`tokens.css`): `azul` `#1B365D` (primario), `azul-dark` `#0E1F38`, `azul-soft`
  `#E3E8F1`, `oro` `#B0892F` (acento), `ink`, `muted`, `line`, `panel`, y estados
  `present`/`absent`/`late`.
- **Tipografías**: `font-display` (Spectral, serif) para títulos, marca y **cifras**;
  `font-sans` (Inter) para todo lo operativo. Cargadas en `index.html`.
- **Elemento firma**: la **regla dorada** — bajo cada título (`<PageHeader />`), como separador de
  sección (`<SectionRule />`) y cerrando el colofón de estado.
- **Escala**: base 18px. Tamaños en `rem`.
- **Movimiento**: `<Reveal>` escalonado en la entrada de secciones, un pulso corto en el colofón
  cada 15 s, y nada más. `MotionConfig reducedMotion="user"` respeta accesibilidad.
- **Idioma**: UI en español, sentence case, copy claro y orientado a la acción.

### Dirección propia de este portal: informe impreso

- En el informe (`/`) **no hay tarjetas**. La estructura la dan reglas doradas hairline y el
  espacio en blanco. `Card` sí se usa en Bitácora y Notificaciones.
- **Las cifras son el héroe**: `<Figure>` en Spectral, `tabular-nums`, regla fina debajo, etiqueta
  en versalitas. Sin `tabular-nums` las cifras bailan al refrescar cada 10 s.
- Los eyebrows de sección (`Matrícula`, `Finanzas`, `Operación`, `Mensajería`) **son los bounded
  contexts del backend**. No los numeres: no son una secuencia, son un mapa.
- El estado del ecosistema se dice **en prosa**, no en un badge. Ver `verdict.ts`.

### Gráficos

Solo modo claro. Antes de tocar un color de gráfico, entiende esto:

- **`--color-azul-chart` (`#2F5D9E`) existe por una razón.** El azul de marca (`#1B365D`) falla
  **dos** comprobaciones como relleno de área: queda fuera de la banda de luminosidad (L=0.333) y
  bajo el piso de croma (0.077) — se lee gris azulado, no azul. `azul-chart` es el mismo tono un
  paso más claro. El par `azul-chart` + `oro` pasa las cuatro (banda, croma, separación CVD
  ΔE 92.9 en protanopía, contraste). **En texto y UI manda el azul de marca.**
- El azul primario contrasta 12.12:1 sobre blanco (el vino daba 10.38:1) y ya no compite con el
  rojo de `absent`, que antes quedaba peligrosamente cerca del vino.
- **Los tipos de evento NO se codifican por color.** `BarList` usa una sola serie: la longitud de
  la barra encoda todo. Sacar 7 hues de una paleta de 2 sería el anti-patrón arcoíris.
- Los colores de estado (`present`/`absent`) están **reservados** para salud y nunca se reutilizan
  como serie. Siempre van con texto, nunca color solo (`<StatusMark>` muestra "34 ms" / "sin
  respuesta").
- Las cifras y etiquetas llevan tokens de texto (`ink`/`muted`), nunca el color de la serie.

## Endpoints que consume este portal (vía Gateway)

| Acción | Método y ruta | Rol |
|---|---|---|
| Login | `POST /api/identity/auth/login` | público |
| Refresh | `POST /api/identity/auth/refresh` | público |
| Indicadores consolidados | `GET /api/analytics/dashboard` | Direccion |
| Bitácora de eventos | `GET /api/analytics/events?take=N` (1–500, def. 100) | Direccion |
| Notificaciones | `GET /api/notifications?take=N` (1–500, def. 100) | cualquier rol |
| Encolar notificación | `POST /api/notifications/send` `{recipient,channel,subject,body}` | Direccion |
| Health (×6) | `GET /api/{identity\|academic\|payments\|attendance\|notifications\|analytics}/health` | público |

### Gotchas del backend (verificados, no supuestos)

- **`status` del `DashboardDto` NO es el estado del ecosistema.** Vale `degraded` en cuanto
  `failedMessages > 0`: mide la salud de la **mensajería**, no la disponibilidad. Diría `ok` con
  Payments caído. Por eso el informe muestra **dos ejes**: `status` + los 6 `/health`.
- **`correlationId` es `null` en todos los eventos de negocio** (`StudentEnrolled`,
  `PaymentConfirmed`, `AttendanceRecorded`, `IncidentReported`). Solo Notifications y Academic lo
  propagan. Las cadenas de trazabilidad de `02-contratos` §8 **no se pueden reconstruir**: la
  cadena más larga real tiene 2 eventos. El portal expone la **cobertura de trazabilidad** en vez
  de fingir cadenas.
- **`POST /notifications/send` devuelve `202 Accepted` con cuerpo vacío.** El comando se encola;
  el resultado aparece en `GET /notifications` segundos después. Un toast que diga "Enviado" es
  mentira: el nuestro dice "Se encoló el envío".
- El backend **acepta canales inválidos** y los persiste con `status: Failed`. El formulario ofrece
  `Telegram` explícitamente rotulado: dispara `NotificationFailed`, sube `failedMessages` y degrada
  el ecosistema en vivo. Es la demo del proyecto en un clic.
- Los timestamps traen **precisión fraccional variable** (5 a 7 dígitos). Usa `new Date(iso)`, no
  `parseISO` de date-fns.

## Cómo agregar una pantalla nueva

1. `curl` el endpoint contra el Gateway y tipa el DTO **real** en `src/types/api.ts`.
2. Crea `src/features/<pantalla>/` con su página y sus hooks.
3. Datos de servidor con TanStack Query (`useQuery`/`useMutation`) sobre `apiFetch`.
4. Formularios con React Hook Form + Zod (`Field` + `controlClass`/`textareaClass`).
5. Reutiliza `PageHeader`, `Card`, `Figure`, `SectionRule`, `DataTable`, `EmptyState`, `Spinner`.
6. Registra la ruta en `src/app/router.tsx` dentro del `<RoleGuard allow={['Direccion']}>`.
7. Maneja los 3 estados siempre: loading (`Spinner`), error y vacío (`EmptyState`). Con Analytics
   recién levantado **todos los contadores están en 0** — la pantalla debe verse digna en cero.

## Gotchas de TypeScript (config del scaffold)

- `verbatimModuleSyntax: true` → importa tipos con `import type { … }`.
- `erasableSyntaxOnly: true` → **no uses `enum`**; usa uniones de string (`'A' | 'B'`).
- `noUnusedLocals/Parameters` → no dejes imports ni variables sin usar. **Ojo**: no detecta
  archivos huérfanos; al borrar una feature, borra sus archivos a mano.

## Convenciones de git

- Conventional commits, **sin atribución de IA / Co-Authored-By**.
- Rama de trabajo: `main`.
