<script setup lang="ts">
import { computed, ref } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
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

const shapeClasses = {
    rounded: 'rounded-2xl',
    square: 'rounded-none',
} as const

const buttonVariantClasses = {
    primary: 'bg-linear-to-r from-indigo-500 to-fuchsia-500 text-white hover:brightness-110',
    secondary: 'bg-linear-to-r from-slate-700 to-slate-900 text-white hover:brightness-110',
} as const

const inputClass = computed(() => 
    cn(
        'bg-white text-slate-900 placeholder:text-slate-500 border border-white/80 shadow-lg transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
        shapeClasses[style.value.shape],
        style.value.size === 'small' ? 'h-10 px-4' : style.value.size === 'large' ? 'h-12 px-6' : 'h-11 px-5',
    ),
)

const buttonClass = computed(() =>
  cn(
    'shadow-lg transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed',
    shapeClasses[style.value.shape],
    style.value.size === 'small' ? 'h-10 px-4' : style.value.size === 'large' ? 'h-12 px-6' : 'h-11 px-5',
    buttonVariantClasses[style.value.variant],
  ),
)
</script>

<template>
    <div class="flex gap-2">
        <Input v-model="text" @keyup.enter="submit" type="text" placeholder="Add a task..." :class="inputClass" />

        <Button type="button" :disabled="!canAdd" @click="submit" :class="buttonClass" >
            Add
        </Button>
    </div>
</template>
