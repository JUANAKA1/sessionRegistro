const validar = (req, res) => {
    // Verifica si hay un usuario almacenado en la sesión
    if (req.session.usuario) {
        // Verifica si el usuario tiene rol de 'usuario' o 'administrador'
        const { rol } = req.session.usuario;
        if (rol === 'usuario' || rol === 'administrador') {
            // Responde con un estado 200 y un mensaje de validación
            res.status(200).send('Sesión validada');
        } else {
            // Si el rol no es válido, responde con un estado 403 y un mensaje de no autorizado
            res.status(403).send('No autorizado');
        }
    } else {
        // Si no existe un usuario en la sesión, responde con un estado 401
        res.status(401).send('No autorizado');
    }
};

module.exports = validar; // Exporta la función para que pueda ser utilizada en otros archivos
