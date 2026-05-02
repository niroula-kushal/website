import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import GithubProjects from './components/GithubProjects.vue'
import ThemeSelector from './components/ThemeSelector.vue'
import AeroLaneSimulator from './components/AeroLaneSimulator.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'nav-bar-content-after': () => h(ThemeSelector),
    })
  },
  enhanceApp({ app }) {
    app.component('GithubProjects', GithubProjects)
    app.component('AeroLaneSimulator', AeroLaneSimulator)
  },
}
