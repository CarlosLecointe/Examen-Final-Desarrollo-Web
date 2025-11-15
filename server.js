// server.js
const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de SQL Server
const dbConfig = {
    user: 'usr_DesaWebDevUMG',
    password: '!ngGuast@360',
    server: 'svr-sql-ctezo.southcentralus.cloudapp.azure.com',
    database: 'db_DesaWebDevUMG',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Conexión global (pool)
let poolPromise = sql.connect(dbConfig)
    .then(pool => {
        console.log('✅ Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('Error al conectar a SQL Server:', err);
    });

// Endpoint para obtener mensajes
app.get('/api/messages', async (req, res) => {
    try {
        const pool = await poolPromise;
        if (!pool) {
            return res.status(500).json({ error: 'Sin conexión a la base de datos.' });
        }

        // Traemos los últimos 100 mensajes, ordenados por la primera columna (suele ser el Id)
        const result = await pool.request().query(`
      SELECT TOP 100 *
      FROM [dbo].[Chat_Mensaje]
      ORDER BY 1 ASC
    `);

        res.json(result.recordset);
    } catch (err) {
        console.error('Error en /api/messages:', err);
        res.status(500).json({ error: 'Error al consultar los mensajes.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
});
