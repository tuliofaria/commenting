import { useEffect } from 'react'
import useSWR from 'swr'
import { useAuth } from '../contexts/AuthContext'

const fetcher = (url: string) => {
  const userId = localStorage.getItem('userId')
  const customHeaders = userId
    ? { Authorization: `Bearer ${userId}` }
    : undefined
  return fetch(url, {
    headers: customHeaders
  }).then((r) => r.json())
}

export function useGet<T>(endpoint: string, options?: any) {
  const auth = useAuth()
  const data = useSWR<T>(process.env.NEXT_PUBLIC_BASE_URL + endpoint, fetcher, {
    revalidateOnMount: false,
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    ...options
  })
  const { mutate } = data

  useEffect(() => {
    // refresh data - everytime user signs in/out
    mutate()
  }, [mutate, auth.isAuthenticated])
  return data
}
