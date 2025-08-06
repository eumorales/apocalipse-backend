const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')
require('dotenv').config()

const router = express.Router()

// Registro 
router.post('/registrar', async (req, res) => {
  const { nome, email, senha, role } = req.body

  try {
    const existe = await db.query('SELECT id FROM usuarios WHERE email = $1', [
      email,
    ])
    if (existe.rows.length > 0) {
      return res.status(400).json({ erro: 'Email já cadastrado.' })
    }

    const hash = await bcrypt.hash(senha, 10)
    const novo = await db.query(
      'INSERT INTO usuarios (nome, email, senha, role) VALUES ($1, $2, $3, $4) RETURNING id, nome, email, role',
      [nome, email, hash, role || 'membro']
    )

    res.status(201).json(novo.rows[0])
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao registrar usuário.' })
  }
})

// Login 
router.post('/login', async (req, res) => {
  const { email, senha } = req.body

  try {
    const resultado = await db.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    )
    if (resultado.rows.length === 0) {
      return res.status(401).json({ erro: 'Usuário não encontrado.' })
    }

    const usuario = resultado.rows[0]
    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta.' })
    }

    const token = jwt.sign(
      { id: usuario.id, role: usuario.role },
      process.env.JWT_SUPER_SECRETO,
      { expiresIn: '7d' }
    )

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role,
      },
    })
  } catch (err) {
    res.status(500).json({ erro: 'Erro no login.' })
  }
})

module.exports = router
