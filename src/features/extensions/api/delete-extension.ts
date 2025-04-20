import { extensionQueryOptions } from '@/features/extensions/api/get-extension'
import { extensionsQueryOptions } from '@/features/extensions/api/get-extensions'
import { deleteExtensionById } from '@/features/extensions/db/mutations'
import { authMiddleware } from '@/middleware/auth-guard'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'

export const deleteExtension = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    try {
      return await deleteExtensionById(id)
    } catch (error) {
      console.error('Error during DB operation in deleteExtension:', error)
      throw new Error(error instanceof Error ? error.message : '')
    }
  })

export const useDeleteExtensionMutation = (id: number) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const listQueryKey = extensionsQueryOptions().queryKey
  const extensionQueryKey = extensionQueryOptions(id).queryKey

  return useMutation({
    mutationFn: (id: number) => deleteExtension({ data: id }),
    onMutate: async deledExtensionId => {
      const previousExtensions = queryClient.getQueryData(listQueryKey)
      const previousExtension = queryClient.getQueryData(extensionQueryKey)

      queryClient.setQueryData(
        listQueryKey,
        previousExtensions?.filter(ext => ext.id !== deledExtensionId)
      )
      queryClient.setQueryData(extensionQueryKey, undefined)

      await navigate({ to: '/', replace: true })

      return { previousExtensions, previousExtension }
    },
    onSuccess: deletedExtension => {
      toast.success(`Extension "${deletedExtension.name}" deleted successfully.`)
    },
    onError: (error, _deletedExtension, context) => {
      console.error('Optimistic delete failed:', error.message)

      if (context?.previousExtensions) {
        queryClient.setQueryData(listQueryKey, context.previousExtensions)
      }
      if (context?.previousExtension) {
        queryClient.setQueryData(extensionQueryKey, context.previousExtension)
      }

      toast.error('Error', {
        description: error.message || 'An unknown error occurred.',
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: listQueryKey }),
  })
}
