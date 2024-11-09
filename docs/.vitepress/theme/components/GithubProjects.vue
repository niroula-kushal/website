<!-- GithubProjects.vue -->
<script setup>
import { ref, onMounted } from 'vue';

const projects = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await fetch(
      'https://api.github.com/users/niroula-kushal/repos'
    );
    if (!response.ok) throw new Error('Failed to fetch projects');
    const data = await response.json();
    projects.value = data
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count);
    loading.value = false;
  } catch (e) {
    error.value = e.message;
    loading.value = false;
  }
});
</script>

<template>
  <div class="github-projects">
    <div v-if="loading" class="loading">Loading projects...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <h3>
          <a :href="project.html_url" target="_blank" rel="noopener">
            {{ project.name }}
          </a>
        </h3>
        <p class="description">
          {{ project.description || 'No description available' }}
        </p>
        <div class="stats">
          <span class="stars">⭐ {{ project.stargazers_count }}</span>
          <span class="language" v-if="project.language">
            {{ project.language }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.github-projects {
  margin: 2rem 0;
}

.loading,
.error {
  text-align: center;
  padding: 2rem;
  color: var(--vp-c-text-2);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.project-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  background-color: var(--vp-c-bg-soft);
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.project-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.project-card h3 a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.project-card h3 a:hover {
  text-decoration: underline;
}

.description {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
}

.stats {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.stars {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.language {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
</style>
