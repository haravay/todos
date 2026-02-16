<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import type { Todo } from "@/types/todo"
import TodoItem from './TodoItem.vue'
import { useTodoStyle, type TodoShape, type TodoSize, type TodoVariant } from '@/lib/todo-style'

const props = defineProps<{
    todos: Todo[]
    onDelete: (id: string) => void
    onToggle: (id: string) => void
    size?: TodoSize
    shape?: TodoShape
    variant?: TodoVariant
}>()

const style = useTodoStyle(props)

const gapBySize = {
    small: 'mt-3 space-y-2',
    medium: 'mt-4 space-y-3',
    large: 'mt-5 space-y-4',
} as const

const shapeClasses = {
    rounded: 'rounded-2xl',
    square: 'rounded-none',
} as const

const variantClasses = {
    primary: 'bg-transparent',
    secondary: 'rounded-2xl border border-black/10 bg-white/40 p-2',
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
    <TransitionGroup name="list" tag="ul" :class="listClass">
        <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" :onDelete="onDelete" :onToggle="onToggle" />
    </TransitionGroup>
</template>

<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 220ms ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
