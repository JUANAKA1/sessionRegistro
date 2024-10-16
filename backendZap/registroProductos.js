const connection = require("./conexion"); // Importa la conexión a la base de datos
const upload = require('./uploadConfig'); // Importa la configuración de multer

const registroProductos = (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            return res.status(400).send('Error al cargar la imagen'); // Respuesta de error si falla la carga
        }

        if (!req.session.usuario || req.session.tipo_usuario !== 'administrador') {
            res.status(401).send('No autorizado');
            return;
        }

        // Obtiene los datos del producto del cuerpo de la solicitud
        const { nombre, descripcion, precio, talla, color, unidades, categoria } = req.body;
        const imagen = req.file ? req.file.path : null; // Obtiene la ruta de la imagen si fue cargada

        try {
            // Realiza una consulta para insertar un nuevo producto en la base de datos
            const [results, fields] = await connection.query(
                "INSERT INTO `productos` (`nombre`, `descripcion`, `precio`, `talla`, `color`, `unidades`, `categoria`, `imagen`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [nombre, descripcion, precio, talla, color, unidades, categoria, imagen]
            );

            if (results.affectedRows > 0) {
                res.status(200).send('Registro correcto');
            } else {
                res.status(400).send('No se pudo registrar');
            }

            console.log(results);
            console.log(fields);
        } catch (err) {
            console.log(err);
            res.status(500).send('Error en el registro');
        }
    });
};

module.exports = registroProductos;
