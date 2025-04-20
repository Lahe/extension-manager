import { categoriesQueryOptions } from '@/features/extensions/api/get-categories'
import { extensionQueryOptions } from '@/features/extensions/api/get-extension'
import { extensionsQueryOptions } from '@/features/extensions/api/get-extensions'
import { updateExtensionById, updateExtensionStatus } from '@/features/extensions/db/mutations'
import {
  ExtensionWithCategories,
  toggleExtensionInputSchema,
  ToggleExtensionStatus,
  UpdateExtensionForm,
  updateExtensionFormSchema,
} from '@/features/extensions/schemas'
import { authMiddleware } from '@/middleware/auth-guard'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'

export const toggleExtensionStatus = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
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
  const listQueryKey = extensionsQueryOptions().queryKey

  return useMutation({
    mutationFn: (input: ToggleExtensionStatus) => toggleExtensionStatus({ data: input }),
    onMutate: async toggledExtension => {
      const extensionQueryKey = extensionQueryOptions(toggledExtension.id).queryKey

      const previousExtensions = queryClient.getQueryData(listQueryKey)
      const previousExtension = queryClient.getQueryData(extensionQueryKey)

      let optimisticExtension: ExtensionWithCategories | undefined
      if (previousExtension) {
        optimisticExtension = {
          ...previousExtension,
          isActive: toggledExtension.isActive,
        }
        queryClient.setQueryData(extensionQueryKey, optimisticExtension)
      }
      if (previousExtensions) {
        const optimisticExtensions = previousExtensions.map(ext => {
          if (ext.id === toggledExtension.id) {
            return optimisticExtension
              ? optimisticExtension
              : { ...ext, isActive: toggledExtension.isActive }
          }
          return ext
        })
        queryClient.setQueryData(listQueryKey, optimisticExtensions)
      }

      return { previousExtensions, previousExtension, extensionQueryKey }
    },
    onSuccess: toggledExtension => {
      toast.success(
        `Extension "${toggledExtension.name}" set to ${toggledExtension.isActive ? 'active' : 'inactive'}.`
      )
    },
    onError: (error, _toggledExtension, context) => {
      console.error('Optimistic update failed:', error.message)

      if (context?.previousExtensions) {
        queryClient.setQueryData(listQueryKey, context.previousExtensions)
      }
      if (context?.previousExtension && context?.extensionQueryKey) {
        queryClient.setQueryData(context.extensionQueryKey, context.previousExtension)
      }

      toast.error('Error', {
        description: error.message || 'An unknown error occurred.',
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: listQueryKey }),
  })
}

export const updateExtension = createServerFn({ method: 'POST' })
  .validator(updateExtensionFormSchema)
  .handler(async ({ data }) => {
    try {
      const { id, ...extensionData } = data
      return await updateExtensionById(id, extensionData)
    } catch (error) {
      console.error('Error during DB operation in updateExtension:', error)
      const message = error instanceof Error ? error.message : 'An unknown error occurred.'
      throw new Error(`Failed to update extension. ${message}`)
    }
  })

export const useUpdateExtensionMutation = (id: number) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const listQueryKey = extensionsQueryOptions().queryKey
  const extensionQueryKey = extensionQueryOptions(id).queryKey

  return useMutation({
    mutationFn: (input: UpdateExtensionForm) => updateExtension({ data: input }),
    onMutate: async updatedExtension => {
      const previousExtensions = queryClient.getQueryData(listQueryKey)
      const previousExtension = queryClient.getQueryData(extensionQueryKey)
      const categories = queryClient.getQueryData(categoriesQueryOptions().queryKey)

      if (previousExtension && categories) {
        const filteredCategories = categories.filter(category =>
          updatedExtension.categories?.includes(category.id)
        )

        const optimisticExtension = {
          ...previousExtension,
          ...updatedExtension,
          categories: filteredCategories,
        }

        queryClient.setQueryData(extensionQueryKey, optimisticExtension)

        if (previousExtensions) {
          queryClient.setQueryData(
            listQueryKey,
            previousExtensions.map((ext: ExtensionWithCategories) =>
              ext.id === id ? optimisticExtension : ext
            )
          )
        }
      }

      await navigate({ to: '/extensions/$extId', params: { extId: id }, replace: true })

      return { previousExtension, previousExtensions, updatedExtension }
    },
    onSuccess: updatedExtension => {
      toast.success(`Extension "${updatedExtension.name}" updated successfully.`)
    },
    onError: (error, _updatedExtension, context) => {
      console.error('Optimistic update failed:', error.message)

      if (context?.previousExtensions) {
        queryClient.setQueryData(listQueryKey, context.previousExtensions)
      }
      if (context?.previousExtension) {
        queryClient.setQueryData(extensionQueryKey, context.previousExtension)
      }

      navigate({ to: '/extensions/$extId/edit', params: { extId: id }, replace: true })

      toast.error('Error', {
        description: error.message || 'An unknown error occurred.',
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: listQueryKey }),
  })
}
