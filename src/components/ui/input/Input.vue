<script setup lang="ts">
const modelValue = defineModel<string>()
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    v-bind="$attrs"
    class="ui-input"
  />
</template>
