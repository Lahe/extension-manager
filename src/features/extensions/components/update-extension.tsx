import { Button } from '@/components/ui/button'
import { DeleteConfirmationDialog } from '@/features/common/components/delete-confirmation'
import { useDeleteExtensionMutation } from '@/features/extensions/api/delete-extension'
import { extensionQueryOptions } from '@/features/extensions/api/get-extension'
import { useUpdateExtensionMutation } from '@/features/extensions/api/update-extension'
import { ExtensionForm } from '@/features/extensions/components/extension-form'
import { UpdateExtensionForm, updateExtensionFormSchema } from '@/features/extensions/db/schema'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

interface UpdateExtensionProps {
  id: number
}

export function UpdateExtension({ id }: UpdateExtensionProps) {
  const navigate = useNavigate({ from: '/extensions/$extId/edit' })
  const { data: extension } = useSuspenseQuery(extensionQueryOptions(id))

  const { mutate: updateExtension, isPending: isUpdatePending } = useUpdateExtensionMutation(id)
  const { mutate: deleteExtension, isPending: isDeletePending } = useDeleteExtensionMutation(id)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // This receives data where 'categories' is already parsed into an array by the form wrapper
  const handleSubmit = (values: UpdateExtensionForm) => {
    console.log('Submitting parsed values for update:', values)

    updateExtension(values, {
      onSuccess: updatedExtension => {
        toast.success(`Extension "${updatedExtension.name}" updated successfully.`)
        navigate({ to: '/extensions/$extId', params: { extId: id }, replace: true })
      },
      onError: (error: Error) => {
        toast.error('Error updating extension', {
          description: error.message || 'An unknown error occurred.',
        })
      },
    })
  }

  const handleDelete = () => {
    deleteExtension(id, {
      onSuccess: deletedExtensionId => {
        toast.success(`Extension "${deletedExtensionId}" deleted successfully.`)
        setIsDeleteDialogOpen(false)
        navigate({ to: '/', replace: true })
      },
      onError: (error: Error) => {
        toast.error('Failed to delete extension', {
          description: error.message || 'An unknown error occurred.',
        })
        setIsDeleteDialogOpen(false)
      },
    })
  }

  // Prepare default values for the form, stringifying categories
  const defaultFormValues = {
    ...extension,
    categories: extension.categories.map(cat => cat.id),
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate({ to: '/extensions/$extId', params: { extId: id } })}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to view</span>
          </Button>
          <h2 className="text-2xl font-bold">Edit Extension: {extension.name}</h2>
        </div>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={isDeletePending || isUpdatePending}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </Button>
      </div>

      <Suspense fallback={<div>Loading form...</div>}>
        <ExtensionForm
          schema={updateExtensionFormSchema}
          onSubmit={handleSubmit}
          isLoading={isUpdatePending}
          submitButtonText="Save Changes"
          defaultValues={defaultFormValues}
        />
      </Suspense>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        isLoading={isDeletePending}
        itemName={extension.name}
      />
    </div>
  )
}
