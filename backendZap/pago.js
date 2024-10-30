const connection = require('./conexion'); // Conexión a MySQL


const procederAlPago = async (req, res) => {
    const usuario_usu = req.session.usuario;

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

        const [carrito] = await connection.query(
            "SELECT producto_id, cantidad FROM carrito WHERE usuario_id = ?", [usuario_id]
        );

        for (let item of carrito) {
            await connection.query(
                "UPDATE productos SET unidades = unidades - ? WHERE id = ?",
                [item.cantidad, item.producto_id]
            );
        }

        await connection.query("DELETE FROM carrito WHERE usuario_id = ?", [usuario_id]);

        return res.status(200).json({ message: 'Pago procesado y carrito vaciado' });
    } catch (err) {
        console.error('Error al procesar el pago:', err);
        return res.status(500).json({ error: 'Error del servidor' });
    }
};


module.exports = procederAlPago;