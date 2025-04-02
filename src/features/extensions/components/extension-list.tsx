import { Badge } from '@/components/ui/badge'
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
import { cn } from '@/utils/utils'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function ExtensionList() {
  const { data: extensions } = useSuspenseQuery(extensionsQueryOptions())
  const [filter, setFilter] = useState('all')

  // Filter extensions based on the selected filter
  const filteredExtensions = extensions.filter(extension => {
    if (filter === 'all') return true
    if (filter === 'active') return extension.isActive
    if (filter === 'inactive') return !extension.isActive
    return true
  })

  const handleToggle = (id: number) => {
    // This would update the state in a real application
    console.log(`Toggled extension ${id}`)
  }

  return (
    <div className="container py-8">
      {/* Header with title and filter buttons */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold">Extensions List</h2>

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
      </div>

      {/* Extensions grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredExtensions.map(extension => (
          <Card
            key={extension.id}
            className="hover:border-primary/50 gap-4 overflow-hidden border transition-colors"
          >
            <CardHeader>
              <div className="flex gap-4">
                <div className="text-5xl" aria-hidden="true">
                  <img src={extension.logo} alt={extension.name} />
                </div>
                <div className="flex flex-col gap-2">
                  <CardTitle>{extension.name}</CardTitle>
                  {extension.description && (
                    <CardDescription className="mt-1 line-clamp-2">
                      {extension?.description}
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex flex-wrap gap-1">
              {extension.categories.map(category => (
                <Badge
                  key={category.name}
                  variant={extension.isActive ? 'default' : 'outline'}
                  className={cn('py-1', category.color)}
                >
                  {category.name}
                </Badge>
              ))}
            </CardContent>

            <CardFooter className="text-muted-foreground flex justify-end pt-0 text-sm">
              <Switch
                checked={extension.isActive}
                onCheckedChange={() => handleToggle(extension.id)}
                aria-label={`${extension.isActive ? 'Disable' : 'Enable'} ${extension.name}`}
              />
            </CardFooter>
          </Card>
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
