import { Link } from 'react-router-dom';
import './App.css';

function Navbar({ tipoUsuario }) { // Acepta tipoUsuario como prop
  return (
    <header className="container">
      <h1>Zapatería JM</h1>
      <nav aria-label="breadcrumb">
        <ul role="list" className="breadcrumb">
          {/* Muestra enlaces solo si el tipo de usuario es administrador */}
          {tipoUsuario === 'administrador' && (
            <>
              <li>
                <Link to="/usuarios">Usuarios</Link>
                <Link to="/registro">Registrar Usuario</Link>
              </li>
              <li>
                <Link to="/productos">Productos</Link>
                <Link to="/registroProductos">Registrar Productos</Link>
              </li>
            </>
          )}
          <li>
            <Link to="/conversor">Conversor</Link>
            <Link to="/tienda">Tienda de Zapatos</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;

