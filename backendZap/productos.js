const connection = require("./conexion");

const obtenerProductos = async (req, res) => { // Función para obtener la lista de productos
    if (req.session.usuario || req.session.tipo_usuario == 'administrador') { // Verifica si el usuario está autenticado y es administrador       
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

const editarProducto = async (req, res) => { // Función para editar un producto
    if (!req.session.usuario || req.session.tipo_usuario !== 'administrador') { // Verifica si el usuario está autenticado y es administrador        res.status(401).send('No autorizado'); // Respuesta de no autorizado si no hay sesión
        return;
    }
    const { id, nombre, descripcion, precio, talla, color, unidades, categoria } = req.body; // Obtiene los datos del cuerpo de la solicitud

    try {
        const [results, fields] = await connection.query(
            "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, talla = ?, color = ?, unidades = ?, categoria = ? WHERE id = ?", // Consulta SQL para actualizar un producto
            [nombre, descripcion, precio, talla, color, unidades, categoria, id] // Valores a actualizar
        );

        if (results.affectedRows > 0) { // Verifica si se actualizó algún producto
            res.status(200).send('Producto actualizado'); // Respuesta de éxito
        } else {
            res.status(400).send('No se pudo actualizar el producto'); // Respuesta de error si no se encontró el producto
        }
    } catch (err) {
        console.log(err); // Muestra el error en la consola
        res.status(500).send('Error en la actualización'); // Respuesta de error interno
    }
}

// Exporta las funciones para que puedan ser utilizadas en otros archivos
module.exports = { obtenerProductos, eliminarProducto, editarProducto };
