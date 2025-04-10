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
} from '@/features/extensions/db/schema'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'

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
    onSuccess: toggledExtension => {
      toast.success(
        `Extension "${toggledExtension.name}" set to ${toggledExtension.isActive ? 'active' : 'inactive'}.`
      )
    },
    onError: (error, _variables, context) => {
      console.error(error.message)
      if (context?.previousExtensions) {
        queryClient.setQueryData(queryKey, context.previousExtensions)
      }

      toast.error('Error toggling extension', {
        description: error.message || 'An unknown error occurred.',
      })
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey }),
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
      const listQuery = queryClient.cancelQueries({ queryKey: listQueryKey })
      const extensionQuery = queryClient.cancelQueries({ queryKey: extensionQueryKey })
      await Promise.all([listQuery, extensionQuery])

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
    onSettled: () => {
      const listQuery = queryClient.invalidateQueries({ queryKey: listQueryKey })
      const extensionQuery = queryClient.invalidateQueries({ queryKey: extensionQueryKey })
      return Promise.all([listQuery, extensionQuery])
    },
  })
}
