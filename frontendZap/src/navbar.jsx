// Navbar.js
import { Link } from 'react-router-dom';
import './App.css'; 

function navbar() {
  return (
    <header className="container">
      <h1>Zapatería JM</h1>
      <nav aria-label="breadcrumb">
        <ul role="list" className="breadcrumb">
          <li>
            <Link to="/Usuarios">Usuarios</Link>
            <Link to="/Registro">Registrar Usuario</Link>
          </li>
          <li>
            <Link to="/Productos">Productos</Link>
            <Link to="/registroProductos">Registrar Productos</Link>
          </li>
          <li>
            <Link to="/Conversor">Conversor</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default navbar;
