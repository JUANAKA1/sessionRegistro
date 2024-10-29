import { useEffect, useState } from 'react'; // Importación de hooks useEffect y useState de React
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Importación de react-router-dom
import './App.css'; // Importación del archivo CSS para estilos
import Conversor from './Conversor'; // Importación del componente Conversor
import Usuarios from './Usuarios'; // Importación del componente Usuarios
import Registro from './Registro'; // Importación del componente Registro
import RegistroProductos from './RegistroProductos'; // Importación del componente RegistroProductos
import Productos from './Productos'; // Importación del componente Productos
import Navbar from './Navbar'; // Asegúrate de que el nombre sea correcto
import ProductosVenta from './ProductosVenta';
import Footer from './Footer';
import Tienda from './Tienda';


function App() {
  // Declaración de estados con useState
  const [usuario, setUsuario] = useState(''); // Estado para guardar el nombre de usuario
  const [clave, setClave] = useState(''); // Estado para guardar la clave
  const [logeado, setLogeado] = useState(false); // Estado para indicar si el usuario está logeado
  const [recargar, setRecargar] = useState(false); // Estado para controlar la recarga de componentes
  const [mostrarRegistro, setMostrarRegistro] = useState(false); // Estado para controlar la visibilidad del formulario de registro
  const [tipoUsuario, setTipoUsuario] = useState(''); // Estado para almacenar el tipo de usuario
  // Función para cambiar el valor del usuario al escribir en el input
  function cambiarUsuario(evento) {
    setUsuario(evento.target.value); // Actualiza el estado del usuario con el valor del input
  }

  // Función para cambiar el valor de la clave al escribir en el input
  function cambiarClave(evento) {
    setClave(evento.target.value); // Actualiza el estado de la clave con el valor del input
  }

  // Función para alternar el estado de recargar
  function recargarAhora() {
    setRecargar(!recargar); // Cambia el valor de recargar al valor contrario
  }

  // Función para manejar el ingreso al hacer clic en el botón
  async function ingresar() {
    const peticion = await fetch(`http://localhost:3000/login?usuario=${usuario}&clave=${clave}`, { credentials: 'include' });
    if (peticion.ok) {
        const datos = await peticion.json(); // Suponiendo que el backend devuelve el tipo de usuario
        setLogeado(true);
        setTipoUsuario(datos.tipo_usuario); // Almacena el tipo de usuario
    } else {
        alert('usuario o clave incorrectos');
    }
}

  // Función para validar si el usuario ya está logueado
  async function validar() {
    const peticion = await fetch(`http://localhost:3000/validar?usuario=${usuario}`, { credentials: 'include' });
    if (peticion.ok) {
      setLogeado(true); // Cambia el estado logeado a verdadero
    }
  }

  // Hook useEffect para validar al cargar el componente
  useEffect(() => {
    validar(); // Llama a la función validar al montar el componente
  }, []);

  // Función para alternar la visibilidad del formulario de registro
  function toggleRegistro() {
    setMostrarRegistro(!mostrarRegistro); // Cambia el estado de mostrarRegistro al valor contrario
  }


     return (
        <Router>
            {logeado ? (
                <>
                    <Navbar tipoUsuario={tipoUsuario} /> {/* Pasa el tipo de usuario al Navbar */}
                    <Routes>
                        <Route path="/tienda" element={<Tienda />} />
                        
                        {tipoUsuario === 'administrador' && (
                            <>
                                <Route path="/usuarios" element={<Usuarios recargar={recargar} />} />
                                <Route path="/registro" element={<Registro recargarAhora={recargarAhora} />} />
                                <Route path="/registroProductos" element={<RegistroProductos recargarAhora={recargarAhora} />} />
                                <Route path="/productos" element={<Productos recargar={recargar} />} />
                            </>
                        )}

                        <Route path="/tienda" element={<Tienda recargar={recargar} />} /> 
                        <Route path="/conversor" element={<Conversor />} />
                        
                        <Route path="*" element={<Navigate to="/tienda" />} />
                    </Routes>
                    <Footer />
                </>
            ) : (
                <div>
                    <h1>Inicio de sesión</h1>
                    <input placeholder='Usuario' id='usuario' type="text" value={usuario} onChange={cambiarUsuario} required/>
                    <input placeholder='Clave' id='clave' type="password" value={clave} onChange={cambiarClave} required/>
                    <button type="submit" onClick={ingresar}>Ingresar</button>
                    
                    <button onClick={toggleRegistro}>
                        {mostrarRegistro ? 'Registro' : '¿Desea Registrarse ?'}
                    </button>
                    
                    {mostrarRegistro && <Registro recargarAhora={recargarAhora} />}
                </div>
            )}
        </Router>
);
}

export default App; // Exporta el componente App para usarlo en otras partes de la aplicación
