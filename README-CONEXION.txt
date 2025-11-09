═══════════════════════════════════════════════════════════════
  PAOLUKE - GUÍA DE CONEXIÓN CON APPSHEET Y GOOGLE APPS SCRIPT
═══════════════════════════════════════════════════════════════
📋 RESUMEN
Este sitio web estático consume datos desde una API creada en Google Apps Script,
que se conecta a tablas de AppSheet para gestionar productos, temporadas y comentarios.
═══════════════════════════════════════════════════════════════
🔧 CONFIGURACIÓN INICIAL
═══════════════════════════════════════════════════════════════


EDITAR config.js
Abre el archivo "config.js" y modifica:

DATA_URL: Reemplaza "XXXXXXXXX" con el ID de tu script de Apps Script
Ejemplo: "https://script.google.com/macros/s/AKfycby...XXXX/exec"
WHATSAPP: Tu número de WhatsApp en formato internacional (sin +)
Ejemplo: "56956892107"
INSTAGRAM: URL de tu perfil de Instagram
Ejemplo: "https://www.instagram.com/disfracespaoluke"



═══════════════════════════════════════════════════════════════
📊 ESTRUCTURA DE DATOS ESPERADA (AppSheet)
═══════════════════════════════════════════════════════════════
TABLA: Productos
Columnas necesarias:

ID (Text) - Identificador único
Nombre (Text) - Nombre del producto
Descripcion (LongText) - Descripción del producto
Precio (Number) - Precio en pesos chilenos
Categoria (Text) - Categoría (ej: "Disfraces", "Ropa", "Accesorios")
Estado (Text) - "Disponible" o "Vendido"
Imagen (Image/URL) - URL pública de la imagen del producto

TABLA: Temporadas
Columnas necesarias:

Nombre (Text) - Nombre de la temporada
Activa (Yes/No) - Indica si está activa

Valores válidos para Nombre:

"Default"
"Halloween"
"Navidad"
"Pascua"
"Día del Niño"

TABLA: Comentarios
Columnas necesarias:

ID (Text) - Identificador único (auto-generado)
ProductoID (Ref a Productos) - ID del producto comentado
Usuario (Text) - Nombre del usuario (por defecto "Anónimo")
Comentario (LongText) - Texto del comentario
Aprobado (Yes/No) - Si el comentario está aprobado para mostrarse
FechaCreacion (DateTime) - Fecha de creación

═══════════════════════════════════════════════════════════════
🔌 API DE GOOGLE APPS SCRIPT
═══════════════════════════════════════════════════════════════
ENDPOINT BASE:
https://script.google.com/macros/s/TU_SCRIPT_ID/exec
MÉTODOS DISPONIBLES:

GET - Obtener productos y temporada activa
Petición: GET /exec
Respuesta JSON:
{
"productos": [
{
"ID": "prod_001",
"Nombre": "Disfraz de Spider-Man",
"Descripcion": "Talla M, incluye máscara",
"Precio": 25000,
"Categoria": "Disfraces",
"Estado": "Disponible",
"Imagen": "https://..."
}
],
"temporadaActiva": "Halloween"
}

2ReintentarJContinuar. GET - Obtener comentarios de un producto
Petición: GET /exec?comentarios=true&productoID=prod_001
Respuesta JSON:
{
"comentarios": [
{
"ID": "com_001",
"ProductoID": "prod_001",
"Usuario": "Anónimo",
"Comentario": "Excelente calidad, muy recomendado",
"FechaCreacion": "2025-10-15T14:30:00"
}
]
}

POST - Enviar nuevo comentario
Petición: POST /exec
Headers: Content-Type: application/json
Body:
{
"ProductoID": "prod_001",
"Usuario": "Anónimo",
"Comentario": "Me encantó este producto"
}
Respuesta JSON:
{
"success": true,
"message": "Comentario enviado correctamente"
}

═══════════════════════════════════════════════════════════════
💻 CÓDIGO DE GOOGLE APPS SCRIPT (EJEMPLO)
═══════════════════════════════════════════════════════════════
Crea un nuevo proyecto en Apps Script y pega el siguiente código:
javascript// URL de tu aplicación AppSheet API
const APPSHEET_APP_ID = "TU_APP_ID";
const APPSHEET_API_KEY = "TU_API_KEY";

