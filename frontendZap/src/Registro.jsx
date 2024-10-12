import { useEffect, useState } from 'react'; // Importación de hooks de React
import './App.css'; // Importación del archivo CSS para estilos

function Registro({ recargarAhora }) {
  // Estados para almacenar los datos de registro del usuario
  const [usuarioRegistro, setUsuarioRegistro] = useState('');
  const [claveRegistro, setClaveRegistro] = useState('');
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [emailRegistro, setEmailRegistro] = useState('');
  const [ccRegistro, setCcRegistro] = useState('');
  const [telefonoRegistro, setTelefonoRegistro] = useState('');

  // Funciones para manejar cambios en los inputs
  function cambiarUsuarioRegistro(evento) {
    setUsuarioRegistro(evento.target.value);
  }
  
  function cambiarClaveRegistro(evento) {
    setClaveRegistro(evento.target.value);
  }
  
  function cambiarNombreRegistro(evento) {
    setNombreRegistro(evento.target.value);
  }
  
  function cambiarEmailRegistro(evento) {
    setEmailRegistro(evento.target.value);
  }
  
  function cambiarCcRegistro(evento) {
    setCcRegistro(evento.target.value);
  }
  
  function cambiarTelefonoRegistro(evento) {
    setTelefonoRegistro(evento.target.value);
  }

  // Función para registrar un nuevo usuario
  async function registrar() {
    const peticion = await fetch(
      `http://localhost:3000/registro?usuario=${usuarioRegistro}&clave=${claveRegistro}&nombre=${nombreRegistro}&email=${emailRegistro}&cc=${ccRegistro}&telefono=${telefonoRegistro}`, 
      { credentials: 'include' } // Incluye las credenciales para la sesión
    );
    
    // Si la respuesta es exitosa
    if (peticion.ok) {
      alert("Usuario registrado"); // Mensaje de confirmación
      recargarAhora(); // Llama a la función para recargar el estado o la lista de usuarios
    } else {
      alert('Usuario no registrado'); // Mensaje de error
    }
  }

  useEffect(() => {
  }, []);

  return (
    <>
      <h1>Registro</h1>
      <input 
        placeholder='Usuario' 
        id='usuario' 
        type="text" 
        value={usuarioRegistro} 
        onChange={cambiarUsuarioRegistro} 
      />
      <input 
        placeholder='Clave' 
        id='clave' 
        type="password" 
        value={claveRegistro} 
        onChange={cambiarClaveRegistro} 
      />
      <input 
        placeholder='Nombre' 
        id='nombre' 
        type="text" 
        value={nombreRegistro} 
        onChange={cambiarNombreRegistro} 
      />
      <input 
        placeholder='Email' 
        id='email' 
        type="email" 
        value={emailRegistro} 
        onChange={cambiarEmailRegistro} 
      />
      <input 
        placeholder='Cédula' 
        id='cc' 
        type="text" 
        value={ccRegistro} 
        onChange={cambiarCcRegistro} 
      />
      <input 
        placeholder='Teléfono' 
        id='telefono' 
        type="text" 
        value={telefonoRegistro} 
        onChange={cambiarTelefonoRegistro} 
      />
      <button type="submit" onClick={registrar}>Registrar</button> {/* Botón para registrar */}
    </>
  );
}

export default Registro; // Exporta el componente Registro para usarlo en otras partes de la aplicación