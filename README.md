# BBC Brands × Black Bear

Sitio estático completo con Home, Nosotros y Contacto. Incluye HTML, CSS, JavaScript, fuentes, logos, fotos y video.

## Publicar en Vercel

1. Descomprime el ZIP y sube su contenido a la raíz del repositorio.
2. Importa el repositorio en Vercel.
3. Framework Preset: Other. Sin instalación ni compilación.
4. Output Directory: dist (ya configurado en vercel.json).
5. Publica el proyecto.

Vista local: python -m http.server 8000 --directory dist

## Pendientes

Los perfiles y algunos proyectos son ejemplos identificados en el sitio. Faltan los enlaces oficiales de Instagram, Meta y LinkedIn. El envío del formulario requiere configurar un endpoint real en dist/contact-config.json.

## Código

Home: dist/index.html, dist/app.js y dist/home-review.css.
Internas: dist/nosotros/index.html, dist/contacto/index.html, dist/inner.js y dist/inner-review.css.
Estilos base: dist/style.css. Recursos: dist/assets.


## Perfiles y música del equipo
`dist/team-profiles.json` contiene seis espacios pendientes de información aprobada: nombre, cargo, biografía, fotografía, LinkedIn y URL de playlist. No se han inventado datos personales. `team-profiles.js` integra los campos confirmados en las tarjetas existentes. Los enlaces musicales se abren sólo al pulsarlos, sin reproducción automática.

Para ingeniería: esta versión admite enlaces HTTPS a playlists por perfil, sin backend adicional. Un reproductor embebido requiere seleccionar proveedor y revisar sus requisitos, consentimiento, accesibilidad y comportamiento en móvil; no está implementado. No se ha contactado a un ingeniero. Confirmar las URLs, permisos de fotografías y biografías antes de completar la configuración.
