const connection = require('./conexion'); // Conexión a MySQL

const agregarAlCarrito = async (req, res) => {
    const usuario_usu = req.session.usuario;
    const { producto_id, cantidad } = req.body;

    // Verificar si el usuario está autenticado
    if (!usuario_usu) {
        return res.status(401).json({ error: 'El usuario no está autenticado' });
    }

    try {
        const [usuario] = await connection.query(
            "SELECT id FROM usuarios WHERE usuario = ?", [usuario_usu]
        );
        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const usuario_id = usuario[0].id;

        const [producto] = await connection.query(
            "SELECT unidades, precio FROM productos WHERE id = ?", [producto_id]
        );
        if (producto.length === 0 || producto[0].unidades < cantidad) {
            return res.status(400).json({ error: 'Cantidad no disponible' });
        }
        const precioProducto = producto[0].precio;

        // Aquí debes asegurarte de que producto_id es el correcto
        console.log("Producto ID agregado:", producto_id); // Agregar un log para verificar

        const [productoEnCarrito] = await connection.query(
            "SELECT cantidad FROM carrito WHERE usuario_id = ? AND producto_id = ?",
            [usuario_id, producto_id]
        );

        if (productoEnCarrito.length > 0) {
            const nuevaCantidad = productoEnCarrito[0].cantidad + cantidad;
            await connection.query(
                "UPDATE carrito SET cantidad = ?, precio_total = ? WHERE usuario_id = ? AND producto_id = ?",
                [nuevaCantidad, nuevaCantidad * precioProducto, usuario_id, producto_id]
            );
        } else {
            await connection.query(
                "INSERT INTO carrito (usuario_id, producto_id, cantidad, precio_total, fecha_agregado) VALUES (?, ?, ?, ?, NOW())",
                [usuario_id, producto_id, cantidad, cantidad * precioProducto]
            );
        }

        return res.status(200).json({ message: 'Producto agregado o actualizado en el carrito' });
    } catch (err) {
        console.error('Error al agregar al carrito:', err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
};

const obtenerCarrito = async (req, res) => {
    const nombreUsuario = req.session.usuario;

    try {
        const [usuarios] = await connection.query(
            "SELECT id FROM usuarios WHERE usuario = ?", [nombreUsuario]
        );

        if (usuarios.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const usuario_id = usuarios[0].id;

        const [carrito] = await connection.query(
            `SELECT productos.nombre, productos.precio, productos.imagen, carrito.cantidad, carrito.precio_total
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
    const usuario_usu = req.session.usuario;
    const { producto_id, cantidad } = req.body;

    // Validación de sesión y parámetros
    if (!usuario_usu) {
        return res.status(401).json({ error: 'El usuario no está autenticado' });
    }
    if (!producto_id || cantidad <= 0 || isNaN(cantidad)) {
        return res.status(400).json({ error: 'Parámetros inválidos' });
    }

    try {
        // Buscar el ID del usuario
        const [usuario] = await connection.query(
            "SELECT id FROM usuarios WHERE usuario = ?", [usuario_usu]
        );
        if (usuario.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const usuario_id = usuario[0].id;

        // Comprobar si el producto está en el carrito y obtener su precio
        const [productoEnCarrito] = await connection.query(
            "SELECT productos.precio FROM carrito JOIN productos ON carrito.producto_id = productos.id WHERE carrito.usuario_id = ? AND carrito.producto_id = ?", 
            [usuario_id, producto_id]
        );
        
        if (productoEnCarrito.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
        
        const precioProducto = productoEnCarrito[0].precio;

        // Actualizar la cantidad y precio total del producto en el carrito
        await connection.query(
            "UPDATE carrito SET cantidad = ?, precio_total = ? WHERE usuario_id = ? AND producto_id = ?",
            [cantidad, cantidad * precioProducto, usuario_id, producto_id]
        );

        console.log(`Carrito actualizado: Usuario ${usuario_id}, Producto ${producto_id}, Nueva cantidad ${cantidad}`);
        return res.status(200).json({ message: 'Cantidad actualizada en el carrito y precio total modificado' });
    } catch (err) {
        console.error('Error al editar el carrito:', err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
};
const eliminarDelCarrito = async (req, res) => {
    const usuario_usu = req.session.usuario;
    const { producto_id } = req.body;

    // Validación de sesión y parámetros
    if (!usuario_usu) {
        return res.status(401).json({ error: 'El usuario no está autenticado' });
    }
    if (!producto_id || isNaN(producto_id)) {
        return res.status(400).json({ error: 'Producto ID inválido' });
    }

    try {
        // Buscar el ID del usuario
        const [usuario] = await connection.query(
            "SELECT id FROM usuarios WHERE usuario = ?", [usuario_usu]
        );
        if (usuario.length === 0) {
            console.log('Usuario no encontrado en la base de datos');
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        const usuario_id = usuario[0].id;
        console.log(`Usuario ID obtenido: ${usuario_id}`);

        // Eliminar el producto del carrito
        const [result] = await connection.query(
            "DELETE FROM carrito WHERE usuario_id = ? AND producto_id = ?",
            [usuario_id, producto_id]
        );

        if (result.affectedRows > 0) {
            console.log(`Producto ${producto_id} eliminado del carrito del usuario ${usuario_id}`);
            return res.status(200).json({ message: 'Producto eliminado del carrito' });
        } else {
            console.log('Producto no encontrado en el carrito');
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });
        }
    } catch (err) {
        console.error('Error al eliminar del carrito:', err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
};


module.exports = { agregarAlCarrito, obtenerCarrito, editarCarrito, eliminarDelCarrito };
