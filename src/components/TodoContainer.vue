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
