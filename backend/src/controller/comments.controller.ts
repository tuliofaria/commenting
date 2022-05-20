import { Request, Response } from 'express'
import {
  createComment,
  findAllComments,
  upvoteComment
} from '../model/comment/comment.service'

export const findAll = async (req: Request, res: Response) => {
  const users = await findAllComments()
  res.send(users)
}

export const create = async (req: Request, res: Response) => {
  const comment = req.body.comment
  const userId = req.headers?.authorization?.split(' ')[1]
  console.log(userId, comment)
  if (userId && comment) {
    const user = await createComment(userId as string, comment)
    return res.send(user)
  }
  return res.status(401).send()
}

export const upvote = async (req: Request, res: Response) => {
  const commenterId = req.body.commenterId
  const action = req.body.action
  const id = req.params.id
  const upvote = await upvoteComment(id, action, commenterId)
  res.send({
    a: true
  })
}

export default {
  findAll,
  create,
  upvote
}
