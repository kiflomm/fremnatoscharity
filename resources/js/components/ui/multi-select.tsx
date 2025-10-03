import * as React from "react"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

interface MultiSelectProps {
  options: Array<{ value: string; label: string }>
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  className,
  disabled = false,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (currentValue: string) => {
    if (value.includes(currentValue)) {
      onChange(value.filter((item) => item !== currentValue))
    } else {
      onChange([...value, currentValue])
    }
  }

  const handleRemove = (valueToRemove: string) => {
    onChange(value.filter((item) => item !== valueToRemove))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between min-h-10 h-auto",
            !value.length && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {value.length > 0 ? (
              value.map((val) => {
                const option = options.find((opt) => opt.value === val)
                return (
                  <Badge
                    key={val}
                    variant="secondary"
                    className="mr-1 mb-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(val)
                    }}
                  >
                    {option?.label || val}
                    <XIcon className="ml-1 h-3 w-3" />
                  </Badge>
                )
              })
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => handleSelect(option.value)}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
