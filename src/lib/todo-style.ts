import { computed, inject, provide, type ComputedRef, type InjectionKey } from "vue";

export type TodoSize = 'small' | 'medium' | 'large'
export type TodoShape = 'rounded' | 'square'
export type TodoVariant = 'primary' | 'secondary'

export interface TodoStyle {
    size: TodoSize
    shape: TodoShape
    variant: TodoVariant
}

export type TodoStyleOverrides = Partial<TodoStyle>

export const DEFAULT_TODO_STYLE: TodoStyle = {
    size: 'medium',
    shape: 'rounded',
    variant: 'primary',
}

export const TODO_STYLE_KEY: InjectionKey<ComputedRef<TodoStyle>> = Symbol('TODO_STYLE')

export function useTodoStyle(overrides: TodoStyleOverrides) {
    const fallback = computed<TodoStyle>(() => DEFAULT_TODO_STYLE);
    const parent = inject(TODO_STYLE_KEY, fallback);
    const style = computed<TodoStyle>(() => ({
        size: overrides.size ?? parent.value.size,
        shape: overrides.shape ?? parent.value.shape,
        variant: overrides.variant ?? parent.value.variant,
    }))

    provide(TODO_STYLE_KEY, style)
    return style
}