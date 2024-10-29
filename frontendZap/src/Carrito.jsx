// Carrito.js
import React, { useState, useEffect } from 'react';
import './App.css'; 

function Carrito({ carrito, obtenerCarrito, actualizarCantidad, eliminarDelCarrito, procederAlPago }) {
  const [cantidades, setCantidades] = useState({});
  const [mensaje, setMensaje] = useState('');

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

  useEffect(() => {
    obtenerCarrito();
  }, []);

  return (
    <div className="carrito-container">
      <h2>Carrito de Compras</h2>
      <div className="carrito-lista">
        {carrito.map(item => (
          <div key={item.producto_id} className="carrito-item">
            <img src={`http://localhost:3000/${item.imagen}`} alt={item.nombre} style={{ width: '150px', height: '150px' }} />
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
            <button className="eliminar" onClick={() => eliminarDelCarrito(item.producto_id)}>Eliminar</button>
          </div>
        ))}
      </div>
      <button className="proceder-pago" onClick={procederAlPago}>Proceder al Pago</button>
      {mensaje && <p className="mensaje">{mensaje}</p>}
    </div>
  );
}

export default Carrito;
