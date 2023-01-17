const { defineConfig } = require("cypress");
const { Pool } = require("pg");

module.exports = defineConfig({
  viewportWidth: 1440,
  viewportHeight: 900,
  "dbConfig": {
    "host": "peanut.db.elephantsql.com",
    "user": "npjexkhe",
    "password": "RnTt7fM8PJ1Ma6QnhZEwhJj4owAsHGoi",
    "database": "npjexkhe",
    "port": 5432
  },
  e2e: {
    "baseUrl": "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here

      const configJson = require(config.configFile)

      const pool = new Pool(configJson.dbConfig)

      on('task', {
        removeUser(email) {
          return new Promise(function (resolve) {
            pool.query('DELETE FROM public.users WHERE email = $1', [email], function (error, result) {
              if (error) {
                throw error
              }
              resolve({ succes: result })
            })
          })
        },

        findToken(email) {
          return new Promise(function (resolve) {
            pool.query('select B.token from ' +
              'public.users A ' +
              'INNER JOIN public.user_tokens B ' +
              'ON A.id = B.user_id ' +
              'WHERE A.email = $1 ' +
              'ORDER BY B.created_at', [email], function (error, result) {
                if (error) {
                  throw error
                }
                resolve({ token: result.rows[0].token })
              })
          })
        }

      })
    },
  },
});