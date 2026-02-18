<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useTodoStyle, type TodoShape, type TodoSize, type TodoVariant } from '@/lib/todo-style'

const props = defineProps<{
    onAdd: (text: string) => void
    size?: TodoSize
    shape?: TodoShape
    variant?: TodoVariant
}>()

const style = useTodoStyle(props)
const text = ref('')
const canAdd = computed(() => text.value.trim().length > 0)

function submit() {
    const v = text.value.trim()
    if (!v) return
    props.onAdd(v)
    text.value = ''
}

const buttonVariant = computed(() => (style.value.variant === 'primary' ? 'default' : 'secondary'))
const buttonSize = computed(() =>
  style.value.size === 'small' ? 'sm' : style.value.size === 'large' ? 'lg' : 'default',
)
</script>

<template>
    <div class="todo-input-row">
        <Input v-model="text" @keyup.enter="submit" type="text" placeholder="Add a task..." />

        <Button type="button" :disabled="!canAdd" @click="submit" :variant="buttonVariant" :size="buttonSize">
            Add
        </Button>
    </div>
</template>
