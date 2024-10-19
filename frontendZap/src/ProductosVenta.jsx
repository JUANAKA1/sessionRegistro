import { useEffect, useState } from 'react';

function ProductosVenta({ recargar, agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);

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
            {/* Imagen del producto */}
            <img src={`http://localhost:3000/${producto.imagen}`} alt={producto.nombre} style={{ width: '400px', height: '400px' }} />
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p>Precio: ${producto.precio}</p>
            <p>Talla: {producto.talla}</p>
            <p>Color: {producto.color}</p>
            <p>Unidades disponibles: {producto.unidades}</p>
            {/* Botón de Agregar al Carrito */}
            <button onClick={() => agregarAlCarrito(producto)}>Agregar al Carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductosVenta;
