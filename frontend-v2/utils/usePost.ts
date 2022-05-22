import { useState } from 'react'

export const usePost = (endpoint: string) => {
  const [data, setData] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const doPost = async (formData: any) => {
    const userId = localStorage.getItem('userId')
    const customHeaders = userId
      ? { Authorization: `Bearer ${userId}` }
      : undefined
    setIsLoading(true)
    const response = await fetch(process.env.NEXT_PUBLIC_BASE_URL + endpoint, {
      headers: {
        ...customHeaders,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(formData)
    })
    const json = await response.json()
    setData(json)
  }
  return { data, doPost, isLoading }
}
