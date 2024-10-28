const express = require('express');
const app = express();
app.use(express.json());




const post = [
    { id: 1, idUser: 1, content: 'Comentario 1 tipo text', date: '12:00 13:00', estado: true },
    { id: 2, idUser: 1, content: 'Comentario 2 tipo text', date: '12:00 14:00',estado: true },
    { id: 3, idUser: 2, content: 'Comentario 3 tipo text', date: '12:00 10:00',estado: true },
    { id: 4, idUser: 2, content: 'Comentario 4 tipo text', date: '12:00 13:00',estado: true },
];

const comment = [
    { id: 1, idPost: 1, content: 'Comentario 1 tipo text', fecha: '12:00 13:00', estado: true },
    { id: 2, idPost: 1, content: 'Comentario 2 tipo text', fecha: '12:00 14:00',estado: true },
    { id: 3, idPost: 2, content: 'Comentario 3 tipo text', fecha: '12:00 10:00',estado: true },
    { id: 4, idPost: 2, content: 'Comentario 4 tipo text', fecha: '12:00 13:00',estado: true },
];


const router = express.Router();

// Ruta para obtener todos los posts
router.get('/posts', (req, res) => {
    res.json(posts);
});

// Ruta para obtener un post por ID
router.get('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send('El post con ese ID no fue encontrado');
    res.json(post);
});

// Ruta para crear un nuevo post
router.post('/posts', (req, res) => {
    const { idUser, content, date, estado } = req.body;
    const newPost = {
        id: posts.length + 1, // Genera un nuevo ID secuencial
        idUser,
        content,
        date,
        estado
    };
    posts.push(newPost);
    res.status(201).json(newPost);
});

// Ruta para actualizar un post por ID
router.put('/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) return res.status(404).send('El post con ese ID no fue encontrado');

    const { idUser, content, date, estado } = req.body;
    post.idUser = idUser || post.idUser;
    post.content = content || post.content;
    post.date = date || post.date;
    post.estado = estado !== undefined ? estado : post.estado;

    res.json(post);
});

// Ruta para eliminar un post por ID
router.delete('/posts/:id', (req, res) => {
    const postIndex = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (postIndex === -1) return res.status(404).send('El post con ese ID no fue encontrado');

    posts.splice(postIndex, 1);
    res.status(204).send(); // Responde con éxito sin contenido
});
app.use(router);

module.exports = app;