// === CONFIGURACIÓN ===
const API_URL = "https://script.google.com/macros/s/AKfycbxj3P9bEej7rOrUz5ZZ1psv-ZoHGlEprkYRxVxYwLPWfL3D5xX1sDWi2bffg-4HACsW/exec"; 
// ↑ reemplázalo con tu URL de despliegue WebApp (la que termina en /exec)

// === CARGA INICIAL ===
document.addEventListener("DOMContentLoaded", async () => {
  mostrarCargando(true);
  await cargarProductos();
  mostrarCargando(false);
});

// === FUNCIONES PRINCIPALES ===
async function cargarProductos() {
  try {
    const res = await fetch(`${API_URL}`);
    const data = await res.json();

    if (!data.productos) throw new Error("No se pudieron cargar los productos");

    document.querySelector("#temporadaActiva").textContent =
      `Temporada actual: ${data.temporadaActiva || "Default"}`;

    const contenedor = document.querySelector("#productos");
    contenedor.innerHTML = "";

    data.productos.forEach(prod => {
      const card = document.createElement("div");
      card.className = "producto-card";
      card.innerHTML = `
        <img src="${prod.Imagen || 'no-image.png'}" alt="${prod.Nombre}">
        <h3>${prod.Nombre}</h3>
        <p>${prod.Descripcion || ''}</p>
        <span class="precio">$${prod.Precio}</span>
        <button onclick="verComentarios('${prod.ID}')">Ver comentarios</button>
        <button onclick="mostrarFormularioComentario('${prod.ID}')">Comentar</button>
        <div id="comentarios-${prod.ID}" class="comentarios"></div>
      `;
      contenedor.appendChild(card);
    });

  } catch (err) {
    console.error("Error al cargar productos:", err);
    alert("Hubo un problema al cargar los productos.");
  }
}

async function verComentarios(productoID) {
  const contenedor = document.querySelector(`#comentarios-${productoID}`);
  contenedor.innerHTML = "<p>Cargando comentarios...</p>";

  try {
    const res = await fetch(`${API_URL}?comentarios=true&productoID=${encodeURIComponent(productoID)}`);
    const data = await res.json();

    if (!data.comentarios || data.comentarios.length === 0) {
      contenedor.innerHTML = "<p>No hay comentarios aprobados aún.</p>";
      return;
    }

    contenedor.innerHTML = data.comentarios.map(c => `
      <div class="comentario">
        <strong>${c.Usuario || "Anónimo"}</strong>
        <p>${c.Comentario}</p>
        <small>${new Date(c.FechaCreacion).toLocaleString("es-CL")}</small>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error al obtener comentarios:", err);
    contenedor.innerHTML = "<p>Error al cargar comentarios.</p>";
  }
}

function mostrarFormularioComentario(productoID) {
  const formHTML = `
    <div class="formulario-comentario">
      <input type="text" id="usuario-${productoID}" placeholder="Tu nombre (opcional)">
      <textarea id="texto-${productoID}" placeholder="Escribe tu comentario..."></textarea>
      <button onclick="enviarComentario('${productoID}')">Enviar</button>
    </div>
  `;
  document.querySelector(`#comentarios-${productoID}`).innerHTML = formHTML;
}

async function enviarComentario(productoID) {
  const usuario = document.querySelector(`#usuario-${productoID}`).value || "Anónimo";
  const comentario = document.querySelector(`#texto-${productoID}`).value.trim();

  if (!comentario) {
    alert("Por favor, escribe un comentario antes de enviar.");
    return;
  }

  const datos = {
    ProductoID: productoID,
    Usuario: usuario,
    Comentario: comentario
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos)
    });

    const data = await res.json();

    if (data.success) {
      alert("Comentario enviado correctamente. Será visible cuando sea aprobado.");
      document.querySelector(`#comentarios-${productoID}`).innerHTML = "";
    } else {
      throw new Error(data.error || "Error desconocido");
    }

  } catch (err) {
    console.error("Error al enviar comentario:", err);
    alert("No se pudo enviar el comentario. Intenta nuevamente.");
  }
}

// === UTILIDAD ===
function mostrarCargando(mostrar) {
  const loader = document.querySelector("#loader");
  if (!loader) return;
  loader.style.display = mostrar ? "block" : "none";
}
