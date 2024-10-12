const bcrypt = require('bcrypt'); // Importa bcrypt para encriptar contraseñas
const connection = require("./conexion"); // Importa la conexión a la base de datos
const saltRounds = 10; // Define el número de rondas para la encriptación de la contraseña

const registro = async (req, res) => { // Función para manejar el registro de usuarios
    // if (!req.session.usuario) { // Verifica si no hay una sesión activa
    //     res.status(401).send('No autorizado'); // Respuesta de error de autorización
    //     return; // Finaliza la ejecución de la función
    // }

    // Obtiene los datos del usuario de la consulta (query parameters)
    const { usuario, clave, nombre, email, cc, telefono } = req.query;

    try {
        // Encripta la contraseña utilizando bcrypt
        const hash = bcrypt.hashSync(clave, saltRounds);

        // Realiza una consulta para insertar un nuevo usuario en la base de datos
        const [results, fields] = await connection.query(
            "INSERT INTO `usuarios` (`id`, `usuario`, `clave`, `nombre`, `email`, `cc`, `telefono`) VALUES (NULL, ?, ?, ?, ?, ?, ?)",
            [usuario, hash, nombre, email, cc, telefono]
        );

        // Verifica si se realizó la inserción correctamente
        if (results.affectedRows > 0) {
            req.session.usuario = usuario; // Crea la sesión con el nombre de usuario
            res.status(200).send('Registro correcto'); // Respuesta de éxito
        } else {
            res.status(401).send('No se pudo registrar'); // Respuesta de error si no se pudo registrar
        }

        console.log(results); // Muestra los resultados en la consola
        console.log(fields); // Muestra la metadata de los resultados, si está disponible
    } catch (err) {
        console.log(err); // Muestra cualquier error en la consola
        res.status(500).send('Error en el registro'); // Respuesta de error interno
    }
};

module.exports = registro; // Exporta la función para que pueda ser utilizada en otros archivos
