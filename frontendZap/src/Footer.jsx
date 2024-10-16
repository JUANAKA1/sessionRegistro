// Footer.js
import React from 'react';
import './App.css'; 
function Footer() {
  return (
    <footer>
      <div>
        <p>&copy; {new Date().getFullYear()} Zapateria JM. Todos los derechos reservados.</p>
        <ul className="footer-links">
          <li><a href="/about">Acerca de</a></li>
          <li><a href="/contact">Contacto</a></li>
          <li><a href="/privacy">Política de privacidad</a></li>
          <li><a href="/terms">Términos y condiciones</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
