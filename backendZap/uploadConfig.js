const multer = require('multer'); // Importa multer para manejar archivos

// Configuración de Multer para almacenar imágenes en la carpeta 'uploads'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Carpeta donde se guardarán las imágenes
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Renombra el archivo con la fecha actual
    }
});

// Filtro para asegurarse de que solo se carguen archivos de imagen
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // Acepta el archivo
    } else {
        cb(new Error('Formato de imagen no válido, solo se permiten JPG y PNG'), false); // Rechaza el archivo
    }
};

// Crear una instancia de Multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limita el tamaño de la imagen a 5MB
    fileFilter: fileFilter
}).single('imagen'); // Solo permite cargar un archivo con el campo 'imagen'

module.exports = upload;
