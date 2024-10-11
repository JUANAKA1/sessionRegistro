import { useEffect, useState } from 'react'
import './App.css'
import Conversor from './Conversor'
import Usuarios from './Usuarios'
import Registro from './Registro'

function App() {
  const [usuario, setUsuario] = useState('') // Estado para guardar  el usuario
  const [clave, setClave] = useState('') // Estado para guardar la clave
  const [logeado, setLogeado] = useState(false) // Estado para saber si el usuario esta logeado
  const [recargar, setRecargar] = useState(false) //

  // funcion para cambiar el valor del usuario
  function cambiarUsuario(evento) {
    setUsuario(evento.target.value)
  }
  // funcion para cambiar el valor de la clave
  function cambiarClave(evento) {
    setClave(evento.target.value)
  }
  function recargarAhora() {
    setRecargar(!recargar)
  }
  // Funcion para ingresar al dar click en el boton
  async function ingresar() {
    const peticion = await fetch('http://localhost:3000/login?usuario=' + usuario + '&clave=' + clave, { credentials: 'include' })
    if (peticion.ok) {
      setLogeado(true)
    } else {
      alert('usuario o clave incorectos')
    }
  }

  async function validar() {
    const peticion = await fetch('http://localhost:3000/validar?usuario=' + usuario, { credentials: 'include' })
    if (peticion.ok) {
      setLogeado(true)
    }
  }


  useEffect(() => {
    validar()

  }, []);

  if (logeado) {
    return (
      <>
        <Registro recargarAhora={recargarAhora} />
        <Conversor />
        <Usuarios recargar={recargar} />
      </>)
  }
  return (
    <>
      <h1>Inicio de sesión</h1>
      <input placeholder='Usuario' id='usuario' type="text" value={usuario} onChange={cambiarUsuario} />
      <input placeholder='Clave' id='clave' type="password" value={clave} onChange={cambiarClave} />
      <button type="submit" onClick={ingresar}>Ingresar</button>

    </>
  )
}

export default App
