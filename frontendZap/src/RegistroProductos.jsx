import { useState } from 'react'; // Importación de hooks de React
import './App.css'; // Importación del archivo CSS para estilos

function RegistroProductos({ recargarAhora }) {
  // Estados para almacenar los datos de registro del producto
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [descripcionRegistro, setDescripcionRegistro] = useState('');
  const [precioRegistro, setPrecioRegistro] = useState('');
  const [tallaRegistro, setTallaRegistro] = useState('');
  const [colorRegistro, setColorRegistro] = useState('');
  const [unidadesRegistro, setUnidadesRegistro] = useState('');
  const [categoriaRegistro, setCategoriaRegistro] = useState('');
  const [error, setError] = useState(null); // Estado para manejar errores

  // Funciones para manejar cambios en los inputs
  function cambiarNombreRegistro(evento) {
    setNombreRegistro(evento.target.value);
  }

  function cambiarDescripcionRegistro(evento) {
    setDescripcionRegistro(evento.target.value);
  }

  function cambiarPrecioRegistro(evento) {
    setPrecioRegistro(evento.target.value);
  }

  function cambiarTallaRegistro(evento) {
    setTallaRegistro(evento.target.value);
  }

  function cambiarColorRegistro(evento) {
    setColorRegistro(evento.target.value);
  }

  function cambiarUnidadesRegistro(evento) {
    setUnidadesRegistro(evento.target.value);
  }

  function cambiarCategoriaRegistro(evento) {
    setCategoriaRegistro(evento.target.value);
  }

  // Función para registrar un nuevo producto
  async function registrar() {
    // Validación de campos
    if (!nombreRegistro || !descripcionRegistro || !precioRegistro || !tallaRegistro || !colorRegistro || !unidadesRegistro || !categoriaRegistro) {
      setError("Todos los campos son obligatorios");
      return;
    }
    
    setError(null); // Reiniciar el estado de error

    try {
      const peticion = await fetch('http://localhost:3000/registroProductos', {
        method: 'POST', // Cambiado a POST
        headers: {
          'Content-Type': 'application/json', // Especificar el tipo de contenido
        },
        credentials: 'include', // Incluye las credenciales para la sesión
        body: JSON.stringify({
          nombre: nombreRegistro,
          descripcion: descripcionRegistro,
          precio: precioRegistro,
          talla: tallaRegistro,
          color: colorRegistro,
          unidades: unidadesRegistro,
          categoria: categoriaRegistro,
        }),
      });

      // Si la respuesta es exitosa
      if (peticion.ok) {
        alert("Producto registrado"); // Mensaje de confirmación
        recargarAhora(); // Llama a la función para recargar el estado o la lista de productos
      } else {
        const mensajeError = await peticion.text(); // Obtiene el mensaje de error del servidor
        setError(mensajeError || 'Producto no registrado'); // Mensaje de error
      }
    } catch (err) {
      console.error(err); // Muestra el error en la consola
      setError('Error al registrar el producto'); // Mensaje de error
    }
  }

  return (
    <>
      <h1>Registro de Producto</h1>
      {error && <p className="error">{error}</p>} {/* Mostrar mensaje de error */}
      <input 
        placeholder='Nombre del Producto' 
        id='nombre' 
        type="text" 
        value={nombreRegistro} 
        onChange={cambiarNombreRegistro} 
      />
      <input 
        placeholder='Descripción' 
        id='descripcion' 
        type="text" 
        value={descripcionRegistro} 
        onChange={cambiarDescripcionRegistro} 
      />
      <input 
        placeholder='Precio' 
        id='precio' 
        type="text" 
        value={precioRegistro} 
        onChange={cambiarPrecioRegistro} 
      />
      <input 
        placeholder='Talla' 
        id='talla' 
        type="text" 
        value={tallaRegistro} 
        onChange={cambiarTallaRegistro} 
      />
      <input 
        placeholder='Color' 
        id='color' 
        type="text" 
        value={colorRegistro} 
        onChange={cambiarColorRegistro} 
      />
      <input 
        placeholder='Unidades' 
        id='unidades' 
        type="number" 
        value={unidadesRegistro} 
        onChange={cambiarUnidadesRegistro} 
      />
      <input 
        placeholder='Categoría' 
        id='categoria' 
        type="text" 
        value={categoriaRegistro} 
        onChange={cambiarCategoriaRegistro} 
      />
      <button type="button" onClick={registrar}>Registrar Producto</button> {/* Botón para registrar */}
    </>
  );
}

export default RegistroProductos; // Exporta el componente RegistroProductos para usarlo en otras partes de la aplicación
