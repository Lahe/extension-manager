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
    await authClient.signUp.email(
      {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: async () => {
          toast.success('Successfully created an account.')
          await queryClient.invalidateQueries({ queryKey })
          await navigate({ to: '/' })
        },
        onError: () => {
          toast.error('Signup failed.', {
            description: 'Please check your email and password and try again.',
          })
        },
      }
    )

  const login = async (data: LoginFormData) =>
    await authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: async () => {
          toast.success('Login successful.')
          await queryClient.invalidateQueries({ queryKey })
          await navigate({ to: '/' })
        },
        onError: () => {
          toast.error('Login failed.', {
            description: 'Please check your email and password and try again.',
          })
        },
      }
    )

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
