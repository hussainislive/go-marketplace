import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { store } from './store'
import { queryClient } from './lib/queryClient'
import App from './App'
// Self-hosted Inter (only the weights we use) — no Google Fonts round-trip,
// which removes a render-blocking request and the font-swap layout shift (CLS).
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './index.css'

// After a new deploy, an open tab may hold a stale index.html that references
// old (now-deleted) JS chunks. Loading them fails with a MIME-type / dynamic-import
// error. Silently reload once to fetch the fresh build instead of showing an error.
const RELOAD_FLAG = '_chunk_reloaded'
function isStaleChunkError(message: string): boolean {
  return (
    message.includes('Failed to fetch dynamically imported module') ||
    message.includes('error loading dynamically imported module') ||
    message.includes('Importing a module script failed') ||
    message.includes('not a valid JavaScript MIME type')
  )
}
function handleStaleChunk(message: string) {
  if (!isStaleChunkError(message)) return
  if (sessionStorage.getItem(RELOAD_FLAG)) return // avoid reload loops
  sessionStorage.setItem(RELOAD_FLAG, '1')
  window.location.reload()
}
window.addEventListener('error', e => handleStaleChunk(e.message ?? ''))
window.addEventListener('unhandledrejection', e => handleStaleChunk(String(e.reason?.message ?? e.reason ?? '')))
// Clear the flag once the app has loaded cleanly so future deploys can reload again.
window.addEventListener('load', () => sessionStorage.removeItem(RELOAD_FLAG))

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')

createRoot(rootEl).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />}
      </QueryClientProvider>
    </Provider>
  </StrictMode>
)
