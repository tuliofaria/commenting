import { useEffect, useState } from 'react'
import { timeAgo } from '../../utils/datetime'

interface Props {
  date: string
}
const TimeAgo = ({ date }: Props) => {
  const [, setRefresh] = useState<boolean>(false)
  useEffect(() => {
    let timer = setInterval(() => {
      setRefresh((current: boolean) => !current)
    }, 15000)
    return () => {
      clearInterval(timer)
    }
  }, [])
  return <span>{timeAgo(date)}</span>
}
export default TimeAgo
