<script setup lang="ts">
import { cn } from '@/lib/utils'
import { buttonVariants, type ButtonVariants } from './variants'

withDefaults(
  defineProps<{
    variant?: ButtonVariants['variant']
    size?: ButtonVariants['size']
  }>(),
  {
    variant: 'default',
    size: 'default',
  },
)
</script>

<template>
  <button data-slot="button" v-bind="$attrs" :class="cn(buttonVariants({ variant, size }))">
    <slot />
  </button>
</template>

