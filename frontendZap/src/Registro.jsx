import { useEffect, useState } from 'react'
import './App.css'

function Registro ({recargarAhora}) {

  const [usuarioRegistro, setUsuarioRegistro] = useState('') // Estado para guardar  el usuario
  const [claveRegistro, setClaveRegistro] = useState('')

  // funcion para cambiar el valor del usuario
  function cambiarUsuarioRegistro(evento) {
    setUsuarioRegistro(evento.target.value)
  }
  // funcion para cambiar el valor de la clave
  function cambiarClaveRegistro(evento) {
    setClaveRegistro(evento.target.value)
  }

  async function registrar() {
    const peticion = await fetch('http://localhost:3000/registro?usuario=' + usuarioRegistro + '&clave=' + claveRegistro, { credentials: 'include' })
    if (peticion.ok) {
      alert("Usuario registrado")
      recargarAhora() // Llama a la función que recarga la página para mostrar los usuarios registrados
    } else {
      alert('Usuario no registrado')
    }
  }

  useEffect(() => {
  }, [])

  return (
    <>
          <h1>Registro</h1>
      <input placeholder='Usuario' id='usuario' type="text" value={usuarioRegistro} onChange={cambiarUsuarioRegistro} />
      <input placeholder='Clave' id='clave' type="password" value={claveRegistro} onChange={cambiarClaveRegistro} />
      <button type="submit" onClick={registrar}>Registrar</button>

    </>
  )
}

export default Registro
