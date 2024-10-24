import React, { useEffect, useState } from 'react';

function ProductosVenta() {
  const [productos, setProductos] = useState([]);
  const [recargar, setRecargar] = useState(false);

  // Función para obtener los productos desde el backend
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

  // Función para agregar un producto al carrito
  async function agregarAlCarrito(producto) {
    try {
      const response = await fetch('http://localhost:3000/carrito', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para enviar cookies con la solicitud
        body: JSON.stringify({
          producto_id: producto.id, // Usar el id del producto
          cantidad: 1 // Establecer cantidad a 1 por defecto
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json(); // Intenta parsear el error
        throw new Error(errorResponse.error || 'Error al agregar producto al carrito');
      }

      const data = await response.json(); // Parsear la respuesta correcta
      console.log(data.message); // Manejar la respuesta
      setRecargar(!recargar); // Cambiar el estado para volver a cargar los productos si es necesario
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  // Cargar productos cuando el componente se monta o el estado "recargar" cambia
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