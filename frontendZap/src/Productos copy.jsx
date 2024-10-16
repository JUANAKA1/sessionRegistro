import { useEffect, useState } from 'react'; // Importación de hooks useEffect y useState de React
import './App.css'; // Importación del archivo CSS para estilos

function Productos({ recargar }) {
  const [productos, setProductos] = useState([]);

  const [productoEdit, setProductoEdit] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    talla: '',
    color: '',
    unidades: '',
    categoria: '',
    imagen: null // Nuevo campo para la imagen
  });

  async function obtenerProductos() {
    const peticion = await fetch('http://localhost:3000/productos', { credentials: 'include' });

    if (peticion.ok) {
      const respuesta = await peticion.json();
      setProductos(respuesta);
    }
  }

  async function eliminarProducto(id) {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      const peticion = await fetch(`http://localhost:3000/productos?id=${id}`, {
        credentials: 'include',
        method: 'DELETE'
      });

      if (peticion.ok) {
        alert("Producto eliminado");
        obtenerProductos();
      }
    }
  }

  async function editarProducto(id) {
    const { nombre, descripcion, precio, talla, color, unidades, categoria, imagen } = productoEdit;

    if (!nombre || !descripcion || !precio || !talla || !color || !unidades || !categoria) {
      alert("Por favor, complete todos los campos");
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('talla', talla);
    formData.append('color', color);
    formData.append('unidades', unidades);
    formData.append('categoria', categoria);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    const peticion = await fetch(`http://localhost:3000/productos?id=${id}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include'
    });

    if (peticion.ok) {
      alert("Producto actualizado");
      obtenerProductos();
      setProductoEdit({ id: '', nombre: '', descripcion: '', precio: '', talla: '', color: '', unidades: '', categoria: '', imagen: null });
    } else {
      alert("No se pudo actualizar el producto");
    }
  }

  function handleEditClick(producto) {
    setProductoEdit(producto);
  }

  function handleImageChange(e) {
    setProductoEdit({ ...productoEdit, imagen: e.target.files[0] });
  }

  useEffect(() => {
    obtenerProductos();
  }, [recargar]);

  return (
    <>
      <h1>Listado de Productos</h1>
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
            <th>Imagen</th> {/* Nueva columna para la imagen */}
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
                {producto.imagen && (
                  <img src={`http://localhost:3000/${producto.imagen}`} alt={producto.nombre} style={{ width: '100px' }} />
                )}
              </td>
              <td>
                <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
                <button onClick={() => handleEditClick(producto)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
          <input
            type="file"
            value={productoEdit.imagen}
            onChange={handleImageChange}
            accept="image/*"
          />
          <button type="submit">Guardar cambios</button>
          <button type="button" onClick={() => setProductoEdit({ id: '', nombre: '', descripcion: '', precio: '', talla: '', color: '', unidades: '', categoria: '', imagen: null })}>Cancelar</button>
        </form>
      )}
    </>
  );
}

export default Productos;
