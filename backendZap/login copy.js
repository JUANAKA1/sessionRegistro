const connection = require("./conexion");
const bcrypt = require('bcrypt'); // Importa bcrypt para encriptar y comparar contraseñas
const saltRounds = 10; // Define el número de rondas para la encriptación de la contraseña

const login = async (req, res) => { // Función para manejar el inicio de sesión
    const datos = req.query; // Obtiene los datos de la consulta (query parameters)
    try {
        const [results, fields] = await connection.query(
            "SELECT * FROM `usuarios` WHERE `usuario` = ?", // Consulta SQL para obtener el usuario por nombre
            [datos.usuario] // Usa el nombre de usuario de los datos de la consulta
        );

        console.log(bcrypt.hashSync(datos.clave, saltRounds)); // Muestra en la consola la clave encriptada (esto no debería hacerse en producción)

        if (results.length > 0 && bcrypt.compareSync(datos.clave, results[0].clave)) { // Verifica si hay un usuario y si la contraseña coincide
            req.session.usuario = datos.usuario; // Se crea la sesión con el nombre de usuario
            res.status(200).send('Inicio de sesión correcto'); // Respuesta de éxito
        } else {
            res.status(401).send('Datos incorrectos'); // Respuesta de error si el usuario o la contraseña son incorrectos
        }

        console.log(results); // Muestra los resultados en la consola
        console.log(fields); // Muestra la metadata de los resultados, si está disponible
    } catch (err) {
        console.log(err); // Muestra el error en la consola
        res.status(500).send('Error en el registro'); // Respuesta de error interno
    }
}

module.exports = login; // Exporta la función para que pueda ser utilizada en otros archivos
