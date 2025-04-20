import { userQueryOptions } from '@/features/auth/api/get-user'
import { LoginFormData, SignupFormData } from '@/features/auth/schemas'
import { authClient } from '@/lib/auth-client'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

export const useAuth = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const queryKey = userQueryOptions().queryKey
  const router = useRouter()

  const signup = async (data: SignupFormData) =>
    await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
      fetchOptions: {
        onSuccess: async () => {
          toast.success('Successfully created an account.')
          await queryClient.invalidateQueries({ queryKey })
          await navigate({ to: '/' })
        },
        onError: ({ error }) => {
          toast.error('Signup failed.', {
            description: error.message,
          })
        },
      },
    })

  const login = async (data: LoginFormData) =>
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      fetchOptions: {
        onSuccess: async () => {
          toast.success('Login successful.')
          await queryClient.invalidateQueries({ queryKey })
          await navigate({ to: '/' })
        },
        onError: ({ error }) => {
          toast.error('Login failed.', {
            description: error.message,
          })
        },
      },
    })

  const loginSocial = async (provider: 'github') => {
    await authClient.signIn.social({
      provider,
    })
  }

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey })
          await router.invalidate()
          await navigate({ to: '/' })
        },
      },
    })
  }

  return {
    login,
    signup,
    loginSocial,
    logout,
  }
}
