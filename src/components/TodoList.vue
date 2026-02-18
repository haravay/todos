<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { useTodoStyle, type TodoShape, type TodoSize, type TodoVariant } from '@/lib/todo-style'

const props = defineProps<{
    size?: TodoSize
    shape?: TodoShape
    variant?: TodoVariant
}>()

const style = useTodoStyle(props)

const gapBySize = {
    small: 'todo-list--small',
    medium: 'todo-list--medium',
    large: 'todo-list--large',
} as const

const shapeClasses = {
    rounded: 'todo-list--rounded',
    square: 'todo-list--square',
} as const

const variantClasses = {
    primary: 'todo-list--primary',
    secondary: 'todo-list--secondary',
} as const

const listClass = computed(() =>
    cn(
        gapBySize[style.value.size],
        shapeClasses[style.value.shape],
        variantClasses[style.value.variant],
    ),
)
</script>

<template>
    <TransitionGroup name="todo-list" tag="ul" :class="listClass">
        <slot />
    </TransitionGroup>
</template>
