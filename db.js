const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.BANCO_DE_DADOS,
})

module.exports = pool
