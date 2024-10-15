const express = require('express');
const app = express();
app.use(express.json());

//Base datos
const { createTokenWithTimestamp,isTokenValidTime,verificaUsuario, guardarToken, buscarToken } = require('./data/basedatos');


const router = express.Router();


// Ruta para crear un nuevo token
router.post('/login', async (req, res) => {
    try{
        const { usuario, clave } = req.body;

        // Verificar que usuario y clave estén presentes en la solicitud
        if (!usuario || !clave) {
            return res.status(400).json({ login: 'Campos incompleto' });
        }


        // Verificar si el usuario existe
        const  user = await verificaUsuario(usuario);
        if (!user) {
            return res.status(404).json({ err: 'Clave o Usuario incorrecto' });
        }
        console.log(user)
        console.log(user)
        console.log(user)
    
        // Verificar si la clave es correcta
        if (user.clave !== clave) {
            return res.status(401).json({ err: 'Clave incorrecta' });
        }


        //generar un token simple (ejemplo)
        const nuevoToken = createTokenWithTimestamp();
        

        //Guarda un token
        const actualizar = guardarToken(nuevoToken, user.id)
        

        // Enviar el token generado
        return res.status(201).json({login:"ok", token: nuevoToken});
    
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).send({ message: 'Error interno del servidor.' });
    }

});


// Ruta para obtener un token específico
router.get('/login', (req, res) => {
    return res.status(200).json({login:"err"});
});


// Ruta para obtener un token específico
router.get('/login/:utoken?', async (req, res) => {
    //'GET /login/:token';
    const { utoken } = req.params;

    try{
        // Verificar si el token es menor a 10 caracteres
        if (utoken.length < 10) {
            return res.status(401).json({ mensaje: "tokenInvalido" });
        }

        // Verificar si el token es válido en tiempo
        if (!isTokenValidTime(utoken)) {
            return res.status(402).send({ mensaje: 'expirado' });
        }

        // Buscar el token
        const foundToken = buscarToken(utoken);

        if (!foundToken) {
            return res.status(403).send({ message: 'Token no encontrado.' });  
        }

        // Generar un nuevo token
        const newToken = createTokenWithTimestamp();
        guardarToken(newToken,foundToken.user_id);

        return res.status(200).send({ message: 'ok', token: newToken }); // Devolver el token encontrado y el nuevo token
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return res.status(500).send({ message: 'Error interno del servidor.' });
    }


});

app.use(router);

module.exports = app;