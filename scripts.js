// scripts.js

// Variables globales
let productoSeleccionado = null;

// Al cargar la página
document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductos();
  configurarModal();
});

// ============================================
// Cargar productos desde Apps Script
// ============================================
async function cargarProductos() {
  const loader = document.getElementById("loading");
  const grid = document.getElementById("productos-grid");
  const errorMsg = document.getElementById("error-message");

  loader.style.display = "flex";
  grid.innerHTML = "";
  errorMsg.style.display = "none";

  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    loader.style.display = "none";

    if (!data.productos || data.productos.length === 0) {
      grid.innerHTML = "<p>No hay productos disponibles.</p>";
      return;
    }

    // Mostrar productos
    data.productos.forEach(prod => {
      const card = document.createElement("div");
      card.className = "producto-card";
      card.innerHTML = `
        <img src="${prod.Imagen || 'no-image.png'}" alt="${prod.Nombre}">
        <div class="producto-info">
          <h3>${prod.Nombre}</h3>
          <p>${prod.Descripcion || ''}</p>
          <span class="precio">$${prod.Precio || 0}</span>
          <button class="btn-ver-comentarios" data-id="${prod.ID}" data-nombre="${prod.Nombre}">
            Ver comentarios
          </button>
        </div>
      `;
      grid.appendChild(card);
    });

    // Asignar eventos a los botones
    document.querySelectorAll(".btn-ver-comentarios").forEach(btn => {
      btn.addEventListener("click", e => {
        const productoID = e.target.getAttribute("data-id");
        const nombre = e.target.getAttribute("data-nombre");
        abrirModalComentarios(productoID, nombre);
      });
    });

  } catch (error) {
    console.error("Error al cargar productos:", error);
    loader.style.display = "none";
    errorMsg.style.display = "block";
  }
}

// ============================================
// Modal de comentarios
// ============================================
function configurarModal() {
  const modal = document.getElementById("comentarios-modal");
  const closeBtn = document.querySelector(".modal-close");

  closeBtn.onclick = () => (modal.style.display = "none");
  window.onclick = e => {
    if (e.target === modal) modal.style.display = "none";
  };

  document.getElementById("enviar-comentario").addEventListener("click", enviarComentario);
}

async function abrirModalComentarios(productoID, nombreProducto) {
  productoSeleccionado = productoID;
  const modal = document.getElementById("comentarios-modal");
  const lista = document.getElementById("comentarios-list");
  const titulo = document.getElementById("modal-producto-nombre");

  modal.style.display = "flex";
  titulo.textContent = nombreProducto;
  lista.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Cargando comentarios...</p>
    </div>
  `;

  try {
    const res = await fetch(`${API_URL}?comentarios=true&productoID=${encodeURIComponent(productoID)}`);
    const data = await res.json();

    if (!data.comentarios || data.comentarios.length === 0) {
      lista.innerHTML = "<p>No hay comentarios aprobados todavía.</p>";
      return;
    }

    lista.innerHTML = data.comentarios
      .map(c => `
        <div class="comentario-item">
          <strong>${c.Usuario || "Anónimo"}</strong>
          <p>${c.Comentario}</p>
          <small>${new Date(c.FechaCreacion).toLocaleString("es-CL")}</small>
        </div>
      `)
      .join("");

  } catch (error) {
    console.error("Error al cargar comentarios:", error);
    lista.innerHTML = "<p>Error al obtener comentarios.</p>";
  }
}

// ============================================
// Enviar comentario
// ============================================
async function enviarComentario() {
  const textarea = document.getElementById("comentario-texto");
  const texto = textarea.value.trim();

  if (!texto) {
    mostrarNotificacion("Por favor escribe un comentario antes de enviar.");
    return;
  }

  const datos = {
    ProductoID: productoSeleccionado,
    Comentario: texto,
    Usuario: "Anónimo"
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const data = await res.json();

    if (data.success) {
      mostrarNotificacion("Comentario enviado. Será visible cuando sea aprobado. ✅");
      textarea.value = "";
    } else {
      throw new Error(data.error || "Error desconocido al enviar comentario");
    }
  } catch (err) {
    console.error("Error al enviar comentario:", err);
    mostrarNotificacion("No se pudo enviar el comentario. Intenta nuevamente.");
  }
}

// ============================================
// Notificación flotante
// ============================================
function mostrarNotificacion(mensaje) {
  const notif = document.getElementById("notificacion");
  notif.textContent = mensaje;
  notif.classList.add("visible");
  setTimeout(() => notif.classList.remove("visible"), 4000);
}
