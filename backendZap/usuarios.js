const connection = require("./conexion");
const bcrypt = require('bcrypt');
const saltRounds = 10;

const obtenerUsuarios = async (req, res) => { //req = request, peticion; res = response, respuesta
    if (!req.session.usuario) {
        res.status(401).send('No autorizado')
        return;
    }
    try {
        const [results, fields] = await connection.query(
            "SELECT * FROM `usuarios` ",
        );
        res.status(200).json(results)

        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
        res.status(500).send('Error en el registro')
    }
}

const eliminarUsuario = async (req, res) => { //req = request, peticion; res = response, respuesta
    if (!req.session.usuario) {
        res.status(401).send('No autorizado')
        return;
    }
    const datos = req.query;
    try {
        const [results, fields] = await connection.query(
            "DELETE FROM usuarios WHERE `usuarios`.`id` = ? ",
            [datos.id]
        );
        if (results.affectedRows > 0) {
            res.status(200).send('Usuario eliminado')
        } else {
            res.status(401).send('No se pudo eliminar')
        }

        console.log(results); // results contains rows returned by server
        console.log(fields); // fields contains extra meta data about results, if available
    } catch (err) {
        console.log(err);
        res.status(500).send('Error en el registro')
    }

}

const editarUsuario = async (req, res) => {
    if (!req.session.usuario) {
        res.status(401).send('No autorizado');
        return;
    }
    const { id, usuario, clave, nombre, email, cc, telefono } = req.body;
    
    try {
        // Encripta la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(clave, saltRounds);

        const [results, fields] = await connection.query(
            "UPDATE usuarios SET usuario = ?, clave = ?, nombre = ?, email = ?, cc = ?, telefono = ? WHERE id = ?",
            [usuario, hashedPassword, nombre, email, cc, telefono, id]
        );

        if (results.affectedRows > 0) {
            res.status(200).send('Usuario actualizado');
        } else {
            res.status(400).send('No se pudo actualizar el usuario');
        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Error en la actualización');
    }

}

module.exports = {obtenerUsuarios, eliminarUsuario, editarUsuario}