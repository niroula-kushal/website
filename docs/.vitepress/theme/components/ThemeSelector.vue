<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type ThemeMode = 'light' | 'dark' | 'system'
type AccentColor = 'indigo' | 'cyan' | 'green' | 'orange' | 'pink'

const THEME_STORAGE_KEY = 'vitepress-theme-appearance'
const COLOR_STORAGE_KEY = 'vitepress-theme-accent'

const currentTheme = ref<ThemeMode>('system')
const currentColor = ref<AccentColor>('indigo')
let mediaQuery: MediaQueryList | null = null

const colorOptions: Array<{ id: AccentColor; label: string }> = [
  { id: 'indigo', label: 'Indigo' },
  { id: 'cyan', label: 'Cyan' },
  { id: 'green', label: 'Green' },
  { id: 'orange', label: 'Orange' },
  { id: 'pink', label: 'Pink' },
]

const resolveSystemTheme = () => {
  return mediaQuery?.matches ? 'dark' : 'light'
}

const syncDomTheme = (theme: ThemeMode) => {
  const root = document.documentElement
  const appliedTheme = theme === 'system' ? resolveSystemTheme() : theme
  root.classList.toggle('dark', appliedTheme === 'dark')
  root.style.colorScheme = appliedTheme
}

const syncAccentColor = (color: AccentColor) => {
  document.documentElement.dataset.colorTheme = color
}

const setTheme = (theme: ThemeMode) => {
  currentTheme.value = theme
  const value = theme === 'system' ? 'auto' : theme
  localStorage.setItem(THEME_STORAGE_KEY, value)
  syncDomTheme(theme)
}

const setAccentColor = (color: AccentColor) => {
  currentColor.value = color
  localStorage.setItem(COLOR_STORAGE_KEY, color)
  syncAccentColor(color)
}

const onSystemChange = () => {
  if (currentTheme.value === 'system') {
    syncDomTheme('system')
  }
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    currentTheme.value = savedTheme
  } else {
    currentTheme.value = 'system'
  }

  const savedColor = localStorage.getItem(COLOR_STORAGE_KEY)
  if (savedColor && colorOptions.some(({ id }) => id === savedColor)) {
    currentColor.value = savedColor as AccentColor
  }

  syncDomTheme(currentTheme.value)
  syncAccentColor(currentColor.value)
  mediaQuery.addEventListener('change', onSystemChange)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', onSystemChange)
})
</script>

<template>
  <div class="theme-controls" aria-label="Theme controls">
    <div class="theme-selector" aria-label="Theme mode selector">
      <button
        type="button"
        class="theme-button"
        :class="{ active: currentTheme === 'light' }"
        @click="setTheme('light')"
        aria-label="Switch to light theme"
        title="Light"
      >
        ☀️
      </button>
      <button
        type="button"
        class="theme-button"
        :class="{ active: currentTheme === 'system' }"
        @click="setTheme('system')"
        aria-label="Use system theme"
        title="System"
      >
        🖥️
      </button>
      <button
        type="button"
        class="theme-button"
        :class="{ active: currentTheme === 'dark' }"
        @click="setTheme('dark')"
        aria-label="Switch to dark theme"
        title="Dark"
      >
        🌙
      </button>
    </div>

    <div class="color-selector" aria-label="Accent color selector">
      <button
        v-for="option in colorOptions"
        :key="option.id"
        type="button"
        class="color-button"
        :class="[`color-${option.id}`, { active: currentColor === option.id }]"
        @click="setAccentColor(option.id)"
        :aria-label="`Use ${option.label} accent color`"
        :title="option.label"
      />
    </div>
  </div>
</template>
