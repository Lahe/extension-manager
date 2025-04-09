import { extensionsQueryOptions } from '@/features/extensions/api/get-extensions'
import { insertExtension } from '@/features/extensions/db/insertions'
import { createExtensionWithCategoriesSchema, NewExtension } from '@/features/extensions/db/schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

export const createExtension = createServerFn({ method: 'POST' })
  .validator(createExtensionWithCategoriesSchema)
  .handler(async ({ data }) => {
    try {
      return await insertExtension(data)
    } catch (error) {
      console.error('Error during DB operation in createExtension:', error)
      throw new Error(`Failed to create extension. ${error instanceof Error ? error.message : ''}`)
    }
  })

export const useCreateExtensionMutation = () => {
  const queryClient = useQueryClient()
  const queryKey = extensionsQueryOptions().queryKey

  return useMutation({
    mutationFn: (extension: NewExtension) => createExtension({ data: extension }),
    onError: err => {
      console.error(err.message)
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })
}
