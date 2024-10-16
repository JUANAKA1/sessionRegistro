import { useState } from 'react';
import './App.css';

function RegistroProductos({ recargarAhora }) {
  // Estados para almacenar los datos de registro del producto
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [descripcionRegistro, setDescripcionRegistro] = useState('');
  const [precioRegistro, setPrecioRegistro] = useState('');
  const [tallaRegistro, setTallaRegistro] = useState('');
  const [colorRegistro, setColorRegistro] = useState('');
  const [unidadesRegistro, setUnidadesRegistro] = useState('');
  const [categoriaRegistro, setCategoriaRegistro] = useState('');
  const [imagenRegistro, setImagenRegistro] = useState(null); // Nuevo estado para la imagen
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

  // Función para manejar el cambio en el input de la imagen
  function cambiarImagenRegistro(evento) {
    setImagenRegistro(evento.target.files[0]); // Guardar el archivo seleccionado
  }

  // Función para registrar un nuevo producto
  async function registrar() {
    // Validación de campos
    if (!nombreRegistro || !descripcionRegistro || !precioRegistro || !tallaRegistro || !colorRegistro || !unidadesRegistro || !categoriaRegistro || !imagenRegistro) {
      setError("Todos los campos, incluyendo la imagen, son obligatorios");
      return;
    }
    
    setError(null); // Reiniciar el estado de error

    // Crear un objeto FormData para enviar los datos y la imagen
    const formData = new FormData();
    formData.append('nombre', nombreRegistro);
    formData.append('descripcion', descripcionRegistro);
    formData.append('precio', precioRegistro);
    formData.append('talla', tallaRegistro);
    formData.append('color', colorRegistro);
    formData.append('unidades', unidadesRegistro);
    formData.append('categoria', categoriaRegistro);
    formData.append('imagen', imagenRegistro); // Agregar la imagen al FormData

    try {
      const peticion = await fetch('http://localhost:3000/registroProductos', {
        method: 'POST',
        body: formData, // Enviar el FormData
        credentials: 'include', // Incluye las credenciales para la sesión
      });

      // Si la respuesta es exitosa
      if (peticion.ok) {
        alert("Producto registrado");
        recargarAhora(); // Llama a la función para recargar el estado o la lista de productos
        // Limpiar los campos después del registro
        setNombreRegistro('');
        setDescripcionRegistro('');
        setPrecioRegistro('');
        setTallaRegistro('');
        setColorRegistro('');
        setUnidadesRegistro('');
        setCategoriaRegistro('');
        setImagenRegistro(null);
      } else {
        const mensajeError = await peticion.text();
        setError(mensajeError || 'Producto no registrado');
      }
    } catch (err) {
      console.error(err);
      setError('Error al registrar el producto');
    }
  }

  return (
    <>
      <h1>Registro de Producto</h1>
      {error && <p className="error">{error}</p>}
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
      <input 
        id='imagen' 
        type="file" 
        onChange={cambiarImagenRegistro} 
      /> {/* Nuevo campo para la imagen */}
      <button type="button" onClick={registrar}>Registrar Producto</button>
    </>
  );
}

export default RegistroProductos;
