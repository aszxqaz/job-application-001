<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/pie-chart">PieChart</RouterLink>
      <RouterLink to="/progress-indicator">ProgressIndicator</RouterLink>
    </nav>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style scoped>
header {
  padding: 4rem 2rem;
}

nav {
  display: flex;
  gap: 1rem;
}
</style>
