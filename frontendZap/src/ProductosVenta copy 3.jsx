import React, { useEffect, useState } from 'react';

function ProductosVenta() {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [recargar, setRecargar] = useState(false);
  const [cantidades, setCantidades] = useState({});
  const [mensaje, setMensaje] = useState('');

  // Función para obtener los productos
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

  // Función para obtener el carrito
  async function obtenerCarrito() {
    try {
      const response = await fetch('http://localhost:3000/carrito', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setCarrito(data);
        const cantidadesIniciales = data.reduce((acc, item) => {
          acc[item.producto_id] = item.cantidad;
          return acc;
        }, {});
        setCantidades(cantidadesIniciales);
      } else {
        console.error("Error al obtener el carrito:", response.statusText);
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  }

  // Función para agregar un producto al carrito
  async function agregarAlCarrito(producto) {
    const productoEnCarrito = carrito.find(item => item.producto_id === producto.id);
    const nuevaCantidad = productoEnCarrito ? productoEnCarrito.cantidad + 1 : 1;

    try {
      const response = await fetch('http://localhost:3000/carrito/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ producto_id: producto.id, cantidad: nuevaCantidad })
      });

      if (response.ok) {
        setRecargar(!recargar);
        setMensaje("Producto agregado al carrito");
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
        setRecargar(!recargar);
        setMensaje("Producto eliminado del carrito");
      } else {
        console.error("Error al eliminar del carrito:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar del carrito:", error);
    }
  }

  // Función para actualizar la cantidad de un producto en el carrito
  async function actualizarCantidad(producto_id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
      alert('La cantidad debe ser mayor que cero.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/carrito/editar', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ producto_id, cantidad: Number(nuevaCantidad) })
      });

      if (response.ok) {
        setRecargar(!recargar);
        setMensaje("Cantidad actualizada exitosamente");
      } else {
        const errorData = await response.json();
        alert(errorData.error);
      }
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
    }
  }

  // Función para proceder al pago
  async function procederAlPago() {
    try {
      const response = await fetch('http://localhost:3000/carrito/pago', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        setRecargar(!recargar);
        setMensaje("Pago procesado exitosamente");
      } else {
        console.error("Error al procesar el pago:", response.statusText);
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  }

  // Manejar el cambio en la cantidad
  const handleCantidadChange = (producto_id, nuevaCantidad) => {
    setCantidades(prev => ({
      ...prev,
      [producto_id]: nuevaCantidad
    }));
  };

  const handleCantidadBlur = (producto_id) => {
    const nuevaCantidad = Number(cantidades[producto_id]);
    if (nuevaCantidad > 0) {
      actualizarCantidad(producto_id, nuevaCantidad);
    } else {
      alert('La cantidad debe ser mayor que cero.');
    }
  };

  // Efecto para cargar productos y carrito
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
              <img src={`http://localhost:3000/${producto.imagen}`} alt={producto.nombre} style={{ width: '200px', height: '200px' }} />
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p>Precio: ${producto.precio}</p>
              <p>Talla: {producto.talla}</p>
              <p>Color: {producto.color}</p>
              <p>Unidades disponibles: {producto.unidades}</p>
              <button onClick={() => agregarAlCarrito(producto)}>Agregar al Carrito</button>
            </div>
          ))}
        </div>
      </div>

      <h2>Carrito de Compras</h2>
      <div className="carrito-lista">
        {carrito.map(item => (
          <div key={item.producto_id} className="carrito-item">
            <img src={`http://localhost:3000/${item.imagen}`} alt={item.nombre} style={{ width: '100px', height: '100px' }} />
            <h3>{item.nombre}</h3>
            <p>Precio: ${item.precio}</p>
            <p>Total: ${item.precio_total}</p>
            <p>Cantidad: 
              <input
                type="number"
                value={cantidades[item.producto_id] || item.cantidad}
                onChange={(e) => handleCantidadChange(item.producto_id, e.target.value)}
                onBlur={() => handleCantidadBlur(item.producto_id)}
              />
            </p>
            <button onClick={() => eliminarDelCarrito(item.producto_id)}>Eliminar</button>
          </div>
        ))}
      </div>

      <button onClick={procederAlPago}>Proceder al Pago</button>
      {mensaje && <p>{mensaje}</p>} {/* Mensaje de confirmación */}
    </div>
  );
}

export default ProductosVenta;