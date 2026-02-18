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
const searchQuery = ref('')

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
  const query = searchQuery.value.trim().toLowerCase()

  return todos.value.filter((todo) => {
    const byFilter =
      filter.value === 'completed' ? todo.done : filter.value === 'running' ? !todo.done : true
    const bySearch = query ? todo.text.toLowerCase().includes(query) : true
    return byFilter && bySearch
  })
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
  <div class="app-page">
    <div class="app-wrap">
      <TodoContainer size="medium" shape="rounded" variant="primary">
        <template #header>
          <div class="app-header">
            <div>
              <h1 class="app-title">TODO</h1>
            </div>

            <div class="app-score">
              Count:
              <span class="app-score-value">{{ todos.length }}</span>
            </div>
          </div>
        </template>

        <template #default>
          <div class="app-content">
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
              class="app-empty"
            >
              <p class="app-empty-text">There is no tasks yet</p>
            </div>
            <div
              v-else-if="filteredTodos.length === 0"
              class="app-empty"
            >
              <p class="app-empty-text">
                {{ searchQuery.trim() ? 'No tasks found by search' : 'No tasks in selected filter' }}
              </p>
            </div>
          </div>
        </template>

        <template #footer>
          <div class="app-footer">
            <div class="app-filters">
              <label class="app-filter-label">
                <input
                  type="radio"
                  name="todo-filter"
                  :checked="filter === 'all'"
                  @change="setFilter('all')"
                />
                <span>All</span>
              </label>

              <label class="app-filter-label">
                <input
                  type="radio"
                  name="todo-filter"
                  :checked="filter === 'completed'"
                  @change="setFilter('completed')"
                />
                <span>Completed</span>
              </label>

              <label class="app-filter-label">
                <input
                  type="radio"
                  name="todo-filter"
                  :checked="filter === 'running'"
                  @change="setFilter('running')"
                />
                <span>Running</span>
              </label>
            </div>

            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tasks..."
              class="app-search-input"
            />
          </div>
        </template>
      </TodoContainer>
    </div>
  </div>
</template>
