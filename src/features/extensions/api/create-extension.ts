import { extensionsQueryOptions } from '@/features/extensions/api/get-extensions'
import { insertExtension } from '@/features/extensions/db/insertions'
import { createExtensionWithCategoriesSchema, NewExtension } from '@/features/extensions/schemas'
import { authMiddleware } from '@/middleware/auth-guard'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'

export const createExtension = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .validator(createExtensionWithCategoriesSchema)
  .handler(async ({ data }) => {
    try {
      return await insertExtension(data)
    } catch (error) {
      console.error('Error during DB operation in createExtension:', error)
      throw new Error(error instanceof Error ? error.message : '')
    }
  })

export const useCreateExtensionMutation = () => {
  const queryClient = useQueryClient()
  const queryKey = extensionsQueryOptions().queryKey
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (extension: NewExtension) => createExtension({ data: extension }),
    onSuccess: newExtension => {
      toast.success(`Extension "${newExtension.name}" created successfully.`)
      navigate({
        to: '/extensions/$extId',
        params: { extId: newExtension.id },
        replace: true,
      })
    },
    onError: error => {
      console.error(error.message)
      toast.error('Error', {
        description: error.message || 'An unknown error occurred.',
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
  })
}
