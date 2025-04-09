import { extensionQueryOptions } from '@/features/extensions/api/get-extension'
import { deleteExtensionById } from '@/features/extensions/db/updates'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'

export const deleteExtension = createServerFn({ method: 'POST' })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    try {
      return await deleteExtensionById(id)
    } catch (error) {
      console.error('Error during DB operation in deleteExtension:', error)
      throw new Error(`Failed to delete extension. ${error instanceof Error ? error.message : ''}`)
    }
  })

export const useDeleteExtensionMutation = (id: number) => {
  const queryClient = useQueryClient()
  const queryKey = extensionQueryOptions(id).queryKey

  return useMutation({
    mutationFn: (id: number) => deleteExtension({ data: id }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: err => {
      console.error(err.message)
    },
  })
}
