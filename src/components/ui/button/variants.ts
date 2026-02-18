import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'ui-button',
  {
    variants: {
      variant: {
        default: 'ui-button--default',
        destructive: 'ui-button--destructive',
        outline: 'ui-button--outline',
        secondary: 'ui-button--secondary',
        ghost: 'ui-button--ghost',
        link: 'ui-button--link',
      },
      size: {
        default: 'ui-button--size-default',
        sm: 'ui-button--size-sm',
        lg: 'ui-button--size-lg',
        icon: 'ui-button--size-icon',
        'icon-sm': 'ui-button--size-icon-sm',
        'icon-lg': 'ui-button--size-icon-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
