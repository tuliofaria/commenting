import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`)
  await knex.schema.createTable('users', function (table) {
    table
      .uuid('id')
      .unique()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.string('name').notNullable()
  })

  await knex.schema.createTable('comments', function (table) {
    table
      .uuid('id')
      .unique()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('commenter_id').notNullable().references('id').inTable('users')
    table.string('comment').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.integer('upvotes').defaultTo(0)
  })
  await knex.schema.createTable('upvotes', function (table) {
    table
      .uuid('id')
      .unique()
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'))
    table.uuid('upvoter_id').notNullable().references('id').inTable('users')
    table.uuid('comment_id').notNullable().references('id').inTable('comments')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('upvotes')
  await knex.schema.dropTable('comments')
  await knex.schema.dropTable('users')
}
