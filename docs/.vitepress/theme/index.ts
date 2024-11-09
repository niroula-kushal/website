import DefaultTheme from 'vitepress/theme'
import GithubProjects from './components/GithubProjects.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GithubProjects', GithubProjects)
  }
}