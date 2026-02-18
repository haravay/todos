<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Todo } from "@/types/todo"
import { useTodoStyle, type TodoShape, type TodoSize, type TodoVariant } from '@/lib/todo-style'

const props = defineProps<{
    todo: Todo
    onDelete: (id: string) => void
    onToggle: (id: string) => void
     size?: TodoSize
    shape?: TodoShape
    variant?: TodoVariant
}>()

const style = useTodoStyle(props)

const shapeClasses = {
    rounded: 'todo-item--rounded',
    square: 'todo-item--square',
} as const

const paddingBySize = {
    small: 'todo-item--small',
    medium: 'todo-item--medium',
    large: 'todo-item--large',
} as const

const borderByVariant = {
    primary: 'todo-item--primary',
    secondary: 'todo-item--secondary',
} as const

const itemClass = computed(() =>
    cn(
        'todo-item',
        paddingBySize[style.value.size],
        shapeClasses[style.value.shape],
        borderByVariant[style.value.variant],
    ),
)
</script>

<template>
    <li :class="itemClass">
        <label class="todo-item-label">
            <input type="checkbox" :checked="todo.done" @change="props.onToggle(todo.id)" class="todo-item-checkbox"/>
            <span class="todo-item-text" :class="todo.done ? 'todo-item-text--done' : 'todo-item-text--active'">{{ todo.text }}</span>
        </label>

        <Button type="button" variant="destructive" size="sm" @click="props.onDelete(todo.id)">
            Delete
        </Button>
    </li>
</template>
