export const SIZE_CLASSES = {
  sm: {
    base: 'h-8 rounded-lg text-xs',
    withText: 'px-3',
    iconOnly: 'w-8',
  },
  md: {
    base: 'h-10 rounded-xl text-sm',
    withText: 'px-4',
    iconOnly: 'w-10',
  },
  lg: {
    base: 'h-12 rounded-xl text-md',
    withText: 'px-6',
    iconOnly: 'w-12',
  },
} as const

export const ICON_SIZES = {
  sm: 14,
  md: 16,
  lg: 18,
} as const
