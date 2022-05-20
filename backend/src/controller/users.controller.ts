import { Request, Response } from 'express'
import {
  findAllUsers,
  createUser,
  findUserById
} from '../model/user/user.service'

/*
  Important: this controller was left wide
  open to be used for testing purposes.
*/

export const findAll = async (req: Request, res: Response) => {
  const users = await findAllUsers()
  res.send(users)
}

export const findById = async (req: Request, res: Response) => {
  try {
    const user = await findUserById(req.params.id)
    return res.send(user)
  } catch (err) {
    res.statusCode = 404
    res.send()
  }
}

export const create = async (req: Request, res: Response) => {
  const name = req.body.name
  const user = await createUser(name)
  res.send(user)
}

export default {
  findAll,
  create,
  findById
}
