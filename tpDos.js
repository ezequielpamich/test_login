const express = require('express');
const app = express();
app.use(express.json());



const comments = [
    { id: 1, idPost: 1, content: 'Comentario 1 tipo text', fecha: '12:00 13:00', estado: true },
    { id: 2, idPost: 1, content: 'Comentario 2 tipo text', fecha: '12:00 14:00',estado: true },
    { id: 3, idPost: 2, content: 'Comentario 3 tipo text', fecha: '12:00 10:00',estado: true },
    { id: 4, idPost: 2, content: 'Comentario 4 tipo text', fecha: '12:00 13:00',estado: true },
];


const router = express.Router();

router.get('/comments', (req, res) => {
    res.json(comments);
});

// Obtener todos los comentarios de un post por ID del post
router.get('/comments/post/:idPost', (req, res) => {
    const postComments = comments.filter(c => c.idPost === parseInt(req.params.idPost));
    if (postComments.length === 0) return res.status(404).send('No se encontraron comentarios para este post');
    res.json(postComments);
});

// Obtener un comentario por ID
router.get('/comments/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) return res.status(404).send('Comentario no encontrado');
    res.json(comment);
});

// Crear un nuevo comentario
router.post('/comments', (req, res) => {
    const { idPost, content, fecha, estado } = req.body;
    const newComment = {
        id: comments.length + 1, // Genera un nuevo ID secuencial
        idPost,
        content,
        fecha,
        estado
    };
    comments.push(newComment);
    res.status(201).json(newComment);
});

// Actualizar un comentario existente
router.put('/comments/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if (!comment) return res.status(404).send('Comentario no encontrado');

    const { idPost, content, fecha, estado } = req.body;
    comment.idPost = idPost || comment.idPost;
    comment.content = content || comment.content;
    comment.fecha = fecha || comment.fecha;
    comment.estado = estado !== undefined ? estado : comment.estado;

    res.json(comment);
});

// Eliminar un comentario
router.delete('/comments/:id', (req, res) => {
    const commentIndex = comments.findIndex(c => c.id === parseInt(req.params.id));
    if (commentIndex === -1) return res.status(404).send('Comentario no encontrado');

    comments.splice(commentIndex, 1);
    res.status(204).send();
});


app.use(router);

module.exports = app;