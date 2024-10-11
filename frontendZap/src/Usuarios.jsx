import { useEffect, useState } from 'react';
import './App.css';

function Usuarios({ recargar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioEdit, setUsuarioEdit] = useState({ id: '', usuario: '', clave: '' });
  
  async function obtenerUsuarios() {
    const peticion = await fetch('http://localhost:3000/usuarios', { credentials: 'include' });
    if (peticion.ok) {
      const respuesta = await peticion.json();
      setUsuarios(respuesta);
    }
  }

  async function eliminarUsuario(id) {
    const peticion = await fetch(`http://localhost:3000/usuarios?id=${id}`, { credentials: 'include', method: 'DELETE' });
    if (peticion.ok) {
      alert("Usuario eliminado");
      obtenerUsuarios();
    }
  }

  async function editarUsuario(id) {
    const peticion = await fetch(`http://localhost:3000/usuarios?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, usuario: usuarioEdit.usuario, clave: usuarioEdit.clave }),
      credentials: 'include'
    });
    if (peticion.ok) {
      alert("Usuario actualizado");
      obtenerUsuarios();
      setUsuarioEdit({ id: '', usuario: '', clave: '' });
    } else {
      alert("No se pudo actualizar el usuario");
    }
  }

  function handleEditClick(usuario) {
    setUsuarioEdit(usuario);
  }

  useEffect(() => {
    obtenerUsuarios();
  }, [recargar]);

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Usuario</th>
            <th>Clave</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.clave}</td>
              <td>
                <button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
                <button onClick={() => handleEditClick(usuario)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Formulario de edición */}
      {usuarioEdit.id && (
        <form onSubmit={(e) => { e.preventDefault(); editarUsuario(usuarioEdit.id); }}>
          <h2>Editar Usuario</h2>
          <input
            type="text"
            value={usuarioEdit.usuario}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, usuario: e.target.value })}
            placeholder="Nuevo nombre de usuario"
          />
          <input
            type="password"
            value={usuarioEdit.clave}
            onChange={(e) => setUsuarioEdit({ ...usuarioEdit, clave: e.target.value })}
            placeholder="Nueva clave"
          />
          <button type="submit">Guardar cambios</button>
          <button type="button" onClick={() => setUsuarioEdit({ id: '', usuario: '', clave: '' })}>Cancelar</button>
        </form>
      )}
    </>
  );
}

export default Usuarios;
