<script setup lang="ts">
import TodoContainer from './components/TodoContainer.vue';
</script>

<template>
  <div class="min-h-full bg-linear-to-br from-slate-900 via-indigo-900 to-fuchsia-900 px-4 py-10">
    <div class="mx-auto flex justify-center">
      <TodoContainer size="medium" shape="rounded" variant="primary" />
    </div>
  </div>
</template>
