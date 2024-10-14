const request = require('supertest');

const app = require('./app.js');


describe('POST /login', () => {

    // Validar que la respuesta sea JSON
    it('Toda respuesta deberia ser un JSON', async () => {
        const result = await request(app)
            .post('/login')
            .send({ usuario: 'usuario1', clave: 'clave1' })
            .expect('Content-Type', /json/)
            .expect(201);
        
        expect(result.headers['content-type']).toMatch(/json/);
    });


    // Prueba principal: Login exitoso
    it('Se envia un clave y usuario verdadero, debería devolver un JSON con el mensaje "ok" y un token Valido', async () => {
        const result = await request(app)
            .post('/login')
            .send({ usuario: 'usuario1', clave: 'clave1' })
            .expect('Content-Type', /json/)
            .expect(201);
        
        expect(result.body.message).toBe("ok");
        expect(result.body.token).toBeDefined();
        expect(typeof result.body.token).toBe("string");
    });


    // Validar que usuario y clave son obligatorios
    it('debería devolver un error 400 si no se proporciona usuario o clave', async () => {
        const result = await request(app)
            .post('/login')
            .send({ usuario: '', clave: '' })
            .expect('Content-Type', /json/)
            .expect(400);
        
        expect(result.body.error).toBe('Campos incompleto');
    });

    // Validar si el usuario no existe
    it('debería devolver un error 404 si el usuario no existe', async () => {
        const result = await request(app)
            .post('/login')
            .send({ usuario: 'usuario_no_existe', clave: 'clave1' })
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(result.body.error).toBe('Clave o Usuario incorrecto');
    });

    // Validar si la clave es incorrecta
    it('debería devolver un error 401 si la clave es incorrecta', async () => {
        const result = await request(app)
            .post('/login')
            .send({ usuario: 'usuario1', clave: 'clave_incorrecta' })
            .expect('Content-Type', /json/)
            .expect(401);        
        expect(result.body.error).toBe('Clave o Usuario incorrecto');
    });
});


//'GET /login/:token';
describe('Metodo GET a login, sin token', () => {

    it('Sin token, deberia devolver status200 login: err ', async () => {
        const result = await request(app)
            .get('/login') // Llamada sin token
            .expect(200);
        //expect(result.body).toBe({ err: 'tokenInvalido' });   
        expect(result.body).toStrictEqual({ login:"err" });
    });
});


describe('Metodo GET a login, con token', () => {

    // Validar que la respuesta sea JSON
    it('Deberia responder un json', async () => {
        const result = await request(app)
            .get(`/login/${"12efsrtte"}`)
            .expect('Content-Type', /json/)
        
        expect(result.headers['content-type']).toMatch(/json/);
    });

    // Validar que la respuesta sea JSON
    it('Token invalido, deberia responder starus 401 y mensaje: tokenInvalido', async () => {
        const result = await request(app)
            .get(`/login/${"12efsrtte"}`)
            .expect('Content-Type', /json/)
            .expect(401);
        
            expect(result.body.mensaje).toBe('tokenInvalido');
    });
});

/*
    // Prueba principal: Token válido
    it('debería devolver el token y estado 200 al proporcionar un token válido como parámetro', async () => {
        const result = await request(app)
            .get(`/login/${validToken}`) // Usar el token válido en la URL
            .expect('Content-Type', /json/)
            .expect(200);

        expect(result.body.token).toBe(validToken); // Asegurarse de que el token devuelto es el mismo
    });


    // Prueba de token expirado
    it('debería devolver un error 404 si el token está expirado', async () => {
        const expiredToken = createTokenWithTimestamp(Date.now() - (61 * 60 * 1000)); // Simular un token expirado

        const result = await request(app)
            .get(`/login/${expiredToken}`) // Usar un token expirado
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(result.body.err).toBe('token expirado'); // Asegurarse de que el mensaje de error sea el correcto
    });

    // Prueba de token no encontrado
    it('debería devolver un error 404 si el token no existe', async () => {
        const result = await request(app)
            .get('/login/no_existe_token') // Usar un token que no existe
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(result.body.message).toBe('Token no encontrado.'); // Asegurarse de que el mensaje de error sea el correcto
    });


    // Prueba de token nulo
    it('debería devolver un error 404 si se proporciona un token nulo', async () => {
        const result = await request(app)
            .get('/login/') // Llamada sin un token
            .expect('Content-Type', /json/)
            .expect(404);
        
        expect(result.body.err).toBe('token null'); // Asegurarse de que el mensaje de error sea el correcto
    });
*/
