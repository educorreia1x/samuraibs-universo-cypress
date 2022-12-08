const { defineConfig } = require("cypress");
const { Pool } = require("pg");

module.exports = defineConfig({
  viewportWidth: 1440,
  viewportHeight: 900,
  e2e: {
    "baseUrl": "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here

      const pool = new Pool({
        host: 'peanut.db.elephantsql.com',
        user: 'npjexkhe',
        password: 'RnTt7fM8PJ1Ma6QnhZEwhJj4owAsHGoi',
        database: 'npjexkhe',
        port: 5432
      })

      on('task', {
        removeUser(email) {
          return new Promise(function (resolve) {
            pool.query('DELETE FROM public.users WHERE email = $1', [email], function (error, result) {
              if (error) {
                throw error
              }
              resolve({succes: result})
            })
          })
        }
      })
    },
  },
});