function obtenerUsuarios() {
  return JSON.parse(localStorage.getItem('usuarios')) || [];
}

function guardarUsuarios(usuarios) {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function buscarUsuario(nombreUsuario) {
  return obtenerUsuarios().find(u => u.usuario === nombreUsuario);
}

function usuarioActual() {
  return buscarUsuario(localStorage.getItem('sesion'));
}

function mostrarMensaje(texto, tipo = 'error') {
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = texto;
  mensaje.className = texto ? 'alert alert--' + tipo : '';
}

function validarClave(clave, confirmacion) {
  if (clave.length < 6) return 'La contraseña debe tener al menos 6 caracteres.';
  if (clave !== confirmacion) return 'Las contraseñas no coinciden.';
  return '';
}

function registrar(evento) {
  evento.preventDefault();
  const form = evento.target;
  const usuario = form.usuario.value.trim();
  const error = validarClave(form.password.value, form.password2.value);

  if (usuario.length < 3) return mostrarMensaje('El usuario debe tener al menos 3 caracteres.');
  if (error) return mostrarMensaje(error);
  if (buscarUsuario(usuario)) return mostrarMensaje('Ese usuario ya está registrado.');

  const usuarios = obtenerUsuarios();
  usuarios.push({ usuario: usuario, clave: form.password.value, nombre: '' });
  guardarUsuarios(usuarios);
  alert('Cuenta creada. Ya puedes iniciar sesión.');
  location.href = 'login.html';
}

function iniciarSesion(evento) {
  evento.preventDefault();
  const form = evento.target;
  const usuario = buscarUsuario(form.usuario.value.trim());

  if (!usuario || usuario.clave !== form.password.value) {
    return mostrarMensaje('Usuario o contraseña incorrectos.');
  }
  localStorage.setItem('sesion', usuario.usuario);
  location.href = '../menu.html';
}

function recuperarClave(evento) {
  evento.preventDefault();
  const form = evento.target;
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(u => u.usuario === form.usuario.value.trim());
  const error = validarClave(form.nueva.value, form.confirmar.value);

  if (!usuario) return mostrarMensaje('No existe una cuenta con ese usuario.');
  if (error) return mostrarMensaje(error);

  usuario.clave = form.nueva.value;
  guardarUsuarios(usuarios);
  alert('Contraseña actualizada. Inicia sesión con la nueva.');
  location.href = 'login.html';
}

function exigirSesion(rutaLogin) {
  if (!usuarioActual()) location.href = rutaLogin;
}

function salir() {
  localStorage.removeItem('sesion');
}

function mostrarSaludo() {
  const usuario = usuarioActual();
  if (usuario) document.getElementById('nombre-usuario').textContent = usuario.nombre || usuario.usuario;
}

function cargarPerfil() {
  const usuario = usuarioActual();
  if (!usuario) return;
  const form = document.getElementById('form-perfil');
  form.nombre.value = usuario.nombre;
  form.usuario.value = usuario.usuario;
}

function guardarPerfil(evento) {
  evento.preventDefault();
  const form = evento.target;
  const usuarios = obtenerUsuarios();
  const usuario = usuarios.find(u => u.usuario === localStorage.getItem('sesion'));
  const nuevaClave = form['nueva-pass'].value;

  if (nuevaClave || form['confirmar-pass'].value) {
    const error = validarClave(nuevaClave, form['confirmar-pass'].value);
    if (error) return mostrarMensaje(error);
    usuario.clave = nuevaClave;
  }
  usuario.nombre = form.nombre.value.trim();
  guardarUsuarios(usuarios);
  mostrarMensaje('Cambios guardados.', 'ok');
}
