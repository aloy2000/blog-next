exports.up = async (knex) => {
    await knex.schema.createTable("roles", (table) => {
        table.increments("id")
        table.text("name").notNullable()
        table.text("autorisation").notNullable()
    })
    await knex.schema.createTable("users", (table) => {
        table.increments("id")
        table.text("lastName").notNullable()
        table.text("name").notNullable()
        table.text("email").notNullable().unique()
        table.text("password").notNullable()
        table.timestamps(true, true, true)
        table.integer("roleId").references("id").inTable("roles").notNullable()

    })
    await knex.schema.createTable("posts", (table) => {
        table.increments("id")
        table.text("title").notNullable()
        table.text("content").notNullable()
        table.text("slug_url").notNullable().unique()
        table.integer("status").notNullable().defaultTo(0)
        table.datetime("publishedAt")
        table.integer("userId").references("id").inTable("users").notNullable()
        table.timestamps(true, true, true)
    })
    await knex.schema.createTable("comments", (table) => {
        table.increments("id")
        table.text("content").notNullable()
        table.integer("userId").references("id").inTable("users").notNullable()
        table.integer("postId").references("id").inTable("posts").notNullable()
        table.timestamps(true, true, true)
    })
    await knex.schema.createTable("tags", (table) => {
        table.increments("id")
        table.text("name").notNullable()
    })
    await knex.schema.createTable("rel_posts__tags", (table) => {
        table.integer("postId").references("id").inTable("posts").notNullable()
        table.integer("tagId").references("id").inTable("tags").notNullable()
    })
}

exports.down = async (knex) => {
    await knex.schema.dropTable("rel_posts__tags")
    await knex.schema.dropTable("tags")
    await knex.schema.dropTable("comments")
    await knex.schema.dropTable("posts")
    await knex.schema.dropTable("users")
    await knex.schema.dropTable("roles")
}
