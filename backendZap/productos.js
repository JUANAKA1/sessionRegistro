const connection = require("./conexion");
const upload = require('./uploadConfig'); // Importa la configuración de multer

const obtenerProductos = async (req, res) => { // Función para obtener la lista de productos
    if (!req.session.usuario || !req.session.tipo_usuario == 'administrador') { // Verifica si el usuario está autenticado y es administrador       
        return;
    }
    try {
        const [results, fields] = await connection.query(
            "SELECT * FROM `productos`", // Consulta SQL para obtener todos los productos
        );
        res.status(200).json(results); // Responde con los resultados en formato JSON

        console.log(results); // Muestra los resultados en la consola
        console.log(fields); // Muestra la metadata de los resultados, si está disponible
    } catch (err) {
        console.log(err); // Muestra el error en la consola
        res.status(500).send('Error en la obtención de productos'); // Respuesta de error interno
    }
}

const eliminarProducto = async (req, res) => { // Función para eliminar un producto
    if (!req.session.usuario || req.session.tipo_usuario !== 'administrador') { // Verifica si el usuario está autenticado y es administrador   
        return;
    }
    const datos = req.query; // Obtiene los datos de la consulta (query parameters)
    try {
        const [results, fields] = await connection.query(
            "DELETE FROM productos WHERE `productos`.`id` = ?", // Consulta SQL para eliminar un producto por ID
            [datos.id]
        );
        if (results.affectedRows > 0) { // Verifica si se eliminó algún producto
            res.status(200).send('Producto eliminado'); // Respuesta de éxito
        } else {
            res.status(404).send('No se pudo eliminar el producto'); // Respuesta de error si no se encontró el producto
        }

        console.log(results); // Muestra los resultados en la consola
        console.log(fields); // Muestra la metadata de los resultados, si está disponible
    } catch (err) {
        console.log(err); // Muestra el error en la consola
        res.status(500).send('Error en la eliminación'); // Respuesta de error interno
    }
}

const editarProducto = (req, res) => {
    // Verifica si el usuario está autenticado y es administrador
    if (!req.session.usuario || req.session.tipo_usuario !== 'administrador') {
        return res.status(401).send('No autorizado');
    }

    // Maneja la actualización de la imagen con Multer
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).send('Error al cargar la imagen');
        }

        // Obtiene los datos del cuerpo de la solicitud
        const { id, nombre, descripcion, precio, talla, color, unidades, categoria } = req.body;
        const imagen = req.file ? req.file.path : null;

        console.log("Datos recibidos:", req.body); // Verifica los datos

        try {
            let query = "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, talla = ?, color = ?, unidades = ?, categoria = ?";
            const params = [nombre, descripcion, precio, talla, color, unidades, categoria];

            // Solo actualiza la imagen si se cargó una nueva
            if (imagen) {
                query += ", imagen = ?";
                params.push(imagen);
            }

            query += " WHERE id = ?";
            params.push(id);

            console.log("Consulta SQL:", query);
            console.log("Parámetros:", params);

            // Realiza la consulta para actualizar el producto en la base de datos
            const [results, fields] = await connection.query(query, params);

            if (results.affectedRows > 0) {
                res.status(200).send('Producto actualizado');
            } else {
                res.status(400).send('No se pudo actualizar el producto o el producto no existe');
            }

            console.log(results);
            console.log(fields);
        } catch (err) {
            console.error('Error en la actualización:', err); // Mejora el log de errores
            res.status(500).send('Error en la actualización');
        }
    });
};

// Exporta las funciones para que puedan ser utilizadas en otros archivos
module.exports = { obtenerProductos, eliminarProducto, editarProducto };
