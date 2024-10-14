const crypto = require('crypto');
const users = [
    { id: 1, usuario: 'usuario1', clave: 'clave1', estado: true },
    { id: 2, usuario: 'usuario2', clave: 'clave2', estado: true },
    { id: 3, usuario: 'usuario3', clave: 'clave3', estado: true },
    { id: 4, usuario: 'usuario4', clave: 'clave4', estado: true },
];

const tokens = [
    { token: 'token1_value', user_id: 1, estado: true },
    { token: 'token2_value', user_id: 2, estado: true },
    { token: 'b149930ebd42f2fce2d1f12d43ab0a43_1727658401142', user_id: 3, estado: true },
];

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


module.exports.verificaUsuario = (usuario) => {
    return users.find(u => u.usuario === usuario)
}

module.exports.guardarToken = (nuevoToken, userId) => {
    const nuevo = {token: nuevoToken , user_id: userId, estado: true };
    return tokens.push(nuevo);
}

