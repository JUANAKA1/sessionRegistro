import { useState } from 'react'
import './App.css'

function Conversor() {
  
  const [texto, setTexto] = useState('') // Estado para
  const [voz, setVoz] = useState('') // Estado


  function cambiarTexto(evento) {
    setTexto(evento.target.value)
  }

  function textoAVoz() {
    const configuracion = new SpeechSynthesisUtterance(texto);
    speechSynthesis.speak(configuracion);
  }
  
  function vozATexto(){
    const agente = new webkitSpeechRecognition()
    agente.start()
    agente.onresult = resultado
  }
  function resultado(informacion){
    console.log(informacion.results[0][0].transcript)  // Mostrar resultados en consola
    setVoz(informacion.results[0][0].transcript)
  }

  function borrar() {
    setTexto('');
    setVoz('');
  }
  
    return(
      <>
      <h1>Panel de control</h1>
      <h2>Conversor de TTS y STT</h2>
      <input type="text" value={texto} onChange={cambiarTexto} placeholder="Escribe el texto aquí"/>
      <button type="submit" onClick={textoAVoz}>Convertir</button>
      <h2>Conversor voz a texto</h2>
      <button type="submit" onClick={vozATexto}>Grabar</button>
      <p>Voz: {voz}</p>
      <button onClick={borrar}>Borrar</button>
      </>
    )
  }


export default Conversor
