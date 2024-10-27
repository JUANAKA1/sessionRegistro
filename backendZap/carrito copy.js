const connection = require('./conexion'); // Conexión a MySQL

const agregarAlCarrito = async (req, res) => {
    const usuario_usu = req.session.usuario; // Obtener el nombre de usuario de la sesión
    const { producto_id, cantidad } = req.body;

    // Verificar si el usuario está autenticado
    if (!usuario_usu) {
        return res.status(401).json({ error: 'El usuario no está autenticado' });
    }

    try {
        // Buscar el usuario en la base de datos para obtener su ID
        const [usuario] = await connection.query(
            "SELECT id FROM usuarios WHERE usuario = ?", [usuario_usu]
        );

        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario_id = usuario[0].id;

        // Verificar si se han proporcionado el producto_id y la cantidad
        if (!producto_id || !cantidad) {
            return res.status(400).json({ error: 'Faltan datos necesarios' });
        }

        // Verificar la disponibilidad del producto
        const [producto] = await connection.query(
            "SELECT unidades FROM productos WHERE id = ?", [producto_id]
        );

        if (producto.length === 0 || producto[0].unidades < cantidad) {
            return res.status(400).json({ error: 'Cantidad no disponible' });
        }

        // Insertar el producto en el carrito
        const [result] = await connection.query(
            "INSERT INTO carrito (usuario_id, producto_id, cantidad, fecha_agregado) VALUES (?, ?, ?, NOW())",
            [usuario_id, producto_id, cantidad]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Producto agregado al carrito' });
        } else {
            return res.status(500).json({ error: 'Error al agregar el producto al carrito' });
        }
    } catch (err) {
        console.error('Error al agregar al carrito:', err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
};

const obtenerCarrito = async (req, res) => {
    const nombreUsuario = req.session.usuario; // Nombre de usuario desde la sesión

    try {
        // Obtener el ID del usuario a partir del nombre de usuario
        const [usuarios] = await connection.query(
            "SELECT id FROM usuarios WHERE usuario = ?", [nombreUsuario]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario_id = usuarios[0].id;

        // Obtener el carrito del usuario
        const [carrito] = await connection.query(
            `SELECT productos.nombre, productos.precio, carrito.cantidad
             FROM carrito
             JOIN productos ON carrito.producto_id = productos.id
             WHERE carrito.usuario_id = ?`, [usuario_id]
        );

        res.status(200).json(carrito);
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};

const editarCarrito = async (req, res) => {
    const usuario_usu = req.session.usuario; // Obtener el nombre de usuario de la sesión
    const { producto_id, cantidad } = req.body;

    if (!usuario_usu) {
        return res.status(401).json({ error: 'El usuario no está autenticado' });
    }

    try {
        // Buscar el usuario en la base de datos para obtener su ID
        const [usuario] = await connection.query(
            "SELECT id FROM usuarios WHERE usuario = ?", [usuario_usu]
        );

        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario_id = usuario[0].id;

        // Verificar que el producto está en el carrito del usuario
        const [productoEnCarrito] = await connection.query(
            "SELECT cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?", 
            [usuario_id, producto_id]
        );

        if (productoEnCarrito.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }

        // Actualizar la cantidad del producto en el carrito
        const [result] = await connection.query(
            "UPDATE carrito SET cantidad = ? WHERE usuario_id = ? AND producto_id = ?",
            [cantidad, usuario_id, producto_id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Cantidad actualizada en el carrito' });
        } else {
            return res.status(500).json({ error: 'Error al actualizar el carrito' });
        }
    } catch (err) {
        console.error('Error al editar el carrito:', err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
};
const eliminarDelCarrito = async (req, res) => {
    const usuario_usu = req.session.usuario; // Obtener el nombre de usuario de la sesión
    const { producto_id } = req.body;

    if (!usuario_usu) {
        return res.status(401).json({ error: 'El usuario no está autenticado' });
    }

    try {
        // Buscar el usuario en la base de datos para obtener su ID
        const [usuario] = await connection.query(
            "SELECT id FROM usuarios WHERE usuario = ?", [usuario_usu]
        );

        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario_id = usuario[0].id;

        // Eliminar el producto del carrito
        const [result] = await connection.query(
            "DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?",
            [usuario_id, producto_id]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Producto eliminado del carrito' });
        } else {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch (err) {
        console.error('Error al eliminar del carrito:', err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
};


module.exports = { agregarAlCarrito, obtenerCarrito, editarCarrito, eliminarDelCarrito };
