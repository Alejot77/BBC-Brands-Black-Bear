# Guía de entrega al desarrollador WordPress

## Objetivo

Adaptar el mockup conservando su diseño y sus interacciones, y permitir que el equipo edite contenidos desde WordPress. Este paquete es la fuente del diseño, no un tema PHP terminado ni una migración automática. No requiere Node ni instalación de dependencias para visualizarse.

## Mapa de archivos

| Archivo | Función |
| --- | --- |
| `sitio/index.html` | Home: hero, servicios, aliados, cifras, proyectos y CTA |
| `sitio/nosotros/index.html` | Manifiesto, método y equipo |
| `sitio/contacto/index.html` | Brief de cuatro pasos |
| `sitio/style.css` | Estilos compartidos y ajustes de las tres páginas |
| `sitio/app.js` | Interacciones y datos de Home |
| `sitio/inner.js` | Interacciones de Nosotros y Contacto; envío del brief |
| `sitio/contact-config.json` | Dirección del servicio receptor; actualmente nula |
| `sitio/font.css`, `assets/fonts/Franie-*.woff2` | Franie local, pesos 100–900 |
| `sitio/assets/` | Logos, símbolos, fotografías y videos |

El CSS y JavaScript están compactados pero son la fuente editable, no un bundle que requiera reconstrucción. Home y páginas internas usan scripts distintos: no cargarlos juntos indiscriminadamente. Mantener los identificadores y clases que el JavaScript busca o actualizar sus selectores al reorganizar las plantillas.

## Adaptación propuesta

1. Crear las plantillas de Home, Nosotros y Contacto, y extraer cabecera y footer compartidos.
2. Registrar los estilos y scripts en WordPress, cargando `app.js` en Home e `inner.js` en las páginas internas.
3. Adaptar todas las rutas absolutas: `/assets/`, `/style.css`, `/font.css`, fuentes, scripts y `/contact-config.json`. Revisar también las rutas construidas dentro del JavaScript y las referencias CSS. Deben resolver a los archivos del tema o a la biblioteca multimedia, incluso si WordPress vive en una subcarpeta.
4. Conectar navegación, anclas y enlaces a las páginas reales. Conservar las rutas de Nosotros y Contacto o actualizar todos los enlaces.
5. Convertir en contenidos editables los servicios, aliados, cifras, proyectos, categorías, equipo y enlaces sociales. Parte de estos datos está dentro de `app.js`, no solo en HTML.
6. Conectar el brief a un servicio de recepción real y reemplazar el contenido provisional.
7. Verificar el resultado en móvil, escritorio, teclado y dispositivos táctiles antes de publicar.

El universo de servicios, las animaciones y las tarjetas requieren conservar o adaptar JavaScript personalizado. No basta con pegar el HTML de toda la página en el editor visual.

## Formulario: contrato actual

`contact-config.json` tiene `submitEndpoint: null`; por ello no se envía ninguna solicitud. La interfaz informa que el envío aún no está habilitado.

Al configurarlo, `inner.js` envía por POST un JSON con los campos del formulario, tomados de sus atributos `name`. Si no hay fecha, envía `fecha` como `Por definir`. El servidor debe validar los datos y registrar o entregar la solicitud al destinatario acordado. El cliente espera una respuesta HTTP exitosa y JSON con `success: true`; solo entonces muestra confirmación. El tiempo máximo de espera actual es 15 segundos.

En WordPress, implementar el receptor o integrar la solución de formularios elegida, adaptando este contrato cuando haga falta. Añadir validación del lado servidor, protección frente a spam y manejo de errores. No guardar contraseñas, claves de correo ni secretos en el JSON público. Acordar el correo receptor y realizar una prueba de entrega real. El botón debe enviar; no copiar el brief.

El botón de WhatsApp todavía no tiene número real. Los enlaces sociales también están pendientes: sustituir los estados de muestra por destinos confirmados.

## Contenido pendiente

- **Showreel:** el video de concierto es de referencia, no material de la agencia. Sustituir por el showreel real y confirmar los permisos de uso de todos los recursos antes de producción.
- **Equipo:** los tres retratos son personas ficticias generadas con IA. Reemplazar por fotos, nombres, cargos, hobbies y perfiles reales; no presentarlos como empleados reales.
- **Método:** las fotografías de concepto, montaje y logística también son ilustrativas, generadas con IA.
- **Proyectos:** casos demostrativos, no casos acreditados. Sustituir títulos, clientes, imágenes, resultados y métricas de ejemplo por información aprobada.
- **Cifras:** validar los números suministrados y sustituir los valores XX pendientes antes de publicar.
- **Aliados:** 18 marcas según la última lista. Archivos individuales oficiales o de Wikimedia reemplazan los recortes de captura. SVG con imágenes incrustadas recortan únicamente márgenes de los archivos raster. Colores originales al interactuar; Chazki blanco y verde sobre soporte negro y Padel Co. blanco invertido para legibilidad. Ver procedencia de cada archivo en FUENTES-Y-ASSETS.md.
- **Tipografía:** Franie incorporada desde los archivos suministrados por la usuaria. Se usan WOFF2 estáticos, pesos 100–900. En esta familia SemiLight corresponde a 400 y Regular a 500. Conservar la documentación de licencia de la marca.
- **Servicios individuales:** no hay páginas de detalle, su alcance aún no está confirmado.

Consultar `documentacion/FUENTES-Y-ASSETS.md` para procedencia. El paquete no acredita derechos de uso sobre materiales de terceros ; el archivo suministrado de Franie no contenía un documento de licencia.

## Criterios de diseño a conservar

- Negro, blanco puro, grises y lima `#d1ff00` como único neón.
- Footer negro y abierto, sin convertir cada grupo en una caja.
- CTA anterior al footer sobre blanco.
- Ambas marcas con presencia equilibrada.
- Universo de servicios: iluminar las palabras, mantener conexiones neutrales.
- Aliados monocromos que recuperan sus colores en hover/foco; tamaños equilibrados visualmente.
- Proyectos con formato uniforme y movimiento al hacer scroll.
- Nosotros: “NO SOMOS / UNO MÁS.” con igual tamaño y peso; símbolos de las marcas, sin wordmarks decorativos ni los eyebrows eliminados.
- Mantener pausa de movimiento, preferencia de movimiento reducido y alternativas para teclado y touch.

## Asignación actual de servicios

| BBC Brands | Black Bear |
| --- | --- |
| Marketing 360 | Eventos |
| Central de medios | Promotoría |
| Experiencias inmersivas | Talento artístico |
| Creatividad | |

## Comprobación de la adaptación

Revisar navegación de las tres páginas, ausencia de archivos 404, logo Walmart y otros aliados, filtrado de proyectos, universo de servicios, hover del método, tarjetas de equipo, movimiento reducido y formulario completo. Probar envío exitoso y fallido con el receptor real. Revisar que los administradores puedan modificar contenidos sin tocar las animaciones.

Entrega actualizada el 17 de septiembre de 2026 con Franie, aplicada también al sitio publicado.

## Actualización del mapa del sitio

Ver documentacion/REVISION-MAPA-SITIO.md. Se añadió historia desplegable a Nosotros y ubicación/medios directos a Contacto. Faltan hitos históricos y fechas, ciudad y dirección, correo, teléfono y WhatsApp reales. No publicar esos campos como datos definitivos.

Contacto: los medios directos ahora se presentan en cuatro tarjetas sobre blanco, con despliegue nativo, movimiento de cursor y soporte para movimiento reducido. Sustituir los estados pendientes por los enlaces reales al aprobar los datos.
