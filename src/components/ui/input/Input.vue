<script setup lang="ts">
const modelValue = defineModel<string>()
</script>

<template>
  <input
    v-model="modelValue"
    data-slot="input"
    v-bind="$attrs"
    class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
  />
</template>
