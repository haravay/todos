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
    rounded: 'rounded-2xl',
    square: 'rounded-none',
} as const

const paddingBySize = {
    small: 'px-3 py-2',
    medium: 'px-4 py-3',
    large: 'px-5 py-4',
} as const

const borderByVariant = {
    primary: 'border-white/40 bg-white/60',
    secondary: 'border-black/10 bg-white/80',
} as const

const itemClass = computed(() =>
    cn(
        'group flex items-center justify-between gap-3 border ring-1 ring-black/5 shadow-sm hover:shadow-md transition',
        paddingBySize[style.value.size],
        shapeClasses[style.value.shape],
        borderByVariant[style.value.variant],
    ),
)
</script>

<template>
    <li :class="itemClass">
        <label class="flex min-w-0 items-center gap-3">
            <input type="checkbox" :checked="todo.done" @change="props.onToggle(todo.id)" class="h-5 w-5 shrink-0"/>
            <span class="min-w-0 truncate transition" :class="todo.done ? 'text-slate-400 line-through' : 'text-slate-800'">{{ todo.text }}</span>
        </label>

        <Button type="button" variant="destructive" size="sm" class="bg-red-600 text-white hover:bg-red-700 opacity-0 translate-x-2 transition group-hover:opacity-100 group-hover:translate-x-0" @click="props.onDelete(todo.id)">
            Delete
        </Button>
    </li>
</template>
