import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { extensionsQueryOptions } from '@/features/extensions/api/get-extensions'
import { useToggleExtensionMutation } from '@/features/extensions/api/update-extension'
import { Category, ExtensionWithCategories } from '@/features/extensions/db/schema'
import { cn } from '@/utils/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

export function ExtensionList() {
  const { data: extensions } = useSuspenseQuery(extensionsQueryOptions())
  const { mutate: toggleExtension, isPending } = useToggleExtensionMutation()
  const [filter, setFilter] = useState('all')

  // Filter extensions based on the selected filter
  const filteredExtensions = extensions.filter((extension: ExtensionWithCategories) => {
    if (filter === 'all') return true
    if (filter === 'active') return extension.isActive
    if (filter === 'inactive') return !extension.isActive
    return true
  })

  const handleToggle = (extension: ExtensionWithCategories) => {
    toggleExtension({
      id: extension.id,
      isActive: !extension.isActive,
    })
  }

  return (
    <div className="container py-8">
      {/* Header with title and filter buttons */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">Extensions List</h2>
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={value => value && setFilter(value)}
            className="*:border-secondary *:border *:px-3 *:py-2"
          >
            <ToggleGroupItem value="all">All</ToggleGroupItem>
            <ToggleGroupItem value="active">Active</ToggleGroupItem>
            <ToggleGroupItem value="inactive">Inactive</ToggleGroupItem>
          </ToggleGroup>
          <Link to="/extensions/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Extension
            </Button>
          </Link>
        </div>
      </div>

      {/* Extensions grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExtensions.map(extension => (
          <Link
            key={extension.id}
            to="/extensions/$extId"
            params={{
              extId: extension.id,
            }}
          >
            <Card
              key={extension.id}
              className="hover:border-primary/50 gap-4 overflow-hidden border transition-colors"
            >
              <CardHeader>
                <div className="flex gap-4">
                  <div className="shrink-0 text-5xl" aria-hidden="true">
                    {extension.logo && (
                      <img
                        src={extension.logo}
                        alt={extension.name}
                        className="h-12 w-12 object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <CardTitle>{extension.name}</CardTitle>
                    {extension.description && (
                      <CardDescription className="mt-1 line-clamp-2 min-h-10">
                        {extension?.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-1">
                {extension.categories.map((category: Category) => (
                  <Badge key={category.name} className={cn('text-foreground py-1', category.color)}>
                    {category.name}
                  </Badge>
                ))}
              </CardContent>

              <CardFooter className="text-muted-foreground mt-auto flex justify-end pt-0 text-sm">
                <div onClick={e => e.preventDefault()} className="flex items-center space-x-2">
                  <span className="text-muted-foreground text-sm">
                    {extension.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <Switch
                    checked={extension.isActive}
                    onCheckedChange={() => handleToggle(extension)}
                    disabled={isPending}
                    aria-label={`${extension.isActive ? 'Disable' : 'Enable'} ${extension.name}`}
                  />
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {filteredExtensions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-lg font-medium">No extensions found</p>
          <p className="text-muted-foreground">Try changing your filter or adding new extensions</p>
        </div>
      )}
    </div>
  )
}
