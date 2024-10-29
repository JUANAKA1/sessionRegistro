import React, { useState, useEffect } from 'react';
import './App.css'; 

function ProductosVenta({ agregarAlCarrito }) {
  const [productos, setProductos] = useState([]);

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

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <div className="productos-container">
        <h2>Productos Disponibles</h2>
        <div className="productos-lista">
          {productos.map(producto => (
            <div key={producto.id} className="producto-card">
              <img src={`http://localhost:3000/${producto.imagen}`} alt={producto.nombre} style={{ width: '300px', height: '300px' }} />
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
  );
}

export default ProductosVenta;
