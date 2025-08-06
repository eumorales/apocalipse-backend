const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

// Middlewares globais
app.use(cors())
app.use(express.json())

// Rotas da aplicação
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/cadeiras', require('./routes/cadeiras.routes'))
app.use('/api/atividades', require('./routes/atividades.routes'))

// Rota base (opcional)
app.get('/', (req, res) => {
  res.send('🚀 API testada com sucesso, rapaz!')
})

// Inicializa o servidor
const PORT = process.env.PORTA || 5000
app.listen(PORT, () => {
  console.log('✅ Servidor rodando na porta ${PORT}')
})
