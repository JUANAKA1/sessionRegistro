// Navbar.js
import { Link } from 'react-router-dom';
import './Navbar.css'; // Asegúrate de tener un archivo CSS para estilos opcionales

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/Usuarios">Usuarios</Link> <br />
          <Link to="/Registro">Registrar Usuario</Link>
        </li>

        <li>
          <Link to="/Productos">Productos</Link> <br />
          <Link to="/registroProductos">Registrar Productos</Link>
        </li>
        <li>
          <Link to="/Conversor">Conversor</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
