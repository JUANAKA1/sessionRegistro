const validar = (req, res) => {
    if (req.session.usuario) {
        res.status(200).send('Sesión validada')
    } else {
        res.status(401).send('No autorizado')
    }
}
module.exports = validar;