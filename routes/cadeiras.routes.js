const express = require('express')
const db = require('../db')
const auth = require('../middleware/auth')
const router = express.Router()

// Listar todas as cadeiras
router.get('/', auth, async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM cadeiras ORDER BY nome')
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar cadeiras.' })
  }
})

// Criar nova cadeira (apenas admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ erro: 'Apenas administradores podem criar cadeiras.' })
  }

  const { nome } = req.body

  try {
    const resultado = await db.query(
      'INSERT INTO cadeiras (nome, criada_por) VALUES ($1, $2) RETURNING *',
      [nome, req.user.id]
    )
    res.status(201).json(resultado.rows[0])
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar cadeira.' })
  }
})

module.exports = router
