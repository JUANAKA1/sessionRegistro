const bcrypt = require('bcrypt');
const connection = require("./conexion");
const saltRounds = 10;

const registro = async (req, res) => { //req = request, peticion; res = response, respuesta
    if (!req.session.usuario) {
        res.status(401).send('No autorizado')
        return;
    }
    const datos = req.query;
    try {
        const hash = bcrypt.hashSync(datos.clave, saltRounds);
        const [results, fields] = await connection.query(
            "INSERT INTO `usuarios` (`id`, `usuario`, `clave`) VALUES (NULL, ?, ?)",
            [datos.usuario, hash]
        );
        if (results.affectedRows > 0) {
            req.session.usuario = datos.usuario;  // Se crea la sesion con el nombre de usuario
            res.status(200).send('Registro correcto')
        } else {
            res.status(401).send('No se pudo registrar')
        }

        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
        res.status(500).send('Error en el registro')
    }

}
 module.exports = registro;