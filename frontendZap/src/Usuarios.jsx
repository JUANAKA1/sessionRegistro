import { useEffect, useState } from 'react'; // Importación de hooks useEffect y useState de React
import './App.css'; // Importación del archivo CSS para estilos

function Usuarios({ recargar }) {
  // Estado para almacenar la lista de usuarios
  const [usuarios, setUsuarios] = useState([]);
  
  // Estado para almacenar los datos del usuario que se está editando
  const [usuarioEdit, setUsuarioEdit] = useState({
    id: '',
    usuario: '',
    clave: '',
    nombre: '',
    email: '',
    cc: '', // Cédula
    telefono: ''
  });
  
  // Función para obtener la lista de usuarios desde la API
  async function obtenerUsuarios() {
    const peticion = await fetch('http://localhost:3000/usuarios', { credentials: 'include' });
    
    // Si la respuesta es exitosa
    if (peticion.ok) {
      const respuesta = await peticion.json(); // Convierte la respuesta a formato JSON
      setUsuarios(respuesta); // Actualiza el estado de usuarios con los datos recibidos
    }
  }

  // Función para eliminar un usuario
  async function eliminarUsuario(id) {
    // Confirma si el usuario realmente quiere eliminarlo
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      const peticion = await fetch(`http://localhost:3000/usuarios?id=${id}`, { 
        credentials: 'include', 
        method: 'DELETE' // Método para eliminar
      });
      
      // Si la respuesta es exitosa
      if (peticion.ok) {
        alert("Usuario eliminado"); // Mensaje de confirmación
        obtenerUsuarios(); // Vuelve a cargar la lista de usuarios
      }
    }
  }

  // Función para editar un usuario
  async function editarUsuario(id) {
    // Desestructura los valores del usuario que se va a editar
    const { usuario, clave, nombre, email, cc, telefono } = usuarioEdit;
    
    // Valida que todos los campos estén completos
    if (!usuario || !clave || !nombre || !email || !cc || !telefono) {
      alert("Por favor, complete todos los campos"); // Mensaje de error
      return; // Sale de la función si faltan campos
    }

    const peticion = await fetch(`http://localhost:3000/usuarios?id=${id}`, {
      method: 'PUT', // Método para actualizar
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, usuario, clave, nombre, email, cc, telefono }), // Envía los datos como JSON
      credentials: 'include'
    });
    
    // Si la respuesta es exitosa
    if (peticion.ok) {
      alert("Usuario actualizado"); // Mensaje de confirmación
      obtenerUsuarios(); // Vuelve a cargar la lista de usuarios
      // Reinicia el estado del usuario que se está editando
      setUsuarioEdit({ id: '', usuario: '', clave: '', nombre: '', email: '', cc: '', telefono: '' });
    } else {
      alert("No se pudo actualizar el usuario"); // Mensaje de error
    }
  }

  // Función para manejar el clic en el botón de editar
  function handleEditClick(usuario) {
    setUsuarioEdit(usuario); // Establece el usuario seleccionado en el estado de edición
  }

  // Hook useEffect para cargar la lista de usuarios cuando el componente se monta o se recarga
  useEffect(() => {
    obtenerUsuarios(); // Llama a la función para obtener usuarios
  }, [recargar]); // Dependencia de recargar, para volver a obtener usuarios cuando cambie

  return (
    <>
    <h1>Listado de Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Usuario</th>
            <th>Clave</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Cédula</th>
            <th>Teléfono</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.clave}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.cc}</td>
              <td>{usuario.telefono}</td>
              <td>
                <button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button> {/* Botón para eliminar */}
                <button onClick={() => handleEditClick(usuario)}>Editar</button> {/* Botón para editar */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario de edición, se muestra solo si hay un usuario seleccionado para editar */}
      {usuarioEdit.id && (
        <form onSubmit={(e) => { e.preventDefault(); editarUsuario(usuarioEdit.id); }}>
          <h2>Editar Usuario</h2>
          <input
            type="text"
            value={usuarioEdit.usuario}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, usuario: e.target.value })}
            placeholder="Nuevo nombre de usuario"
            required
          />
          <input
            type="password"
            value={usuarioEdit.clave}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, clave: e.target.value })}
            placeholder="Nueva clave"
            required
          />
          <input
            type="text"
            value={usuarioEdit.nombre}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, nombre: e.target.value })}
            placeholder="Nombre"
            required
          />
          <input
            type="email"
            value={usuarioEdit.email}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, email: e.target.value })}
            placeholder="Email"
            required
          />
          <input
            type="text"
            value={usuarioEdit.cc}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, cc: e.target.value })}
            placeholder="Cédula"
            required
          />
          <input
            type="text"
            value={usuarioEdit.telefono}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, telefono: e.target.value })}
            placeholder="Teléfono"
            required
          />
          <button type="submit">Guardar cambios</button> {/* Botón para guardar cambios */}
          <button type="button" onClick={() => setUsuarioEdit({ id: '', usuario: '', clave: '', nombre: '', email: '', cc: '', telefono: '' })}>Cancelar</button> {/* Botón para cancelar */}
        </form>
      )}
    </>
  );
}

export default Usuarios; // Exporta el componente Usuarios para usarlo en otras partes de la aplicación
