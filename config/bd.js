const config = require('../knexfile.js')
const knex = require('knex')(config)

/* criacao das tablelas */
knex.migrate.latest([config])

module.exports = knex 