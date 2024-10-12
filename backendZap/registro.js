const bcrypt = require('bcrypt');
const connection = require("./conexion");
const saltRounds = 10;

const registro = async (req, res) => {
    if (!req.session.usuario) {
        res.status(401).send('No autorizado');
        return;
    }

    const { usuario, clave, nombre, email, cc, telefono } = req.query;

    try {
        const hash = bcrypt.hashSync(clave, saltRounds);

        const [results, fields] = await connection.query(
            "INSERT INTO `usuarios` (`id`, `usuario`, `clave`, `nombre`, `email`, `cc`, `telefono`) VALUES (NULL, ?, ?, ?, ?, ?, ?)",
            [usuario, hash, nombre, email, cc, telefono]
        );

        if (results.affectedRows > 0) {
            req.session.usuario = usuario;  // Se crea la sesión con el nombre de usuario
            res.status(200).send('Registro correcto');
        } else {
            res.status(401).send('No se pudo registrar');
        }

        console.log(results); // results contiene filas devueltas por el servidor
        console.log(fields); // fields contiene datos adicionales sobre los resultados, si están disponibles
    } catch (err) {
        console.log(err);
        res.status(500).send('Error en el registro');
    }
};

 module.exports = registro;