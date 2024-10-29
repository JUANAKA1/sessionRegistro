// Tienda.js
import React, { useState, useEffect } from 'react';
import ProductosVenta from './ProductosVenta';
import Carrito from './Carrito';
import './App.css'; 


function Tienda() {
  const [carrito, setCarrito] = useState([]);
  const [recargar, setRecargar] = useState(false);

  // Función para obtener el carrito
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
        body: JSON.stringify({ producto_id, cantidad: Number(nuevaCantidad) })
      });

      if (response.ok) {
        setRecargar(!recargar);
      } else {
        console.error("Error al actualizar el carrito:", response.statusText);
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
      } else {
        console.error("Error al procesar el pago:", response.statusText);
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    }
  }

  useEffect(() => {
    obtenerCarrito();
  }, [recargar]);

  return (
    <div>
      <div className="productos-container">
        <ProductosVenta agregarAlCarrito={agregarAlCarrito} />
      </div>
      <div className="carrito-container">
        <Carrito
          carrito={carrito}
          obtenerCarrito={obtenerCarrito}
          actualizarCantidad={actualizarCantidad}
          eliminarDelCarrito={eliminarDelCarrito}
          procederAlPago={procederAlPago}
        />
      </div>
    </div>
  );
}

export default Tienda;
