import User from './user'

export const findAllUsers = async () => {
  return await User.fetchAll()
}

export const findUserById = async (id: string) => {
  return await new User().where({ id }).fetch()
}

export const createUser = async (name: string) => {
  const user = new User({ name })
  return await user.save()
}
