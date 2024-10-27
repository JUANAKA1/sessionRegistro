import React, { useEffect, useState } from 'react';

function ProductosVenta() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [recargar, setRecargar] = useState(false);

  // Función para obtener los productos disponibles
  async function obtenerProductos() {
    try {
      const response = await fetch('http://localhost:3000/productos', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        console.error("Error al obtener productos:", response.statusText);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  }

  // Función para obtener los productos en el carrito
  async function obtenerCarrito() {
    try {
      const response = await fetch('http://localhost:3000/carrito', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setCarrito(data);
      } else {
        console.error("Error al obtener el carrito:", response.statusText);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  }

  // Función para agregar un producto al carrito
  async function agregarAlCarrito(producto) {
    try {
      const response = await fetch('http://localhost:3000/carrito/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ producto_id: producto.id, cantidad: 1 })
      });

      if (response.ok) {
        setRecargar(!recargar); // Recargar el carrito
      } else {
        console.error("Error al agregar al carrito:", response.statusText);
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  }

  // Función para eliminar un producto del carrito
  async function eliminarDelCarrito(producto_id) {
    try {
      const response = await fetch('http://localhost:3000/carrito/eliminar', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ producto_id })
      });

      if (response.ok) {
        setRecargar(!recargar); // Recargar el carrito
      } else {
        console.error("Error al eliminar del carrito:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  }

  // Función para actualizar la cantidad de un producto en el carrito
  async function actualizarCantidad(producto_id, nuevaCantidad) {
    try {
      const response = await fetch('http://localhost:3000/carrito/editar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ producto_id, cantidad: nuevaCantidad })
      });

      if (response.ok) {
        setRecargar(!recargar); // Recargar el carrito
      } else {
        console.error("Error al actualizar el carrito:", response.statusText);
      }
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
    }
  }

  // Cargar productos y carrito cuando el componente se monta o el estado "recargar" cambia
  useEffect(() => {
    obtenerProductos();
    obtenerCarrito();
  }, [recargar]);

  return (
    <div>
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

      <h2>Carrito de Compras</h2>
      <div>
        {carrito.map(item => (
          <div key={item.producto_id}>
            <h3>{item.nombre}</h3>
            <p>Precio: ${item.precio}</p>
            <p>Cantidad: 
              <input
                type="number"
                value={item.cantidad}
                onChange={(e) => actualizarCantidad(item.producto_id, e.target.value)}
              />
            </p>
            <button onClick={() => eliminarDelCarrito(item.producto_id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductosVenta;
