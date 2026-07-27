let Sentry = null

export async function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return

  try {
    Sentry = await import('@sentry/react')
    Sentry.init({
      dsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
      ],
      tracesSampleRate: 0.2,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      environment: import.meta.env.MODE || 'development',
    })
  } catch {
    // Sentry not installed — silently ignore
  }
}

export function captureException(error, context) {
  if (Sentry) Sentry.captureException(error, context)
}

export function captureMessage(message, level = 'info') {
  if (Sentry) Sentry.captureMessage(message, level)
}
