import { useEffect, useState } from 'react';

function ProductosVenta({ recargar }) {
  const [productos, setProductos] = useState([]);
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

  async function obtenerProductos() {
    try {
      const peticion = await fetch('http://localhost:3000/productos', { credentials: 'include' });
      if (peticion.ok) {
        const respuesta = await peticion.json();
        setProductos(respuesta);
      } else {
        console.error("Error al obtener productos:", peticion.statusText);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  }

  useEffect(() => {
    obtenerProductos();
  }, [recargar]);

  return (
    <div className="productos">
      <h2>Productos Disponibles</h2>
      <div className="producto-lista">
        {productos.map(producto => (
          <div key={producto.id} className="producto-card">
            <img src={producto.imagen} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <p>Talla: {producto.talla}</p>
            <p>Color: {producto.color}</p>
            <p>Unidades disponibles: {producto.unidades}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductosVenta;
