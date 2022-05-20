import { Request, Response } from 'express'
import {
  createComment,
  findAllComments,
  findAllCommentsSignedIn,
  upvoteComment
} from '../model/comment/comment.service'

export const findAll = async (req: Request, res: Response) => {
  const auth = req?.headers?.['authorization']?.split(' ')?.[1]
  if (!auth) {
    const comments = await findAllComments()
    return res.send(comments)
  }
  const comments = await findAllCommentsSignedIn(auth as string)
  return res.send(comments)
}

export const create = async (req: Request, res: Response) => {
  const comment = req.body.comment
  const auth = req.headers?.authorization?.split(' ')[1]
  if (auth && comment) {
    const user = await createComment(auth as string, comment)
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
  res.send({
    upvote
  })
}

export default {
  findAll,
  create,
  upvote
}
