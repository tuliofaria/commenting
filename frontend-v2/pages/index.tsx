import type { NextPage } from 'next'
import Head from 'next/head'
import Comment, { IComment } from '../components/Comment'
import Discussions from '../components/Discussions'
import { useGet } from '../utils/useGet'

import DebugArea from '../components/DebugArea'
import Alert from '../components/Alert'
import { useAuth } from '../contexts/AuthContext'
import NewDiscussion from '../components/NewDiscussion'
import { useRealtime } from '../contexts/RealtimeContext'
import { useEffect } from 'react'
import Divider from '../components/Divider'

const Home: NextPage = () => {
  const { data, mutate } = useGet<IComment[]>('/comments')
  const auth = useAuth()
  const realtime = useRealtime()
  useEffect(() => {
    realtime.subscribeTo('comments', () => {
      mutate()
    })
    return () => {
      realtime.unsubscribeFrom('comments')
    }
  }, [realtime, mutate])
  return (
    <div>
      <Head>
        <title>Commenting React-version + Real-time updates</title>
        <meta name='description' content='Commenting' />
      </Head>
      <DebugArea />
      <Discussions>
        <h3 className='discussion-title'>Discussion</h3>
        {!auth.isAuthenticated && (
          <Alert>You need to be signed-in in order to comment.</Alert>
        )}
        {auth.isAuthenticated && <NewDiscussion />}
        <Divider />
        {data?.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </Discussions>
    </div>
  )
}

export default Home
