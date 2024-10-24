const connection = require('./conexion'); // Conexión a MySQL

const agregarAlCarrito = async (req, res) => {
    const usuario_id = req.session.usuario; // Obtén el usuario_id de la sesión
    const { producto_id, cantidad } = req.body; // Asegúrate de que estos campos existan en el cuerpo

    // Verificar si el usuario está autenticado
    if (!usuario_id) {
        return res.status(401).json({ error: 'El usuario no está autenticado' });
    }

    // Verificar si se han proporcionado el producto_id y la cantidad
    if (!producto_id || !cantidad) {
        return res.status(400).json({ error: 'Faltan datos necesarios' });
    }

    try {
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

        // Verificar si se agregó el producto
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
    const usuario_id = req.session.usuario; // Obtener el usuario_id de la sesión

    try {
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

module.exports = { agregarAlCarrito, obtenerCarrito };
