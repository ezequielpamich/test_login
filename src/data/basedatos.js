const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config(); // Cargar las variables de entorno

// Crear una conexión con el pool de PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // Requerido para la conexión SSL con Neon
    }
});

// Función genérica para ejecutar consultas
module.exports.query = (text, params) => {
    return pool.query(text, params);
};

// Función para verificar si un usuario existe en la base de datos
module.exports.verificaUsuario = async (usuario) => {
    const result = await pool.query('SELECT * FROM users WHERE usuario = $1', [usuario]);
    return result.rows[0]; // Devuelve el primer usuario encontrado o undefined
};

// Función para guardar un token en la tabla tokens
module.exports.guardarToken = async (nuevoToken, userId) => {
    const result = await pool.query(
        'INSERT INTO tokens (token, user_id, estado) VALUES ($1, $2, $3) RETURNING *', 
        [nuevoToken, userId, true]
    );
    return result.rows[0]; // Devuelve el token recién creado
};

// Función para buscar un token en la base de datos
module.exports.buscarToken = async (utoken) => {
    const result = await pool.query('SELECT * FROM tokens WHERE token = $1', [utoken]);
    return result.rows[0]; // Devuelve el token encontrado o undefined
};

// Función para crear un token que incluye la marca de tiempo
module.exports.createTokenWithTimestamp = () => {
    const timestamp = Date.now(); 
    const uniqueValue = crypto.randomBytes(16).toString('hex'); 
    const token = `${uniqueValue}_${timestamp}`;
    return token;
};


module.exports.isTokenValidTime = (token) => {
    const [, timestamp] = token.split('_'); 
    const tokenTime = parseInt(timestamp);

    // Calcula si han pasado menos de 60 minutos
    const currentTime = Date.now();
    const timeDiff = (currentTime - tokenTime) / (1000 * 60); // Diferencia en minutos

    return timeDiff < 60; // True si paso menos de 60 minutos
};