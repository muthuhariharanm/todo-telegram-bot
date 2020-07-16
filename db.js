const pg = require('pg')

let dbConnectionUri = process.env.AVGRATING_URI || "postgres://postgres:12345678@localhost:5432/postgres"
const pool = new pg.Pool({ 'connectionString': dbConnectionUri })

const CREATE_SQL = `CREATE TABLE IF NOT EXISTS "teletodo" (
        "msgid" VARCHAR (256),
        "title" VARCHAR (256),
        "description" VARCHAR (256),
        PRIMARY KEY (msgid,title) )`

const tableInitialized = pool.query(CREATE_SQL).then(function () {
	console.log("Database connection established")
}).catch(function (error) {
	console.error(`Could not establish database connection: '${dbConnectionUri}'`)
	console.error(error.stack)
	process.exit(1)
})

module.exports = pool