function doGet(e) {
  const params = e.parameter;
  
  // Si solicitan comentarios
  if (params.comentarios === "true" && params.productoID) {
    return obtenerComentarios(params.productoID);
  }
  
  // Por defecto, devolver productos y temporada
  return obtenerDatos();
}

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents);
    return crearComentario(datos);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function obtenerDatos() {
  // Obtener productos
  const productos = obtenerProductosDeAppSheet();
  
  // Obtener temporada activa
  const temporadas = obtenerTemporadasDeAppSheet();
  const temporadaActiva = temporadas.find(t => t.Activa) || { Nombre: "Default" };
  
  const respuesta = {
    productos: productos,
    temporadaActiva: temporadaActiva.Nombre
  };
  
  return ContentService.createTextOutput(JSON.stringify(respuesta))
    .setMimeType(ContentService.MimeType.JSON);
}

function obtenerComentarios(productoID) {
  const comentarios = obtenerComentariosDeAppSheet(productoID);
  
  const respuesta = {
    comentarios: comentarios
  };
  
  return ContentService.createTextOutput(JSON.stringify(respuesta))
    .setMimeType(ContentService.MimeType.JSON);
}

function crearComentario(datos) {
  // Crear nuevo comentario en AppSheet
  const resultado = crearComentarioEnAppSheet(datos);
  
  return ContentService.createTextOutput(
    JSON.stringify({ success: true, message: "Comentario enviado correctamente" })
  ).setMimeType(ContentService.MimeType.JSON);
}

// Funciones auxiliares para conectar con AppSheet
// (Debes adaptarlas según tu configuración de AppSheet API)

function obtenerProductosDeAppSheet() {
  // Implementar llamada a AppSheet API
  // Ejemplo con UrlFetchApp:
  /*
  const url = `https://api.appsheet.com/api/v2/apps/${APPSHEET_APP_ID}/tables/Productos/Action`;
  const options = {
    method: "post",
    headers: {
      "ApplicationAccessKey": APPSHEET_API_KEY,
      "Content-Type": "application/json"
    },
    payload: JSON.stringify({
      "Action": "Find",
      "Properties": {},
      "Rows": []
    })
  };
  
  const response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText());
  */
  
  // Por ahora, devolver datos de ejemplo
  return [];
}

function obtenerTemporadasDeAppSheet() {
  // Similar a obtenerProductosDeAppSheet
  return [{ Nombre: "Default", Activa: true }];
}

function obtenerComentariosDeAppSheet(productoID) {
  // Similar a obtenerProductosDeAppSheet
  // Filtrar por ProductoID y Aprobado = true
  return [];
}

