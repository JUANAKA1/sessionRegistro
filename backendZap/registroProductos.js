const connection = require("./conexion"); // Importa la conexión a la base de datos

const registroProductos = async (req, res) => { // Función para manejar el registro de productos
    if (!req.session.usuario || req.session.tipo_usuario !== 'administrador') { // Verifica si el usuario está autenticado y es administrador        res.status(401).send('No autorizado'); // Respuesta de no autorizado si no hay sesión
        res.status(401).send('No autorizado'); // Respuesta de error de autorización
        return; // Finaliza la ejecución de la función
    }
    // Obtiene los datos del producto del cuerpo de la solicitud
    const { nombre, descripcion, precio, talla, color, unidades, categoria } = req.body;

    try {
        // Realiza una consulta para insertar un nuevo producto en la base de datos
        const [results, fields] = await connection.query(
            "INSERT INTO `productos` (`nombre`, `descripcion`, `precio`, `talla`, `color`, `unidades`, `categoria`) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [nombre, descripcion, precio, talla, color, unidades, categoria]
        );

        // Verifica si se realizó la inserción correctamente
        if (results.affectedRows > 0) {
            res.status(200).send('Registro correcto'); // Respuesta de éxito
        } else {
            res.status(400).send('No se pudo registrar'); // Respuesta de error si no se pudo registrar
        }

        console.log(results); // Muestra los resultados en la consola
        console.log(fields); // Muestra la metadata de los resultados, si está disponible
    } catch (err) {
        console.log(err); // Muestra cualquier error en la consola
        res.status(500).send('Error en el registro'); // Respuesta de error interno
    }
};

module.exports = registroProductos; // Exporta la función para que pueda ser utilizada en otros archivos
