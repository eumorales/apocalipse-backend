const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rotas
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/cadeiras', require('./routes/cadeiras.routes'))
app.use('/api/atividades', require('./routes/atividades.routes'))
app.get('/', (req, res) => {
  res.send('☠️ API bombando!')
})

const PORT = process.env.PORTA || 5000
app.listen(PORT, () => {
  console.log('✅ Servidor rodando na porta ${PORT}')
})
