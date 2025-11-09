// Variables globales
let productos = [];
let categorias = new Set();
let temporadaActiva = CONFIG.DEFAULT_SEASON;
let productoSeleccionado = null;
// Inicialización
document.addEventListener('DOMContentLoaded', () => {
inicializarApp();
});
async function inicializarApp() {
configurarEnlaces();
await cargarDatos();
configurarEventos();
}
// Configurar enlaces externos
function configurarEnlaces() {
const whatsappGeneral = document.getElementById('whatsapp-general');
const instagramLink = document.getElementById('instagram-link');
const instagramFooter = document.getElementById('instagram-footer');
const mensajeWhatsApp = encodeURIComponent('¡Hola! Me gustaría consultar sobre los productos de PaoLUKE.');
whatsappGeneral.href = `https://wa.me/${CONFIG.WHATSAPP}?text=${mensajeWhatsApp}`;

instagramLink.href = CONFIG.INSTAGRAM;
instagramFooter.href = CONFIG.INSTAGRAM;
}
// Cargar datos desde la API
async function cargarDatos() {
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
try {
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    
    const response = await fetch(CONFIG.DATA_URL);
    
    if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
    }
    
    const data = await response.json();
    
    productos = data.productos || [];
    temporadaActiva = data.temporadaActiva || CONFIG.DEFAULT_SEASON;
    
    // Extraer categorías únicas
    productos.forEach(producto => {
        if (producto.Categoria) {
            categorias.add(producto.Categoria);
        }
    });
    
    aplicarTema(temporadaActiva);
    renderizarCategorias();
    renderizarProductos(productos);
    
    loading.style.display = 'none';
    
} catch (error) {
    console.error('Error al cargar datos:', error);
    loading.style.display = 'none';
    errorMessage.style.display = 'block';
}
}
// Aplicar tema según temporada
function aplicarTema(temporada) {
const themeLink = document.getElementById('theme-link');
const seasonBackground = document.querySelector('.season-background');
const themeUrl = CONFIG.SEASON_THEMES[temporada] || CONFIG.SEASON_THEMES[CONFIG.DEFAULT_SEASON];
themeLink.href = themeUrl;

// Aplicar fondo de temporada
const backgroundPath = themeUrl.replace('theme.css', 'fondo.svg');
seasonBackground.style.backgroundImage = `url('${backgroundPath}')`;
}
// Renderizar opciones de categorías
function renderizarCategorias() {
const select = document.getElementById('categoria-filter');
categorias.forEach(categoria => {
    const option = document.createElement('option');
    option.value = categoria;
    option.textContent = categoria;
    select.appendChild(option);
});
}
// Renderizar productos
function renderizarProductos(productosAMostrar) {
const grid = document.getElementById('productos-grid');
grid.innerHTML = '';
if (productosAMostrar.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem;">No se encontraron productos.</p>';
    return;
}

productosAMostrar.forEach(producto => {
    const card = crearTarjetaProducto(producto);
    grid.appendChild(card);
});
}
// Crear tarjeta de producto
function crearTarjetaProducto(producto) {
const card = document.createElement('div');
card.className = 'producto-card';
const esVendido = producto.Estado && producto.Estado.toLowerCase() === 'vendido';
if (esVendido) {
    card.classList.add('vendido');
}

const mensajeWhatsApp = encodeURIComponent(
    `Hola, me interesa el producto: ${producto.Nombre} - $${producto.Precio}`
);
const urlWhatsApp = `https://wa.me/${CONFIG.WHATSAPP}?text=${mensajeWhatsApp}`;

card.innerHTML = `
    <img src="${producto.Imagen || 'https://via.placeholder.com/280x280?text=Sin+Imagen'}" 
         alt="${producto.Nombre}" 
         class="producto-imagen"
         onerror="this.src='https://via.placeholder.com/280x280?text=Sin+Imagen'">
    <div class="producto-info">
        <h3 class="producto-nombre">${producto.Nombre}</h3>
        <p class="producto-descripcion">${producto.Descripcion || 'Sin descripción disponible'}</p>
        <div class="producto-detalles">
            <span class="producto-precio">$${formatearPrecio(producto.Precio)}</span>
            <span class="producto-estado ${esVendido ? 'estado-vendido' : 'estado-disponible'}">
                ${esVendido ? 'Vendido' : 'Disponible'}
            </span>
        </div>
        <div class="producto-acciones">
            <a href="${urlWhatsApp}" 
               class="btn-whatsapp" 
               target="_blank"
               ${esVendido ? 'style="pointer-events: none; opacity: 0.5;"' : ''}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Comprar
            </a>
            <button class="btn-comentarios" onclick="abrirModalComentarios('${producto.ID}', '${producto.Nombre}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Ver comentarios
            </button>
        </div>
    </div>
`;

return card;
}
// Formatear precio
function formatearPrecio(precio) {
return new Intl.NumberFormat('es-CL').format(precio);
}
// Configurar eventos
function configurarEventos() {
// Filtro de categorías
document.getElementById('categoria-filter').addEventListener('change', (e) => {
const categoriaSeleccionada = e.target.value;
    if (categoriaSeleccionada === 'todas') {
        renderizarProductos(productos);
    } else {
        const productosFiltrados = productos.filter(p => p.Categoria === categoriaSeleccionada);
        renderizarProductos(productosFiltrados);
    }
});

// Modal
const modal = document.getElementById('comentarios-modal');
const closeBtn = document.querySelector('.modal-close');

closeBtn.onclick = () => {
    modal.style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Enviar comentario

document.getElementById('enviar-comentario').addEventListener('click', enviarComentario);
}
// Abrir modal de comentarios
async function abrirModalComentarios(productoID, nombreProducto) {
productoSeleccionado = productoID;
const modal = document.getElementById('comentarios-modal');
const modalTitle = document.getElementById('modal-producto-nombre');
const comentariosList = document.getElementById('comentarios-list');

modalTitle.textContent = nombreProducto;
modal.style.display = 'block';

// Limpiar comentario anterior
document.getElementById('comentario-texto').value = '';

// Cargar comentarios
comentariosList.innerHTML = `
    <div class="loading">
        <div class="spinner"></div>
        <p>Cargando comentarios...</p>
    </div>
`;

await cargarComentarios(productoID);
}
// Cargar comentarios de un producto
async function cargarComentarios(productoID) {
const comentariosList = document.getElementById('comentarios-list');
try {
    const response = await fetch(`${CONFIG.DATA_URL}?comentarios=true&productoID=${productoID}`);
    
    if (!response.ok) {
        throw new Error('Error al cargar comentarios');
    }
    
    const data = await response.json();
    const comentarios = data.comentarios || [];
    
    if (comentarios.length === 0) {
        comentariosList.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Aún no hay comentarios. ¡Sé el primero en comentar!</p>';
        return;
    }
    
    comentariosList.innerHTML = '';
    comentarios.forEach(comentario => {
        const comentarioDiv = document.createElement('div');
        comentarioDiv.className = 'comentario-item';
        comentarioDiv.innerHTML = `
            <div class="comentario-usuario">${comentario.Usuario || 'Anónimo'}</div>
            <div class="comentario-texto">${comentario.Comentario}</div>
        `;
        comentariosList.appendChild(comentarioDiv);
    });
    
} catch (error) {
    console.error('Error al cargar comentarios:', error);
    comentariosList.innerHTML = '<p style="text-align: center; color: #e74c3c; padding: 2rem;">Error al cargar comentarios.</p>';
}
}
// Enviar comentario
async function enviarComentario() {
const textoComentario = document.getElementById('comentario-texto').value.trim();
if (!textoComentario) {
    mostrarNotificacion('Por favor escribe un comentario', 'error');
    return;
}

if (!productoSeleccionado) {
    mostrarNotificacion('Error: No se ha seleccionado un producto', 'error');
    return;
}

const btnEnviar = document.getElementById('enviar-comentario');
btnEnviar.disabled = true;
btnEnviar.textContent = 'Enviando...';

try {
    const response = await fetch(CONFIG.DATA_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ProductoID: productoSeleccionado,
            Usuario: 'Anónimo',
            Comentario: textoComentario
        })
    });
    
    if (!response.ok) {
        throw new Error('Error al enviar comentario');
    }
    
    document.getElementById('comentario-texto').value = '';
    mostrarNotificacion('Comentario enviado. Pendiente de aprobación.', 'success');
    
} catch (error) {
    console.error('Error al enviar comentario:', error);
    mostrarNotificacion('Error al enviar comentario. Intenta nuevamente.', 'error');
} finally {
    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar comentario';
}
}
// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'success') {
const notificacion = document.getElementById('notificacion');
notificacion.textContent = mensaje;
notificacion.style.background = tipo === 'error' ? '#e74c3c' : '#2c3e50';
notificacion.classList.add('show');
setTimeout(() => {
    notificacion.classList.remove('show');
}, 4000);
}
