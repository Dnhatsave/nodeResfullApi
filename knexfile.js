// Update with your config settings.

module.exports = {


    client: 'mysql',
    connection: {
      database: 'backend_vue',
      user:     'root',
      password: 'root',
      port: '8889'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }

};
