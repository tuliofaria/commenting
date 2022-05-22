import { Router } from 'express'
import CommentsController from './controller/comments.controller'
import UsersController from './controller/users.controller'

const router = Router()

router.get('/users', UsersController.findAll)
router.post('/users', UsersController.create)
router.get('/users/:id', UsersController.findById)

router.get('/comments', CommentsController.findAll)
router.post('/comments', CommentsController.create)
router.get('/comments/:id', CommentsController.findById)
router.post('/comments/:id/comments', CommentsController.createReply)
router.post('/comments/:id/upvote', CommentsController.upvote)

export default router
