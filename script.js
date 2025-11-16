// ========================================
// CONFIGURACIÓN DE API
// ========================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzzqzqMFRScfryIOQlF6m8dUl_mSNxLAUeser7LebhJgI-u2xJfawhpRdtPBjtGE2J7Pw/exec'; 

// ========================================
// VARIABLES GLOBALES
// ========================================
let PRODUCTOS = [];
let CONFIG = {};
let productosFiltrados = [];
let carrito = [];
let categoriaActual = 'TODOS';

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  cargarCarritoLocalStorage();
  cargarConfiguracion(); 
  cargarProductos();
});

// ========================================
// CARGAR CONFIGURACIÓN (USANDO FETCH)
// ========================================
function cargarConfiguracion() {
  fetch(APPS_SCRIPT_URL + '?action=getConfig')
    .then(res => {
      if (!res.ok) throw new Error('Error en la respuesta del servidor');
      return res.json();
    })
    .then(config => {
      CONFIG = config;
      aplicarConfiguracion(config);
    })
    .catch(error => {
      console.error('Error al cargar configuración:', error);
      // Usar configuración por defecto si falla
      CONFIG = {
        nombre: 'PAOLUKE',
        colorPrimario: '#FF1493',
        colorSecundario: '#8B008B',
        colorFondo: '#FFF0F5',
        tipoFondo: 'SOLIDO',
        logoURL: '',
        instagram: 'disfracespaoluke',
        whatsapp: '56912345678',
        direccion: 'Villa Alemana, Chile',
        mostrarDesc: true
      };
      aplicarConfiguracion(CONFIG);
    });
}

function aplicarConfiguracion(cfg) {
  // Aplicar colores CSS
  document.documentElement.style.setProperty('--color-primario', cfg.colorPrimario);
  document.documentElement.style.setProperty('--color-secundario', cfg.colorSecundario);
  document.documentElement.style.setProperty('--color-fondo', cfg.colorFondo);

  // Aplicar textos
  if (cfg.logoURL) {
    document.getElementById('logoImg').src = cfg.logoURL;
  }
  document.getElementById('instagramLink').href = 'https://www.instagram.com/' + cfg.instagram + '/';
  
  // Footer
  document.getElementById('footerNombre').textContent = cfg.nombre;
  document.getElementById('footerDireccion').textContent = '📍 ' + cfg.direccion;
  document.getElementById('footerWhatsapp').textContent = '📱 WhatsApp: ' + cfg.whatsapp;
  document.getElementById('footerInstagram').href = 'https://www.instagram.com/' + cfg.instagram + '/';
  document.getElementById('footerInstagram').textContent = '📷 @' + cfg.instagram;
  document.getElementById('footerCopyright').textContent = cfg.nombre;

  // Aplicar fondo
  if (cfg.tipoFondo === 'DEGRADADO') {
    document.body.style.background = `linear-gradient(135deg, ${cfg.colorFondo} 0%, ${cfg.colorSecundario}22 100%)`;
  } else if (cfg.tipoFondo === 'PATRON') {
    document.body.style.backgroundColor = cfg.colorFondo;
    document.body.style.backgroundImage = `radial-gradient(${cfg.colorSecundario}22 1px, transparent 1px)`;
    document.body.style.backgroundSize = '20px 20px';
  } else {
    document.body.style.background = cfg.colorFondo;
  }
}

// ========================================
// CARGAR PRODUCTOS (USANDO FETCH)
// ========================================
function cargarProductos() {
  fetch(APPS_SCRIPT_URL + '?action=getProducts')
    .then(res => {
      if (!res.ok) throw new Error('Error en la respuesta del servidor');
      return res.json();
    })
    .then(productos => {
      PRODUCTOS = productos;
      productosFiltrados = productos;
      generarFiltros();
      mostrarProductos();
    })
    .catch(error => {
      console.error('Error al cargar productos:', error);
      mostrarError('Error al cargar productos. Verifica que la URL de Apps Script sea correcta.');
    });
}

function generarFiltros() {
  const categorias = new Set();
  PRODUCTOS.forEach(p => categorias.add(p.categoria));
  
  const filtrosContainer = document.getElementById('filtrosContainer');
  const botonesAdicionales = Array.from(categorias).map(cat =>
    `<button class="filter-btn" onclick="filtrar('${cat}')">${cat}</button>`
  ).join('');
  
  filtrosContainer.innerHTML = `
    <button class="filter-btn active" onclick="filtrar('TODOS')">Todos</button>
    ${botonesAdicionales}
  `;
}

