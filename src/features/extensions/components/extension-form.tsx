import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import { categoriesQueryOptions } from '@/features/extensions/api/get-categories'
import { Category } from '@/features/extensions/db/schema'
import { cn } from '@/utils/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { ChevronsUpDown, Loader2, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { DeepPartial, Path, useForm } from 'react-hook-form'
import { z, ZodTypeAny } from 'zod'

interface ExtensionFormProps<T extends ZodTypeAny, TFormData extends z.infer<T>> {
  schema: T
  onSubmit: (data: TFormData) => void
  defaultValues?: DeepPartial<TFormData>
  isLoading?: boolean
  submitButtonText?: string
  isUpdateForm?: boolean
}

export function ExtensionForm<T extends ZodTypeAny, TFormData extends z.infer<T>>({
  schema,
  onSubmit,
  defaultValues,
  isLoading = false,
  submitButtonText = 'Save Extension',
  isUpdateForm = false,
}: ExtensionFormProps<T, TFormData>) {
  const { data: categories = [] } = useSuspenseQuery(categoriesQueryOptions())

  const form = useForm<TFormData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues,
  })

  const handleFormSubmit = (values: TFormData) => {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {isUpdateForm && (
          <FormField
            control={form.control}
            // Assertion is safe because of the conditional render check above
            name={'id' as Path<TFormData>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input {...field} readOnly disabled className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name={'name' as Path<TFormData>}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Extension" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'description' as Path<TFormData>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what the extension does..."
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={'logo' as Path<TFormData>}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="gap-1">
                Logo URL <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormDescription>Enter the full URL for the extension logo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Category Selector */}
        <FormField
          control={form.control}
          name={'categories' as Path<TFormData>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <CategorySelector
                categories={categories}
                selectedIds={field.value ?? []}
                onChange={field.onChange}
                disabled={isLoading}
              />
              <FormDescription>
                Select categories. Click &#39;x&#39; to remove a category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {isUpdateForm && (
          <FormField
            control={form.control}
            name={'isActive' as Path<TFormData>}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active</FormLabel>
                  <FormDescription>
                    Is this extension currently active and available?
                  </FormDescription>
                </div>
                <FormControl>
                  <Checkbox checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitButtonText}
        </Button>
      </form>
    </Form>
  )
}

interface CategorySelectorProps {
  categories: Category[]
  selectedIds: number[]
  onChange: (newIds: number[]) => void
  disabled?: boolean
}

const CategorySelector = ({
  categories = [],
  selectedIds = [],
  onChange,
  disabled = false,
}: CategorySelectorProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false)
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds])

  const selectedCategories = useMemo(() => {
    return categories.filter(category => selectedIdSet.has(category.id))
  }, [categories, selectedIdSet])

  const availableCategories = useMemo(() => {
    return categories.filter(category => !selectedIdSet.has(category.id))
  }, [categories, selectedIdSet])

  const handleRemoveCategory = (categoryId: number) => {
    onChange(selectedIds.filter(id => id !== categoryId))
  }

  const handleAddCategory = (categoryId: number) => {
    onChange([...selectedIds, categoryId])
  }

  return (
    <div className="space-y-2">
      <div className="border-input flex min-h-[40px] flex-wrap items-center gap-2 rounded-md border p-2">
        {selectedCategories.length === 0 && (
          <span className="text-muted-foreground text-sm">No categories selected.</span>
        )}
        {selectedCategories.map(category => (
          <Badge key={category.id} variant="secondary" className="flex items-center gap-1">
            {category.name}
            <button
              type="button"
              disabled={disabled}
              onClick={() => handleRemoveCategory(category.id)}
              className="hover:bg-destructive/20 focus:ring-ring rounded-full p-0.5 focus:ring-1 focus:outline-none disabled:opacity-50"
              aria-label={`Remove ${category.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      {/* --- Searchable Select (Combobox) --- */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={popoverOpen}
            className={cn(
              'w-full justify-between',
              selectedIds.length === 0 && 'text-muted-foreground'
            )}
            disabled={availableCategories.length === 0 || disabled}
          >
            {availableCategories.length > 0 ? 'Select categories...' : 'All categories selected'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandList>
              <CommandEmpty>No categories found.</CommandEmpty>
              <CommandGroup>
                {availableCategories.map(category => (
                  <CommandItem
                    key={category.id}
                    value={category.name}
                    onSelect={() => handleAddCategory(category.id)}
                  >
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
