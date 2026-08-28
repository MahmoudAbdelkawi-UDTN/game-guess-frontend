import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type PasswordInputProps = React.ComponentProps<typeof Input>

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input type={visible ? 'text' : 'password'} className={cn('pr-10', className)} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-0 right-0 h-full px-3 text-muted-foreground hover:bg-transparent hover:text-foreground"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        tabIndex={-1}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </Button>
    </div>
  )
}
