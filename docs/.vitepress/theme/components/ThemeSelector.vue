<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'vitepress-theme-appearance'
const currentTheme = ref<ThemeMode>('system')
let mediaQuery: MediaQueryList | null = null

const resolveSystemTheme = () => {
  return mediaQuery?.matches ? 'dark' : 'light'
}

const syncDomTheme = (theme: ThemeMode) => {
  const root = document.documentElement
  const appliedTheme = theme === 'system' ? resolveSystemTheme() : theme
  root.classList.toggle('dark', appliedTheme === 'dark')
  root.style.colorScheme = appliedTheme
}

const setTheme = (theme: ThemeMode) => {
  currentTheme.value = theme
  const value = theme === 'system' ? 'auto' : theme
  localStorage.setItem(STORAGE_KEY, value)
  syncDomTheme(theme)
}

const onSystemChange = () => {
  if (currentTheme.value === 'system') {
    syncDomTheme('system')
  }
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  const savedTheme = localStorage.getItem(STORAGE_KEY)
  if (savedTheme === 'light' || savedTheme === 'dark') {
    currentTheme.value = savedTheme
  } else {
    currentTheme.value = 'system'
  }

  syncDomTheme(currentTheme.value)
  mediaQuery.addEventListener('change', onSystemChange)
})

onBeforeUnmount(() => {
  mediaQuery?.removeEventListener('change', onSystemChange)
})
</script>

<template>
  <div class="theme-selector" aria-label="Theme selector">
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
</template>
