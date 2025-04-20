import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/api/use-auth'
import { LoginFormData, loginSchema } from '@/features/auth/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Github } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function Login() {
  const { login, loginSocial } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true)
    await login(data)
    setIsSubmitting(false)
  }

  const handleGitHubLogin = async () => {
    setIsSubmitting(true)
    await loginSocial('github')
    setIsSubmitting(false)
  }

  return (
    <div className="bg-background container flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="m@example.com" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                type="button"
                onClick={handleGitHubLogin}
                disabled={isSubmitting}
              >
                <Github className="mr-2 h-4 w-4" />
                Login with Github
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-center space-y-2">
              <div className="text-muted-foreground text-sm">
                Don&#39;t have an account?
                <Button variant="link" asChild className="h-auto p-0 font-semibold">
                  <Link to="/signup">Sign up</Link>
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
