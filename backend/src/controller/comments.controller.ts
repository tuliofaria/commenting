import { Request, Response } from 'express'
import {
  createComment,
  createCommentReply,
  findAllComments,
  findAllCommentsSignedIn,
  findCommentById,
  findCommentByIdSignedIn,
  upvoteComment
} from '../model/comment/comment.service'
import { getIo } from '../lib/socketio'

export const findAll = async (req: Request, res: Response) => {
  const auth = req?.headers?.['authorization']?.split(' ')?.[1]
  if (!auth) {
    const comments = await findAllComments()
    return res.send(comments)
  }
  const comments = await findAllCommentsSignedIn(auth as string)
  return res.send(comments)
}

export const findById = async (req: Request, res: Response) => {
  const auth = req?.headers?.['authorization']?.split(' ')?.[1]
  const id = req.params.id
  if (!auth) {
    const comment = await findCommentById(id)
    return res.send(comment)
  }
  const comment = await findCommentByIdSignedIn(id, auth as string)
  return res.send(comment)
}

export const create = async (req: Request, res: Response) => {
  const commentContent = req.body.comment
  const auth = req.headers?.authorization?.split(' ')[1]
  if (auth && commentContent) {
    const comment = await createComment(auth as string, commentContent)
    // notify sockets
    if (getIo) {
      // @ts-ignore
      getIo().emit('comments', {
        action: 'commentCreated'
      })
    }
    return res.send(comment)
  }
  return res.status(401).send()
}

export const createReply = async (req: Request, res: Response) => {
  const comment = req.body.comment
  const parentComment = req.params.id
  const auth = req.headers?.authorization?.split(' ')[1]
  if (auth && comment) {
    const user = await createCommentReply(
      auth as string,
      parentComment,
      comment
    )
    if (getIo) {
      // @ts-ignore
      getIo().emit('comment-' + parentComment, {
        action: 'upvoted'
      })
    }
    return res.send(user)
  }
  return res.status(401).send()
}

export const upvote = async (req: Request, res: Response) => {
  const auth = req?.headers?.['authorization']?.split(' ')?.[1]
  if (!auth) {
    return res.sendStatus(401)
  }
  const commenterId = auth
  const action = req.body.action
  const id = req.params.id
  const upvote = await upvoteComment(id, action, commenterId)

  // notify sockets
  if (getIo) {
    // @ts-ignore
    getIo().emit('comment-' + id, {
      action: 'upvoted'
    })
  }

  res.send({
    upvote
  })
}

export default {
  findAll,
  create,
  createReply,
  upvote,
  findById
}
