const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const session = require('express-session')
const md5 = require('md5')
const bcrypt = require('bcrypt');
const login = require('./login');
const registro = require('./registro');
const { eliminarUsuario, obtenerUsuarios, editarUsuario } = require('./usuarios');
const validar = require('./validar');
const registroProductos = require('./registroProductos')
const { obtenerProductos, eliminarProducto, editarProducto } = require('./productos')
const saltRounds = 10;

app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}
))
app.use(session({
    secret: 'hfoiwrwer83wefhwdj2384rjhwe'

}))

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/login', login)

app.get('/validar', validar )

app.get('/registro', registro)

app.get('/usuarios', obtenerUsuarios)

app.delete('/usuarios', eliminarUsuario)

app.put('/usuarios', editarUsuario)

app.post('/registroProductos', registroProductos)

app.get('/productos', obtenerProductos)

app.delete('/productos', eliminarProducto)

app.put('/productos', editarProducto)

app.get('/productos', obtenerProductos)

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
