# BBC Brands × Black Bear — código del mockup

Entrega: 17 de septiembre de 2026.

Este ZIP contiene el código editable completo del mockup: Home, Nosotros, Contacto, estilos, interacciones, tipografías y archivos multimedia. Es una web estática en HTML, CSS y JavaScript, sin proceso de compilación.

**No es un tema instalable de WordPress.** Entregar al desarrollador para adaptar la web a un tema o implementación personalizada. No subir este ZIP desde “Instalar tema”.

## Ver el mockup localmente

Con Python 3 instalado, abrir una terminal en la carpeta `sitio` y ejecutar:

```sh
python3 -m http.server 8000
```

Abrir http://localhost:8000/ en el navegador. Las otras páginas son http://localhost:8000/nosotros/ y http://localhost:8000/contacto/.

Usar un servidor local: abrir los HTML con doble clic no basta, porque el proyecto usa rutas desde la raíz y carga la configuración del formulario mediante HTTP. También sirve cualquier servidor estático cuya raíz sea `sitio`.

## Contenido

- `sitio/`: código y recursos completos, copiados sin cambios de la versión actual.
- `GUIA-WORDPRESS.md`: instrucciones de adaptación y pendientes.
- `documentacion/FUENTES-Y-ASSETS.md`: procedencia de los recursos.
- `documentacion/INVENTARIO-SHA256.json`: tamaños y huellas para comprobar integridad de los archivos originales.

El formulario todavía no tiene un canal real de recepción. Algunas imágenes, proyectos y datos son demostrativos. Leer la guía antes de publicar una versión de producción.

Actualización: Franie sustituye a Manrope en las tres páginas.
