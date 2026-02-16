<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import type { Todo } from "@/types/todo"
import { useTodoStyle, type TodoShape, type TodoSize, type TodoVariant } from '@/lib/todo-style'
import TodoInput from './TodoInput.vue'
import TodoList from './TodoList.vue'

const props = withDefaults(
    defineProps<{
        size?: TodoSize
        shape?: TodoShape
        variant?: TodoVariant
    }>(),
    {
        size: 'medium',
        shape: 'rounded',
        variant: 'primary',
    },
)

const style = useTodoStyle(props)

const STORAGE_KEY = 'todos-v1'
const todos = ref<Todo[]>([])

function safeParseTodos(raw: string | null): Todo[] {
    if (!raw) return []
    try {
        const data = JSON.parse(raw) as unknown
        if (!Array.isArray(data)) return []
        return (data as unknown[])
            .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x))
            .filter((x) => x && typeof x.id === 'string' && typeof x.text === 'string')
            .map<Todo>((x) => ({
                id: String(x.id),
                text: String(x.text),
                done: Boolean(x.done),
                createdAt: typeof x.createdAt === 'number' ? x.createdAt : Date.now(),
            }))
    } catch {
        return []
    }
}

onMounted(() => {
    todos.value = safeParseTodos(localStorage.getItem(STORAGE_KEY))
})

watch(
    todos,
    () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
    },
    { deep: true },
)

function makeId() {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function addTodo(text: string) {
    const value = text.trim()
    if (!value) return
    todos.value.unshift({
        id: makeId(),
        text: value,
        done: false,
        createdAt: Date.now(),
    })
}

function toggleTodo(id: string) {
    const t = todos.value.find((x) => x.id === id)
    if (t) t.done = !t.done
}

function deleteTodo(id: string) {
    const index = todos.value.findIndex((x) => x.id === id)
    if (index !== -1) todos.value.splice(index, 1)
}

const sizeClasses = {
    small: 'p-4 text-sm',
    medium: 'p-6 text-base',
    large: 'p-8 text-lg',
} as const

const shapeClasses = {
    rounded: 'rounded-[28px]',
    square: 'rounded-none',
} as const

const variantClasses = {
    primary: 'glass',
    secondary: 'bg-white/80 border border-black/10 shadow-black/10',
} as const

const containerClass = computed(() => 
    cn(
        'w-full max-w-xl',
        sizeClasses[style.value.size],
        shapeClasses[style.value.shape],
        variantClasses[style.value.variant],
    ),
)
</script>

<template>
    <section :class="cn('flex flex-col gap-6', containerClass)">
        <header class="flex items-start justify-between gap-4">
            <div>
                <h1 class="text-2xl font-semibold tracking-tight">TODO</h1>
            </div>

            <div class="text-sm text-slate-600">
                Score:
                <span class="font-semibold text-slate-900">{{ todos.length }}</span>
            </div>
        </header>

        <div class="mt-6">
            <TodoInput :onAdd="addTodo" />
            <TodoList :todos="todos" :onDelete="deleteTodo" :onToggle="toggleTodo" />

            <div v-if="todos.length === 0" class="mt-6 rounded-2xl border border-white/40 bg-white/50 p-5 text-center ring-1 ring-black/5">
                <p class="mt-2 text-sm text-slate-600">There is no tasks yet</p>
            </div>
        </div>
    </section>
</template>
