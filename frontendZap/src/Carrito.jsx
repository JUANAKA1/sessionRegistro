import React, { useState } from 'react';
import ProductosVenta from './ProductosVenta';
import './App.css';
function Carrito() {
  const [carrito, setCarrito] = useState([]);

  function agregarAlCarrito(producto) {
    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
      const nuevoCarrito = carrito.map(item => 
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      setCarrito(nuevoCarrito);
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }

    console.log("Producto agregado al carrito:", producto);
    alert(`${producto.nombre} ha sido agregado al carrito.`);
  }

  return (
    <div className="App">
      <h1>Tienda de Zapatos</h1>
      <div className="contenedor">
        <div className="productos-venta">
          <ProductosVenta agregarAlCarrito={agregarAlCarrito} />
        </div>
        <div className="carrito">
          <h2>Carrito</h2>
          {carrito.map(item => (
            <div key={item.id}>
              <p>{item.nombre} - Cantidad: {item.cantidad}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Carrito;
