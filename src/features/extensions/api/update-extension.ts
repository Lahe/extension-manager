import { extensionsQueryOptions } from '@/features/extensions/api/get-extensions'
import { updateExtensionStatus } from '@/features/extensions/db/mutations'
import {
  ExtensionWithCategories,
  toggleExtensionInputSchema,
  ToggleExtensionStatus,
} from '@/features/extensions/db/schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

export const toggleExtensionStatus = createServerFn({ method: 'POST' })
  .validator(toggleExtensionInputSchema)
  .handler(async ({ data }) => {
    try {
      return await updateExtensionStatus(data)
    } catch (error) {
      console.error('Error during DB operation in toggleExtension:', error)
      throw new Error(
        `Failed to toggle extension status. ${error instanceof Error ? error.message : ''}`
      )
    }
  })

export const useToggleExtensionMutation = () => {
  const queryClient = useQueryClient()
  const queryKey = extensionsQueryOptions().queryKey

  return useMutation({
    mutationFn: (input: ToggleExtensionStatus) => toggleExtensionStatus({ data: input }),
    onMutate: async input => {
      await queryClient.cancelQueries({ queryKey })
      const previousExtensions = queryClient.getQueryData(queryKey)

      if (previousExtensions) {
        const optimisticExtensions = previousExtensions.map((ext: ExtensionWithCategories) =>
          ext.id === input.id ? { ...ext, isActive: input.isActive } : ext
        )
        queryClient.setQueryData(queryKey, optimisticExtensions)
      }

      return { previousExtensions }
    },
    onError: (err, _variables, context) => {
      console.error(err.message)
      if (context?.previousExtensions) {
        queryClient.setQueryData(queryKey, context.previousExtensions)
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })
}
