<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { cn } from '@/lib/utils'
import { useTodoStyle, type TodoShape, type TodoSize, type TodoVariant } from '@/lib/todo-style'

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
const slots = useSlots()

const sizeClasses = {
    small: 'todo-container--small',
    medium: 'todo-container--medium',
    large: 'todo-container--large',
} as const

const shapeClasses = {
    rounded: 'todo-container--rounded',
    square: 'todo-container--square',
} as const

const variantClasses = {
    primary: 'todo-container--primary',
    secondary: 'todo-container--secondary',
} as const

const containerClass = computed(() => 
    cn(
        'todo-container',
        sizeClasses[style.value.size],
        shapeClasses[style.value.shape],
        variantClasses[style.value.variant],
    ),
)
</script>

<template>
    <section :class="cn('todo-container-layout', containerClass)">
        <header v-if="slots.header">
            <slot name="header" />
        </header>
        <div>
            <slot />
        </div>
        <footer v-if="slots.footer">
            <slot name="footer" />
        </footer>
    </section>
</template>
