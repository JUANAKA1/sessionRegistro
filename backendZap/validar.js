const validar = (req, res) => {
    // Verifica si hay un usuario almacenado en la sesión
    if (req.session.usuario) {
        // Si existe, responde con un estado 200 y un mensaje de validación
        res.status(200).send('Sesión validada');
    } else {
        // Si no existe, responde con un estado 401 y un mensaje de no autorizado
        res.status(401).send('No autorizado');
    }
}

module.exports = validar; // Exporta la función para que pueda ser utilizada en otros archivos