// ========================================
// MOSTRAR PRODUCTOS
// ========================================
function mostrarProductos() {
  const grid = document.getElementById('productosGrid');
  
  if (productosFiltrados.length === 0) {
    grid.innerHTML = '<div class="loading"><p>No se encontraron productos</p></div>';
    return;
  }

  let html = '';
  productosFiltrados.forEach(producto => {
    const estadoClass = producto.estado === 'VENDIDO' ? 'vendido' : 
                        producto.estado === 'RESERVADO' ? 'reservado' : '';
    
    const badge = producto.estado === 'VENDIDO' ? '<div class="badge badge-vendido">VENDIDO</div>' :
                  producto.estado === 'RESERVADO' ? '<div class="badge badge-reservado">RESERVADO</div>' : '';
    
    const precioCL = formatearPrecio(producto.precio);
    const productoJSON = JSON.stringify(producto).replace(/"/g, '&quot;');

    html += `
      <div class="card ${estadoClass}" data-categoria="${producto.categoria}">
        <div class="card-image-container">
          ${badge}
          <img src="${producto.imagen}" class="card-img" onclick="mostrarImagen('${producto.imagen}')" alt="${producto.nombre}">
        </div>
        <div class="card-content">
          <h3 class="product-name">${producto.nombre}</h3>
          <p class="product-price">${precioCL}</p>
          <div class="product-meta">
            <span class="meta-tag">${producto.categoria}</span>
            ${producto.subcategoria ? `<span class="meta-tag">${producto.subcategoria}</span>` : ''}
            ${producto.talla ? `<span class="meta-tag">Talla ${producto.talla}</span>` : ''}
          </div>
          ${CONFIG.mostrarDesc && producto.descripcion ? `<p class="product-desc">${producto.descripcion}</p>` : ''}
          ${producto.estado === 'DISPONIBLE' ? 
            `<button class="btn-comprar" onclick='agregarAlCarrito(${productoJSON})'>🛒 Agregar al Carrito</button>` : 
            `<button class="btn-disabled" disabled>${producto.estado}</button>`
          }
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// ========================================
// FILTRAR Y BUSCAR
// ========================================
function filtrar(categoria) {
  categoriaActual = categoria;
  
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  
  aplicarFiltros();
}

function buscarProductos() {
  aplicarFiltros();
}

function aplicarFiltros() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  
  productosFiltrados = PRODUCTOS.filter(p => {
    const matchCategoria = categoriaActual === 'TODOS' || p.categoria === categoriaActual;
    const matchBusqueda = !searchTerm || 
                          p.nombre.toLowerCase().includes(searchTerm) ||
                          (p.descripcion && p.descripcion.toLowerCase().includes(searchTerm)) ||
                          p.categoria.toLowerCase().includes(searchTerm);
    return matchCategoria && matchBusqueda;
  });

  mostrarProductos();
}

// ========================================
// CARRITO
// ========================================
function agregarAlCarrito(producto) {
  const itemExistente = carrito.find(item => item.id === producto.id);

  if (itemExistente) {
    itemExistente.cantidad++;
    itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1,
      subtotal: producto.precio
    });
  }

  actualizarCarrito();
  guardarCarritoLocalStorage();
  mostrarNotificacion(`✓ ${producto.nombre} agregado al carrito`);
}

function actualizarCarrito() {
  const badge = document.getElementById('cartBadge');
  const itemsContainer = document.getElementById('carritoItems');
  const totalElement = document.getElementById('carritoTotal');
  const btnFinalizar = document.getElementById('btnFinalizarCompra');

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  badge.textContent = totalItems;

  if (carrito.length === 0) {
    itemsContainer.innerHTML = `
      <div class="carrito-vacio">
        <p style="font-size: 60px; margin-bottom: 10px;">🛒</p>
        <p>Tu carrito está vacío</p>
      </div>
    `;
    btnFinalizar.disabled = true;
  } else {
    let html = '';
    carrito.forEach((item, index) => {
      const precioCL = formatearPrecio(item.precio);
      const subtotalCL = formatearPrecio(item.subtotal);

      html += `
        <div class="carrito-item">
          <img src="${item.imagen}" alt="${item.nombre}" class="carrito-item-img" onerror="this.src='https://via.placeholder.com/80'">
          <div class="carrito-item-info">
            <div class="carrito-item-nombre">${item.nombre}</div>
            ${item.talla ? `<div style="font-size: 12px; color: #999;">Talla: ${item.talla}</div>` : ''}
            <div class="carrito-item-precio">${precioCL}</div>
            <div class="carrito-item-controles">
              <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">-</button>
              <span class="cantidad-display">${item.cantidad}</span>
              <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">+</button>
              <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">🗑️</button>
            </div>
            <div style="margin-top: 8px; font-weight: bold; color: var(--color-primario);">
              Subtotal: ${subtotalCL}
            </div>
          </div>
        </div>
      `;
    });
    itemsContainer.innerHTML = html;
    btnFinalizar.disabled = false;
  }

  const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  totalElement.textContent = formatearPrecio(total);
}

function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  } else {
    carrito[index].subtotal = carrito[index].cantidad * carrito[index].precio;
  }

  actualizarCarrito();
  guardarCarritoLocalStorage();
}

function eliminarDelCarrito(index) {
  const producto = carrito[index];
  carrito.splice(index, 1);
  actualizarCarrito();
  guardarCarritoLocalStorage();
  mostrarNotificacion(`✓ ${producto.nombre} eliminado`);
}

function toggleCarrito() {
  const sidebar = document.getElementById('carritoSidebar');
  const overlay = document.getElementById('overlay');
  
  sidebar.classList.toggle('active');
  overlay.classList.toggle('active');
}

// ========================================
// FORMULARIO COMPRA
// ========================================
function mostrarFormularioCompra() {
  if (carrito.length === 0) {
    mostrarNotificacion('⚠️ El carrito está vacío');
    return;
  }

  const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);
  document.getElementById('totalCompra').textContent = formatearPrecio(total);
  
  document.getElementById('modalCompra').classList.add('active');
  document.getElementById('overlay').classList.add('active');
}

function cerrarModalCompra() {
  document.getElementById('modalCompra').classList.remove('active');
  if (!document.getElementById('modalConfirmacion').classList.contains('active')) {
    document.getElementById('overlay').classList.remove('active');
  }
}

function finalizarCompra(event) {
  event.preventDefault();

  const form = event.target;
  const total = carrito.reduce((sum, item) => sum + item.subtotal, 0);

  const datosPedido = {
    action: 'processOrder',
    datosCliente: {
      nombre: form.nombre.value,
      email: form.email.value,
      telefono: form.telefono.value,
      direccion: form.direccion.value,
      notas: form.notas.value
    },
    carrito: carrito,
    total: total
  };

  const btnSubmit = document.getElementById('btnConfirmarPedido');
  
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Procesando...';

  // Enviar con POST regular (sin no-cors)
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(datosPedido)
  })
    .then(res => res.json())
    .then(resultado => {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `Confirmar Pedido - <span id="totalCompra">${formatearPrecio(total)}</span>`;

      if (resultado.exito) {
        cerrarModalCompra();
        mostrarConfirmacion(resultado.idPedido, datosPedido.datosCliente, total);
        carrito = [];
        actualizarCarrito();
        guardarCarritoLocalStorage();
        form.reset();
      } else {
        mostrarNotificacion('❌ Error al procesar pedido: ' + (resultado.mensaje || 'Error desconocido'));
      }
    })
    .catch(error => {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `Confirmar Pedido - <span id="totalCompra">${formatearPrecio(total)}</span>`;
      mostrarNotificacion('❌ Error de red. Intenta de nuevo.');
      console.error('Error en fetch:', error);
    });
}

function mostrarConfirmacion(idPedido, datosCliente, total) {
  document.getElementById('numeroPedido').textContent = idPedido;
  document.getElementById('modalConfirmacion').classList.add('active');
  document.getElementById('overlay').classList.add('active');
  toggleCarrito();

  // Abrir WhatsApp automáticamente
  setTimeout(() => {
    const mensaje = `Hola! Soy ${datosCliente.nombre}. Te escribo por mi pedido ${idPedido} por ${formatearPrecio(total)}`;
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }, 2000);
}

function cerrarModalConfirmacion() {
  document.getElementById('modalConfirmacion').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

function cerrarTodo() {
  document.getElementById('carritoSidebar').classList.remove('active');
  document.getElementById('modalCompra').classList.remove('active');
  document.getElementById('modalConfirmacion').classList.remove('active');
  document.getElementById('modalImagen').classList.remove('show');
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = 'auto';
}

// ========================================
// MODAL IMAGEN
// ========================================
function mostrarImagen(url) {
  document.getElementById('modalImg').src = url;
  document.getElementById('modalImagen').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function cerrarModalImagen() {
  document.getElementById('modalImagen').classList.remove('show');
  document.body.style.overflow = 'auto';
}

// ========================================
// UTILIDADES
// ========================================
function formatearPrecio(numero) {
  return Number(numero).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0
  });
}

function mostrarNotificacion(mensaje) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #2d5016;
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s;
  `;
  toast.textContent = mensaje;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function mostrarError(mensaje) {
  const grid = document.getElementById('productosGrid');
  grid.innerHTML = `
    <div class="loading">
      <p style="color: red;">❌ ${mensaje}</p>
      <button onclick="cargarProductos()" style="margin-top: 20px; padding: 10px 20px; background: var(--color-primario); color: white; border: none; border-radius: 20px; cursor: pointer;">
        Reintentar
      </button>
    </div>
  `;
}

function guardarCarritoLocalStorage() {
  try {
    localStorage.setItem('carritoPaoluke', JSON.stringify(carrito));
  } catch (e) {
    console.log('No se pudo guardar en localStorage');
  }
}

function cargarCarritoLocalStorage() {
  try {
    const carritoGuardado = localStorage.getItem('carritoPaoluke');
    if (carritoGuardado) {
      carrito = JSON.parse(carritoGuardado);
      actualizarCarrito();
    }
  } catch (e) {
    console.log('No se pudo cargar desde localStorage');
  }
}