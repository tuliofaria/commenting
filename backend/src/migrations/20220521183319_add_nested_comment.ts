import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('comments', function (table) {
    table.uuid('comment_id').nullable().references('id').inTable('comments')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('upvotes', function (table) {
    table.dropColumn('comment_id')
  })
}
