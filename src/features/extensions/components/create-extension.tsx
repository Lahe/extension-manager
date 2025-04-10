import { Button } from '@/components/ui/button'
import { useCreateExtensionMutation } from '@/features/extensions/api/create-extension'
import { ExtensionForm } from '@/features/extensions/components/extension-form'
import { createExtensionWithCategoriesSchema, NewExtension } from '@/features/extensions/db/schema'
import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'

export function CreateExtension() {
  const navigate = useNavigate()
  const { mutate: createExtension, isPending } = useCreateExtensionMutation()

  const handleSubmit = (extension: NewExtension) => {
    createExtension(extension)
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-start">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate({ to: '/' })}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to list</span>
        </Button>
        <h2 className="text-2xl font-bold">Create New Extension</h2>
      </div>
      <Suspense fallback={<div>Loading form...</div>}>
        <ExtensionForm
          schema={createExtensionWithCategoriesSchema}
          onSubmit={handleSubmit}
          isLoading={isPending}
          submitButtonText="Create Extension"
          defaultValues={{ name: '', description: '', logo: '', categories: [] }}
        />
      </Suspense>
    </div>
  )
}
