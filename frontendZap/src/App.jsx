import { useEffect, useState } from 'react' // Importación de hooks useEffect y useState de React
import './App.css' // Importación del archivo CSS para estilos
import Conversor from './Conversor' // Importación del componente Conversor
import Usuarios from './Usuarios' // Importación del componente Usuarios
import Registro from './Registro' // Importación del componente Registro

function App() {
  // Declaración de estados con useState
  const [usuario, setUsuario] = useState('') // Estado para guardar el nombre de usuario
  const [clave, setClave] = useState('') // Estado para guardar la clave
  const [logeado, setLogeado] = useState(false) // Estado para indicar si el usuario está logeado
  const [recargar, setRecargar] = useState(false) // Estado para controlar la recarga de componentes

  // Función para cambiar el valor del usuario al escribir en el input
  function cambiarUsuario(evento) {
    setUsuario(evento.target.value) // Actualiza el estado del usuario con el valor del input
  }
  
  // Función para cambiar el valor de la clave al escribir en el input
  function cambiarClave(evento) {
    setClave(evento.target.value) // Actualiza el estado de la clave con el valor del input
  }

  // Función para alternar el estado de recargar
  function recargarAhora() {
    setRecargar(!recargar) // Cambia el valor de recargar al valor contrario
  }

  // Función para manejar el ingreso al hacer clic en el botón
  async function ingresar() {
    // Realiza una solicitud a la API para autenticar al usuario
    const peticion = await fetch('http://localhost:3000/login?usuario=' + usuario + '&clave=' + clave, { credentials: 'include' })
    
    // Si la respuesta es exitosa
    if (peticion.ok) {
      setLogeado(true) // Cambia el estado logeado a verdadero
    } else {
      alert('usuario o clave incorrectos') // Muestra un mensaje de error
    }
  }

  // Función para validar si el usuario ya está logueado
  async function validar() {
    // Realiza una solicitud a la API para verificar la sesión del usuario
    const peticion = await fetch('http://localhost:3000/validar?usuario=' + usuario, { credentials: 'include' })
    
    // Si la respuesta es exitosa
    if (peticion.ok) {
      setLogeado(true) // Cambia el estado logeado a verdadero
    }
  }

  // Hook useEffect para validar al cargar el componente
  useEffect(() => {
    validar() // Llama a la función validar al montar el componente
  }, []);

  // Renderiza la interfaz dependiendo del estado logeado
  if (logeado) {
    return (
      <>
        <Registro recargarAhora={recargarAhora} /> 
        <Conversor /> 
        <Usuarios recargar={recargar} /> 
      </>
    )
  }
  
  return (
    <>
      <h1>Inicio de sesión</h1> 
      <input placeholder='Usuario' id='usuario' type="text" value={usuario} onChange={cambiarUsuario} /> 
      <input placeholder='Clave' id='clave' type="password" value={clave} onChange={cambiarClave} /> 
      <button type="submit" onClick={ingresar}>Ingresar</button> 
      <Registro />
    </>
  )
}

export default App // Exporta el componente App para usarlo en otras partes de la aplicación