function crearComentarioEnAppSheet(datos) {
  // Implementar llamada a AppSheet API para crear registro
  return true;
}
```

IMPORTANTE: Después de crear el script:
1. Ve a "Implementar" > "Nueva implementación"
2. Selecciona "Aplicación web"
3. Ejecutar como: Tu cuenta
4. Acceso: Cualquier persona
5. Copia la URL generada y pégala en config.js

═══════════════════════════════════════════════════════════════
🚀 DESPLIEGUE EN GITHUB PAGES
═══════════════════════════════════════════════════════════════

1. Crea un repositorio en GitHub llamado "paoluke-web"

2. Sube todos los archivos del proyecto manteniendo la estructura:
   
   PaoLUKE_Web/
   ├── index.html
   ├── style.css
   ├── script.js
   ├── config.js
   ├── README-CONEXION.txt
   └── assets/
       ├── default/
       ├── halloween/
       ├── navidad/
       ├── pascua/
       └── dia_del_nino/

3. Ve a Settings > Pages en tu repositorio

4. En "Source", selecciona la rama "main" y carpeta "/ (root)"

5. Haz clic en "Save"

6. Tu sitio estará disponible en:
   https://TU_USUARIO.github.io/paoluke-web/

═══════════════════════════════════════════════════════════════
🎨 PERSONALIZACIÓN DE TEMAS
═══════════════════════════════════════════════════════════════

Cada temporada tiene su propio CSS y fondo SVG:

assets/
  ├── default/
  │   ├── theme.css (Colores urbanos azul/gris)
  │   └── fondo.svg (Patrones geométricos)
  ├── halloween/
  │   ├── theme.css (Negro/naranja/púrpura)
  │   └── fondo.svg (Calabazas, murciélagos)
  ├── navidad/
  │   ├── theme.css (Verde/rojo/dorado)
  │   └── fondo.svg (Árboles, estrellas, copos)
  ├── pascua/
  │   ├── theme.css (Pasteles rosado/celeste)
  │   └── fondo.svg (Huevos, conejos, flores)
  └── dia_del_nino/
      ├── theme.css (Amarillo/celeste/rojo vivo)
      └── fondo.svg (Globos, confeti, juguetes)

Para cambiar la temporada activa:
1. Ve a AppSheet
2. En la tabla "Temporadas", marca como "Activa = Yes" la temporada deseada
3. Las demás deben estar en "Activa = No"
4. El sitio web cambiará automáticamente al cargar

═══════════════════════════════════════════════════════════════
🛠️ SOLUCIÓN DE PROBLEMAS
═══════════════════════════════════════════════════════════════

Problema: Los productos no se cargan
Solución:
  - Verifica que config.js tenga la URL correcta del script
  - Asegúrate de que el script de Apps Script esté desplegado como "web app"
  - Verifica que el acceso sea "Cualquier persona"
  - Revisa la consola del navegador (F12) para ver errores

Problema: Las imágenes no se muestran
Solución:
  - Las URLs de imágenes en AppSheet deben ser públicas
  - Si usas Google Drive, marca los archivos como "Cualquiera con el enlace"
  - Verifica que las URLs en la columna "Imagen" sean accesibles

Problema: Los comentarios no se envían
Solución:
  - Verifica que el método doPost() esté implementado en Apps Script
  - Asegúrate de tener permisos de escritura en AppSheet
  - Revisa los logs de Apps Script para ver errores

Problema: El tema no cambia
Solución:
  - Verifica que en AppSheet solo haya UNA temporada con Activa = Yes
  - El nombre de la temporada debe coincidir exactamente con los de config.js
  - Limpia la caché del navegador (Ctrl + Shift + R)

Problema: Error CORS al hacer peticiones
Solución:
  - En Apps Script, asegúrate de devolver ContentService con MimeType JSON
  - El script debe estar desplegado como "aplicación web"
  - No uses "Solo yo" en el acceso, debe ser "Cualquier persona"

═══════════════════════════════════════════════════════════════
📱 FUNCIONALIDADES DEL SITIO
═══════════════════════════════════════════════════════════════

✅ Catálogo dinámico de productos desde AppSheet
✅ Filtrado por categorías
✅ Diseño responsive (mobile-first)
✅ Temas visuales por temporada (automático)
✅ Botones de WhatsApp por producto
✅ Sistema de comentarios con aprobación
✅ Estados de producto (Disponible/Vendido)
✅ Integración con Instagram
✅ Optimizado para GitHub Pages
✅ Sin backend propio (serverless)
✅ Carga rápida y SEO-friendly

═══════════════════════════════════════════════════════════════
📞 FLUJO DE VENTAS
═══════════════════════════════════════════════════════════════

1. Cliente ve producto en el sitio
2. Cliente hace clic en "Comprar" (botón WhatsApp)
3. Se abre WhatsApp con mensaje predefinido
4. Vendes manualmente por WhatsApp
5. Cuando vendas, cambias Estado a "Vendido" en AppSheet
6. El producto aparece marcado como vendido en el sitio

═══════════════════════════════════════════════════════════════
🔒 SEGURIDAD Y PRIVACIDAD
═══════════════════════════════════════════════════════════════

- Los comentarios requieren aprobación manual en AppSheet
- No se almacenan datos sensibles en el frontend
- Las URLs de la API no exponen credenciales
- WhatsApp maneja los datos de contacto
- Sin sistema de pagos = sin riesgo de fraude online

═══════════════════════════════════════════════════════════════
📊 MANTENIMIENTO
═══════════════════════════════════════════════════════════════

Tareas periódicas:
  □ Revisar comentarios pendientes en AppSheet
  □ Actualizar productos disponibles
  □ Cambiar temporada activa según calendario
  □ Verificar enlaces de Instagram/WhatsApp
  □ Renovar imágenes de productos vendidos
  □ Hacer backup de datos en AppSheet

═══════════════════════════════════════════════════════════════
🎯 PRÓXIMOS PASOS SUGERIDOS
═══════════════════════════════════════════════════════════════

1. Configura tu app en AppSheet con las tablas mencionadas
2. Crea el script de Google Apps Script
3. Edita config.js con tus datos reales
4. Prueba localmente (abre index.html en navegador)
5. Sube a GitHub y activa Pages
6. Comparte tu sitio: https://TU_USUARIO.github.io/paoluke-web/

═══════════════════════════════════════════════════════════════
💡 CONSEJOS ADICIONALES
═══════════════════════════════════════════════════════════════

- Usa imágenes optimizadas (max 500KB por imagen)
- Actualiza productos regularmente para mantener interés
- Responde rápido por WhatsApp para mejorar conversión
- Comparte el enlace en tus redes sociales
- Considera agregar Google Analytics para métricas
- Haz respaldo manual de AppSheet cada mes

═══════════════════════════════════════════════════════════════

¿Necesitas ayuda? 
- Documentación AppSheet: https://help.appsheet.com
- Documentación Apps Script: https://developers.google.com/apps-script
- Documentación GitHub Pages: https://pages.github.com

═══════════════════════════════════════════════════════════════
© 2025 PaoLUKE - Todos los derechos reservados
═══════════════════════════════════════════════════════════════