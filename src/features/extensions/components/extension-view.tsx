import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { extensionQueryOptions } from '@/features/extensions/api/get-extension'
import { cn } from '@/utils/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Pencil } from 'lucide-react'

interface ExtensionViewProps {
  id: number
}

export function ExtensionView({ id }: ExtensionViewProps) {
  const navigate = useNavigate({ from: '/extensions/$extId' })
  const { data: extension } = useSuspenseQuery(extensionQueryOptions(id))

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back to list</span>
        </Button>
        <h2 className="text-2xl font-bold">Extension Details</h2>
        <Link to="/extensions/$extId/edit" params={{ extId: id }}>
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {extension.logo && (
              <img
                src={extension.logo}
                alt={extension.name}
                className="h-16 w-16 rounded-md object-contain"
              />
            )}
            <div>
              <CardTitle className="text-3xl">{extension.name}</CardTitle>
              <CardDescription className="mt-1">ID: {extension.id}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="text-muted-foreground">
              {extension.description || 'No description provided.'}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Status</h3>
            <Badge variant={extension.isActive ? 'default' : 'secondary'}>
              {extension.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {extension.categories.map(category => (
                <Badge key={category.name} className={cn('text-foreground py-1', category.color)}>
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
          {/* Add other fields if necessary */}
        </CardContent>
      </Card>
    </div>
  )
}
