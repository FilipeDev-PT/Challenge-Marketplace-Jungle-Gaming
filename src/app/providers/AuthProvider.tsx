import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authApi } from '@/shared/api/services'
import { queryKeys } from '@/shared/api/query-keys'
import type { Session, User } from '@/shared/api/contracts'
import { isApiError } from '@/shared/api/errors'
import { clearPrivateStorage, setStoredToken, getStoredToken } from '@/shared/lib/session-storage'
type AuthContextValue = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<Session>
  register: (input: { name: string; email: string; password: string }) => Promise<Session>
  logout: () => Promise<void>
  setSessionFromToken: (session: Session) => void
}
const AuthContext = createContext<AuthContextValue | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [hasToken, setHasToken] = useState(() => Boolean(getStoredToken()))
  const sessionQuery = useQuery({
    queryKey: queryKeys.session,
    queryFn: ({ signal }) => authApi.session(signal),
    enabled: hasToken,
    staleTime: 60000,
    retry: false,
  })
  const applySession = useCallback(
    (session: Session | null) => {
      if (session) {
        setStoredToken(session.token)
        setHasToken(true)
        queryClient.setQueryData(queryKeys.session, session)
      } else {
        setStoredToken(null)
        setHasToken(false)
        queryClient.setQueryData(queryKeys.session, null)
      }
    },
    [queryClient],
  )
  const commitSession = useCallback(
    async (session: Session) => {
      applySession(session)
      await queryClient.invalidateQueries()
    },
    [applySession, queryClient],
  )
  useEffect(() => {
    if (isApiError(sessionQuery.error) && sessionQuery.error.code === 'unauthorized') {
      clearPrivateStorage()
      setHasToken(false)
      queryClient.setQueryData(queryKeys.session, null)
      queryClient.removeQueries({ queryKey: queryKeys.session })
      toast.error('Sessão expirada. Entre novamente.')
      return
    }
    if (
      hasToken &&
      sessionQuery.isFetched &&
      sessionQuery.data === null &&
      !sessionQuery.isFetching
    ) {
      clearPrivateStorage()
      setHasToken(false)
      queryClient.setQueryData(queryKeys.session, null)
      queryClient.removeQueries({ queryKey: queryKeys.session })
      toast.error('Sessão expirada. Entre novamente.')
    }
  }, [
    sessionQuery.error,
    sessionQuery.data,
    sessionQuery.isFetched,
    sessionQuery.isFetching,
    hasToken,
    queryClient,
  ])
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login({ email, password }),
  })
  const registerMutation = useMutation({
    mutationFn: (input: { name: string; email: string; password: string }) =>
      authApi.register(input),
  })
  const logout = useCallback(async () => {
    clearPrivateStorage()
    setHasToken(false)
    queryClient.setQueryData(queryKeys.session, null)
    await queryClient.cancelQueries()
    queryClient.removeQueries({ queryKey: queryKeys.session })
    try {
      await authApi.logout()
    } catch {}
    queryClient.clear()
    queryClient.setQueryData(queryKeys.session, null)
    toast.message('Sessão encerrada')
  }, [queryClient])
  const session = hasToken ? (sessionQuery.data ?? null) : null
  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      isLoading: hasToken && sessionQuery.isLoading,
      isAuthenticated: Boolean(session?.user),
      login: async (email, password) => {
        const next = await loginMutation.mutateAsync({ email, password })
        await commitSession(next)
        return next
      },
      register: async (input) => {
        const next = await registerMutation.mutateAsync(input)
        await commitSession(next)
        return next
      },
      logout,
      setSessionFromToken: applySession,
    }),
    [
      session,
      hasToken,
      sessionQuery.isLoading,
      loginMutation,
      registerMutation,
      logout,
      applySession,
      commitSession,
    ],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
