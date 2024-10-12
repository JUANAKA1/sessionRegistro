import { useEffect, useState } from 'react'
import './App.css'

function Registro ({ recargarAhora }) {

  const [usuarioRegistro, setUsuarioRegistro] = useState('')
  const [claveRegistro, setClaveRegistro] = useState('')
  const [nombreRegistro, setNombreRegistro] = useState('')
  const [emailRegistro, setEmailRegistro] = useState('')
  const [ccRegistro, setCcRegistro] = useState('')
  const [telefonoRegistro, setTelefonoRegistro] = useState('')

  function cambiarUsuarioRegistro(evento) {
    setUsuarioRegistro(evento.target.value)
  }
  function cambiarClaveRegistro(evento) {
    setClaveRegistro(evento.target.value)
  }
  function cambiarNombreRegistro(evento) {
    setNombreRegistro(evento.target.value)
  }
  function cambiarEmailRegistro(evento) {
    setEmailRegistro(evento.target.value)
  }
  function cambiarCcRegistro(evento) {
    setCcRegistro(evento.target.value)
  }
  function cambiarTelefonoRegistro(evento) {
    setTelefonoRegistro(evento.target.value)
  }

  async function registrar() {
    const peticion = await fetch(
      `http://localhost:3000/registro?usuario=${usuarioRegistro}&clave=${claveRegistro}&nombre=${nombreRegistro}&email=${emailRegistro}&cc=${ccRegistro}&telefono=${telefonoRegistro}`, 
      { credentials: 'include' }
    )
    if (peticion.ok) {
      alert("Usuario registrado")
      recargarAhora()
    } else {
      alert('Usuario no registrado')
    }
  }

  useEffect(() => {}, [])

  return (
    <>
      <h1>Registro</h1>
      <input placeholder='Usuario' id='usuario' type="text" value={usuarioRegistro} onChange={cambiarUsuarioRegistro} />
      <input placeholder='Clave' id='clave' type="password" value={claveRegistro} onChange={cambiarClaveRegistro} />
      <input placeholder='Nombre' id='nombre' type="text" value={nombreRegistro} onChange={cambiarNombreRegistro} />
      <input placeholder='Email' id='email' type="email" value={emailRegistro} onChange={cambiarEmailRegistro} />
      <input placeholder='Cédula' id='cc' type="text" value={ccRegistro} onChange={cambiarCcRegistro} />
      <input placeholder='Teléfono' id='telefono' type="text" value={telefonoRegistro} onChange={cambiarTelefonoRegistro} />
      <button type="submit" onClick={registrar}>Registrar</button>
    </>
  )
}

export default Registro
