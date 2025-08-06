-- Tabela de usuários
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'membro' -- 'admin' ou 'membro'
);

-- Tabela de cadeiras (disciplinas)
CREATE TABLE cadeiras (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  criada_por INT REFERENCES usuarios(id)
);

-- Tabela de atividades
CREATE TABLE atividades (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  tipo VARCHAR(50),
  descricao TEXT,
  data_entrega DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pendente',
  cadeira_id INTEGER REFERENCES cadeiras(id) ON DELETE CASCADE,
  criada_por INTEGER REFERENCES usuarios(id),
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  visibilidade_geral BOOLEAN DEFAULT true
);

-- Tabela de visibilidade personalizada
CREATE TABLE atividade_visibilidade (
  id SERIAL PRIMARY KEY,
  atividade_id INTEGER REFERENCES atividades(id) ON DELETE CASCADE,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE (atividade_id, usuario_id)
);

-- Tabela de atividades concluídas por usuário
CREATE TABLE atividades_concluidas (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  atividade_id INTEGER REFERENCES atividades(id) ON DELETE CASCADE,
  data_conclusao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (usuario_id, atividade_id)
);
