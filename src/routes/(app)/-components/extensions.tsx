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
import { Download, Star } from 'lucide-react'
import { useState } from 'react'

export function Extensions() {
  const [filter, setFilter] = useState('all')

  const extensions = [
    {
      id: 1,
      name: 'Ad Blocker Pro',
      description: 'Block intrusive ads and trackers while browsing',
      rating: 4.7,
      downloads: '2.5M',
      isActive: true,
      category: 'Privacy',
      icon: '🛡️',
    },
    {
      id: 2,
      name: 'Dark Reader',
      description: 'Dark mode for every website to protect your eyes',
      rating: 4.8,
      downloads: '5M',
      isActive: true,
      category: 'Accessibility',
      icon: '🌙',
    },
    {
      id: 3,
      name: 'Grammar Checker',
      description: 'Check spelling and grammar as you type',
      rating: 4.3,
      downloads: '1.2M',
      isActive: false,
      category: 'Productivity',
      icon: '✓',
    },
    {
      id: 4,
      name: 'Password Manager',
      description: 'Securely store and autofill your passwords',
      rating: 4.9,
      downloads: '3.8M',
      isActive: true,
      category: 'Security',
      icon: '🔒',
    },
    {
      id: 5,
      name: 'Screenshot Tool',
      description: 'Capture, annotate and share screenshots',
      rating: 4.5,
      downloads: '1.5M',
      isActive: false,
      category: 'Utility',
      icon: '📸',
    },
    {
      id: 6,
      name: 'Translator',
      description: 'Translate text on any webpage instantly',
      rating: 4.6,
      downloads: '4.2M',
      isActive: true,
      category: 'Language',
      icon: '🌐',
    },
  ]

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
            className="hover:border-primary/50 overflow-hidden border transition-colors"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-2xl" aria-hidden="true">
                    {extension.icon}
                  </div>
                  <CardTitle>{extension.name}</CardTitle>
                </div>
                <Switch
                  checked={extension.isActive}
                  onCheckedChange={() => handleToggle(extension.id)}
                  aria-label={`${extension.isActive ? 'Disable' : 'Enable'} ${extension.name}`}
                />
              </div>
              <CardDescription className="mt-1 line-clamp-2">
                {extension.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-2">
              <Badge variant={extension.isActive ? 'default' : 'outline'} className="mb-2 py-1">
                {extension.category}
              </Badge>
            </CardContent>

            <CardFooter className="text-muted-foreground flex justify-between pt-0 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-500" />
                <span>{extension.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>{extension.downloads}</span>
              </div>
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
