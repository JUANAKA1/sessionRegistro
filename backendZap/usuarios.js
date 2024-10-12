const connection = require("./conexion");
const bcrypt = require('bcrypt'); // Importa bcrypt para encriptar contraseñas
const saltRounds = 10; // Define el número de rondas para la encriptación de la contraseña

const obtenerUsuarios = async (req, res) => { // Función para obtener la lista de usuarios
    if (!req.session.usuario) { // Verifica si el usuario está autenticado
        res.status(401).send('No autorizado'); // Respuesta de no autorizado si no hay sesión
        return;
    }
    try {
        const [results, fields] = await connection.query(
            "SELECT * FROM `usuarios`", // Consulta SQL para obtener todos los usuarios
        );
        res.status(200).json(results); // Responde con los resultados en formato JSON

        console.log(results); // Muestra los resultados en la consola
        console.log(fields); // Muestra la metadata de los resultados, si está disponible
    } catch (err) {
        console.log(err); // Muestra el error en la consola
        res.status(500).send('Error en el registro'); // Respuesta de error interno
    }
}

const eliminarUsuario = async (req, res) => { // Función para eliminar un usuario
    if (!req.session.usuario) { // Verifica si el usuario está autenticado
        res.status(401).send('No autorizado'); // Respuesta de no autorizado si no hay sesión
        return;
    }
    const datos = req.query; // Obtiene los datos de la consulta (query parameters)
    try {
        const [results, fields] = await connection.query(
            "DELETE FROM usuarios WHERE `usuarios`.`id` = ?", // Consulta SQL para eliminar un usuario por ID
            [datos.id]
        );
        if (results.affectedRows > 0) { // Verifica si se eliminó algún usuario
            res.status(200).send('Usuario eliminado'); // Respuesta de éxito
        } else {
            res.status(401).send('No se pudo eliminar'); // Respuesta de error si no se encontró el usuario
        }

        console.log(results); // Muestra los resultados en la consola
        console.log(fields); // Muestra la metadata de los resultados, si está disponible
    } catch (err) {
        console.log(err); // Muestra el error en la consola
        res.status(500).send('Error en el registro'); // Respuesta de error interno
    }
}

const editarUsuario = async (req, res) => { // Función para editar un usuario
    if (!req.session.usuario) { // Verifica si el usuario está autenticado
        res.status(401).send('No autorizado'); // Respuesta de no autorizado si no hay sesión
        return;
    }
    const { id, usuario, clave, nombre, email, cc, telefono } = req.body; // Obtiene los datos del cuerpo de la solicitud

    try {
        // Encripta la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(clave, saltRounds); // Encripta la nueva contraseña

        const [results, fields] = await connection.query(
            "UPDATE usuarios SET usuario = ?, clave = ?, nombre = ?, email = ?, cc = ?, telefono = ? WHERE id = ?", // Consulta SQL para actualizar un usuario
            [usuario, hashedPassword, nombre, email, cc, telefono, id] // Valores a actualizar
        );

        if (results.affectedRows > 0) { // Verifica si se actualizó algún usuario
            res.status(200).send('Usuario actualizado'); // Respuesta de éxito
        } else {
            res.status(400).send('No se pudo actualizar el usuario'); // Respuesta de error si no se encontró el usuario
        }
    } catch (err) {
        console.log(err); // Muestra el error en la consola
        res.status(500).send('Error en la actualización'); // Respuesta de error interno
    }
}

// Exporta las funciones para que puedan ser utilizadas en otros archivos
module.exports = { obtenerUsuarios, eliminarUsuario, editarUsuario };
