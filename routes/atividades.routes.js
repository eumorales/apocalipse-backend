const express = require('express')
const db = require('../db')
const auth = require('../middleware/auth')
const router = express.Router()

// Listar atividades visíveis ao usuário
router.get('/', auth, async (req, res) => {
  try {
    const query = `
      SELECT a.*, 
        CASE 
          WHEN ac.usuario_id IS NOT NULL THEN 'concluida' 
          ELSE 'pendente' 
        END AS status_pessoal
      FROM atividades a
      LEFT JOIN atividade_visibilidade v ON a.id = v.atividade_id
      LEFT JOIN atividades_concluidas ac ON a.id = ac.atividade_id AND ac.usuario_id = $1
      WHERE a.visibilidade_geral = true OR v.usuario_id = $1
      ORDER BY a.data_entrega;
    `
    const resultado = await db.query(query, [req.user.id])
    res.json(resultado.rows)
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar atividades.' })
  }
})

// Criar nova atividade (apenas admin)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res
      .status(403)
      .json({ erro: 'Apenas administradores podem criar atividades.' })
  }

  const {
    titulo,
    tipo,
    descricao,
    data_entrega,
    status,
    cadeira_id,
    visibilidade_geral,
    membros,
  } = req.body

  try {
    const nova = await db.query(
      `INSERT INTO atividades (titulo, tipo, descricao, data_entrega, status, cadeira_id, visibilidade_geral, criada_por)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        titulo,
        tipo,
        descricao,
        data_entrega,
        status || 'pendente',
        cadeira_id,
        visibilidade_geral,
        req.user.id,
      ]
    )

    const atividadeId = nova.rows[0].id

    if (!visibilidade_geral && Array.isArray(membros)) {
      for (const usuario_id of membros) {
        await db.query(
          'INSERT INTO atividade_visibilidade (atividade_id, usuario_id) VALUES ($1, $2)',
          [atividadeId, usuario_id]
        )
      }
    }

    res.status(201).json({ id: atividadeId })
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao criar atividade.' })
  }
})

module.exports = router
