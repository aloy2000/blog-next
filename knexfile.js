const { resolve } = require("node:path")
const { config } = require("dotenv")

config()

const knexfile = {
  client: "pg",
  connection: {
    host: process.env.DB__CONNECTION__HOST,
    port: process.env.DB__CONNECTION__PORT,
    user: process.env.DB__CONNECTION__USER,
    password: process.env.DB__CONNECTION__PASSWORD,
    database: process.env.DB__CONNECTION__DATABASE,
  },
  migrations: {
    directory: resolve("src/api/db/migrations"),
    stub: resolve("src/api/db/migration.stub"),
  },
}

module.exports = knexfile
