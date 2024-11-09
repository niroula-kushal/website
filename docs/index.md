---
layout: home
hero:
  name: "Kushal Niroula"
  text: "Full Stack Developer"
  tagline: Passionate about building scalable web applications and solving complex problems
  image:
    src: /Kushal.png
    alt: Kushal Niroula
  actions:
    - theme: brand
      text: View Projects
      link: /projects
    - theme: alt
      text: About Me
      link: /about
features:
  - title: Full Stack Development
    details: A decade long Experienc in both frontend and backend development using modern technologies
  - title: Problem Solving
    details: Strong analytical and problem-solving skills with a focus on efficient solutions
  - title: Team Collaboration
    details: Proven track record of working effectively in team environments
---

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://www.github.com/niroula-kushal.png',
    name: 'Kushal Niroula',
    title: 'Full stack developer',
    links: [
      { icon: 'github', link: 'https://github.com/niroula-kushal' },
      { icon: 'twitter', link: 'https://twitter.com/falconKushal' }
    ]
  }
]
</script>

### My Card

<VPTeamMembers size="medium" :members="members" />
