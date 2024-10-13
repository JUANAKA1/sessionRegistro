import { useEffect, useState } from 'react'; // Importación de hooks useEffect y useState de React
import './App.css'; // Importación del archivo CSS para estilos

function Productos({ recargar }) {
  // Estado para almacenar la lista de productos
  const [productos, setProductos] = useState([]);

  // Estado para almacenar los datos del producto que se está editando
  const [productoEdit, setProductoEdit] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    talla: '',
    color: '',
    unidades: '',
    categoria: ''
  });

  // Función para obtener la lista de productos desde la API
  async function obtenerProductos() {
    const peticion = await fetch('http://localhost:3000/productos', { credentials: 'include' });

    // Si la respuesta es exitosa
    if (peticion.ok) {
      const respuesta = await peticion.json(); // Convierte la respuesta a formato JSON
      setProductos(respuesta); // Actualiza el estado de productos con los datos recibidos
    }
  }

  // Función para eliminar un producto
  async function eliminarProducto(id) {
    // Confirma si el usuario realmente quiere eliminarlo
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      const peticion = await fetch(`http://localhost:3000/productos?id=${id}`, {
        credentials: 'include',
        method: 'DELETE' // Método para eliminar
      });

      // Si la respuesta es exitosa
      if (peticion.ok) {
        alert("Producto eliminado"); // Mensaje de confirmación
        obtenerProductos(); // Vuelve a cargar la lista de productos
      }
    }
  }

  // Función para editar un producto
  async function editarProducto(id) {
    // Desestructura los valores del producto que se va a editar
    const { nombre, descripcion, precio, talla, color, unidades, categoria } = productoEdit;

    // Valida que todos los campos estén completos
    if (!nombre || !descripcion || !precio || !talla || !color || !unidades || !categoria) {
      alert("Por favor, complete todos los campos"); // Mensaje de error
      return; // Sale de la función si faltan campos
    }

    const peticion = await fetch(`http://localhost:3000/productos?id=${id}`, {
      method: 'PUT', // Método para actualizar
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nombre, descripcion, precio, talla, color, unidades, categoria }), // Envía los datos como JSON
      credentials: 'include'
    });

    // Si la respuesta es exitosa
    if (peticion.ok) {
      alert("Producto actualizado"); // Mensaje de confirmación
      obtenerProductos(); // Vuelve a cargar la lista de productos
      // Reinicia el estado del producto que se está editando
      setProductoEdit({ id: '', nombre: '', descripcion: '', precio: '', talla: '', color: '', unidades: '', categoria: '' });
    } else {
      alert("No se pudo actualizar el producto"); // Mensaje de error
    }
  }

  // Función para manejar el clic en el botón de editar
  function handleEditClick(producto) {
    setProductoEdit(producto); // Establece el producto seleccionado en el estado de edición
  }

  // Hook useEffect para cargar la lista de productos cuando el componente se monta o se recarga
  useEffect(() => {
    obtenerProductos(); // Llama a la función para obtener productos
  }, [recargar]); // Dependencia de recargar, para volver a obtener productos cuando cambie

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Talla</th>
            <th>Color</th>
            <th>Unidades</th>
            <th>Categoría</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>{producto.precio}</td>
              <td>{producto.talla}</td>
              <td>{producto.color}</td>
              <td>{producto.unidades}</td>
              <td>{producto.categoria}</td>
              <td>
                <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button> {/* Botón para eliminar */}
                <button onClick={() => handleEditClick(producto)}>Editar</button> {/* Botón para editar */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario de edición, se muestra solo si hay un producto seleccionado para editar */}
      {productoEdit.id && (
        <form onSubmit={(e) => { e.preventDefault(); editarProducto(productoEdit.id); }}>
          <h2>Editar Producto</h2>
          <input
            type="text"
            value={productoEdit.nombre}
            onChange={(e) => setProductoEdit({ ...productoEdit, nombre: e.target.value })}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            value={productoEdit.descripcion}
            onChange={(e) => setProductoEdit({ ...productoEdit, descripcion: e.target.value })}
            placeholder="Descripción"
            required
          />
          <input
            type="number"
            value={productoEdit.precio}
            onChange={(e) => setProductoEdit({ ...productoEdit, precio: e.target.value })}
            placeholder="Precio"
            required
          />
          <input
            type="text"
            value={productoEdit.talla}
            onChange={(e) => setProductoEdit({ ...productoEdit, talla: e.target.value })}
            placeholder="Talla"
            required
          />
          <input
            type="text"
            value={productoEdit.color}
            onChange={(e) => setProductoEdit({ ...productoEdit, color: e.target.value })}
            placeholder="Color"
            required
          />
          <input
            type="number"
            value={productoEdit.unidades}
            onChange={(e) => setProductoEdit({ ...productoEdit, unidades: e.target.value })}
            placeholder="Unidades"
            required
          />
          <input
            type="text"
            value={productoEdit.categoria}
            onChange={(e) => setProductoEdit({ ...productoEdit, categoria: e.target.value })}
            placeholder="Categoría"
            required
          />
          <button type="submit">Guardar cambios</button> {/* Botón para guardar cambios */}
          <button type="button" onClick={() => setProductoEdit({ id: '', nombre: '', descripcion: '', precio: '', talla: '', color: '', unidades: '', categoria: '' })}>Cancelar</button> {/* Botón para cancelar */}
        </form>
      )}
    </>
  );
}

export default Productos; // Exporta el componente Productos para usarlo en otras partes de la aplicación
