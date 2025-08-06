const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  connectionString: process.env.BANCO_DE_DADOS,
});

client
  .connect()
  .then(() => {
    console.log("✅ Conectado com sucesso ao banco de dados PostgreSQL!");
    return client.query("SELECT NOW()");
  })
  .then((result) => {
    console.log("🕒 Data e hora do servidor PostgreSQL:", result.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ Erro ao conectar ao banco de dados:", err.message);
  })
  .finally(() => {
    client.end();
  });
