const THEME_KEY = 'codearena_theme'
export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) || 'light'
  } catch {
    return 'light'
  }
}
export function applyTheme(theme) {
  const root = document.documentElement
  if (theme === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {}
}
export function initTheme() {
  applyTheme(getStoredTheme())
}
