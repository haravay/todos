<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import TodoContainer from './components/TodoContainer.vue';
import TodoInput from './components/TodoInput.vue';
import TodoItem from './components/TodoItem.vue';
import TodoList from './components/TodoList.vue';
import type { Todo } from './types/todo';

const STORAGE_KEY = 'todos-v1'
const todos = ref<Todo[]>([])
type TodoFilter = 'all' | 'completed' | 'running'
const filter = ref<TodoFilter>('all')

function safeParseTodos(raw: string | null): Todo[] {
  if (!raw) return []
  try {
    const data = JSON.parse(raw) as unknown
    if (!Array.isArray(data)) return []
    return (data as unknown[])
      .filter((x): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x))
      .filter((x) => typeof x.id === 'string' && typeof x.text === 'string')
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

function setFilter(nextFilter: TodoFilter) {
  filter.value = nextFilter
}

const filteredTodos = computed(() => {
  if (filter.value === 'completed') return todos.value.filter((todo) => todo.done)
  if (filter.value === 'running') return todos.value.filter((todo) => !todo.done)
  return todos.value
})

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
</script>

<template>
  <div class="min-h-full bg-linear-to-br from-slate-900 via-indigo-900 to-fuchsia-900 px-4 py-10">
    <div class="mx-auto flex justify-center">
      <TodoContainer size="medium" shape="rounded" variant="primary">
        <template #header>
          <div class="flex items-start justify-between gap-4">
            <div>
              <h1 class="text-2xl font-semibold tracking-tight">TODO</h1>
            </div>

            <div class="text-sm text-slate-600">
              Score:
              <span class="font-semibold text-slate-900">{{ todos.length }}</span>
            </div>
          </div>
        </template>

        <template #default>
          <div class="mt-6">
            <TodoInput :onAdd="addTodo" size="small" />
            <TodoList>
              <TodoItem
                v-for="todo in filteredTodos"
                :key="todo.id"
                :todo="todo"
                :onDelete="deleteTodo"
                :onToggle="toggleTodo"
              />
            </TodoList>

            <div
              v-if="todos.length === 0"
              class="mt-6 rounded-2xl border border-white/40 bg-white/50 p-5 text-center ring-1 ring-black/5"
            >
              <p class="mt-2 text-sm text-slate-600">There is no tasks yet</p>
            </div>
            <div
              v-else-if="filteredTodos.length === 0"
              class="mt-6 rounded-2xl border border-white/40 bg-white/50 p-5 text-center ring-1 ring-black/5"
            >
              <p class="mt-2 text-sm text-slate-600">No tasks in selected filter</p>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-700">
            <label class="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                :checked="filter === 'all'"
                @change="setFilter('all')"
              />
              <span>All</span>
            </label>

            <label class="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                :checked="filter === 'completed'"
                @change="setFilter('completed')"
              />
              <span>Completed</span>
            </label>

            <label class="inline-flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                :checked="filter === 'running'"
                @change="setFilter('running')"
              />
              <span>Running</span>
            </label>
          </div>
        </template>
      </TodoContainer>
    </div>
  </div>
</template>
