import { afterEach, beforeEach, vi } from 'vitest'
import '@/index.css'
import i18n from '@/lib/i18n'

const STABLE_VISUAL_CSS = `
  *, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    caret-color: transparent !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
  }
`

beforeEach(async () => {
  vi.useFakeTimers({
    now: new Date('2026-07-30T12:00:00-03:00'),
    toFake: ['Date'],
  })
  localStorage.clear()
  localStorage.setItem('token', 'visual-token')
  localStorage.setItem('workspace_id', 'visual-workspace')
  localStorage.setItem('i18nextLng', 'pt-BR')
  localStorage.setItem('theme', 'dark')
  localStorage.setItem('onboarding_completed', 'true')
  document.documentElement.classList.add('dark')
  document.documentElement.style.colorScheme = 'dark'
  document.head.querySelector('#stable-visual-css')?.remove()

  const stylesheet = document.createElement('style')
  stylesheet.id = 'stable-visual-css'
  stylesheet.textContent = STABLE_VISUAL_CSS
  document.head.appendChild(stylesheet)
  await i18n.changeLanguage('pt-BR')
  await document.fonts.ready
})

afterEach(() => {
  vi.useRealTimers()
})
